import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { homePage } from './routes/home'
import { blogPage } from './routes/blog'
import { apiBlog } from './routes/api-blog'
import { apiContact } from './routes/api-contact'
import { apiSubscribe } from './routes/api-subscribe'
import { apiNotify, sendNotifications, sendAlertEmail, DEFAULT_ALERT_EMAIL, SITE_URL } from './routes/api-notify'
import { listPublished, parseArticle, fetchBlocks, extractExcerpt, shortExcerpt } from './lib/notion'

// Variables de entorno (se cargan en Cloudflare Pages → Settings → Variables and Secrets).
// Ver docs/MIGRACION.md, sección 4.
type Bindings = {
  NOTION_TOKEN: string
  NOTION_DB_ID: string
  BREVO_API_KEY: string
  ONESIGNAL_APP_ID: string
  ONESIGNAL_API_KEY: string
  CRON_SECRET?: string        // clave que debe mandar cron-job.org (o quien llame a /api/notify)
  NOTIFY_ENABLED?: string     // "true" SOLO en producción. Si falta, el cron no manda nada (modo simulación).
  ALERT_EMAIL?: string        // a quién avisar si falla un envío (por defecto tomascatalani@gmail.com)
  NOTIFIED_ARTICLES: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Los archivos estáticos (favicons, worker de OneSignal) los sirve Cloudflare Pages
// directamente; están excluidos del Worker en dist/_routes.json (ver vite.config.ts).
app.use('/api/*', cors())

// ── Protección con secreto para el cron y el envío manual ────────────────────

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const requireSecret = async (c: any, next: () => Promise<void>) => {
  const expected = c.env.CRON_SECRET
  if (!expected) {
    return c.json({ error: 'CRON_SECRET no está configurado en Cloudflare.' }, 503)
  }
  const given = c.req.header('x-cron-secret') || c.req.query('secret') || ''
  if (!timingSafeEqual(given, expected)) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
}

app.use('/api/notify', requireSecret)
app.use('/api/notify/*', requireSecret)
app.use('/api/cron', requireSecret)

// Páginas
app.route('/', homePage)
app.route('/blog', blogPage)

// API
app.route('/api/blog', apiBlog)
app.route('/api/contact', apiContact)
app.route('/api/subscribe', apiSubscribe)
app.route('/api/notify', apiNotify)

// ── Cron: avisar a los suscriptores cuando hay una nota nueva ────────────────
// Lo llama cron-job.org cada 5 minutos: GET /api/cron?secret=CRON_SECRET
// Modo simulación: si NOTIFY_ENABLED no es "true", o se pasa ?dry=1, solo informa
// qué haría y no manda ni graba nada. Así el proyecto de prueba nunca spamea.

const MAX_ATTEMPTS = 3

type Pending = { attempts: number; campaignId?: number; lastError?: string; lastTry?: string; alerted?: boolean }

app.get('/api/cron', async (c) => {
  const env = c.env
  const dry = env.NOTIFY_ENABLED !== 'true' || c.req.query('dry') === '1'
  const KV = env.NOTIFIED_ARTICLES
  const report: any[] = [{ mode: dry ? 'simulacion (no envia nada)' : 'real', kvAvailable: !!KV }]

  try {
    const pages = await listPublished(env)
    report.push({ notasPublicadas: pages.length })

    for (const page of pages) {
      const article = parseArticle(page)
      const { id: pageId, title, slug } = article

      const alreadyNotified = KV ? await KV.get(`notified:${pageId}`) : null
      if (alreadyNotified) { report.push({ title, skipped: 'ya notificada' }); continue }

      const pending: Pending | null = KV ? await KV.get(`pending:${pageId}`, 'json') : null
      if (pending && pending.attempts >= MAX_ATTEMPTS) {
        report.push({ title, skipped: `fallo ${pending.attempts} veces, requiere revision manual`, lastError: pending.lastError })
        continue
      }

      if (dry) { report.push({ title, slug, wouldNotify: true, attemptsSoFar: pending?.attempts || 0 }); continue }

      // Excerpt: el manual de Notion, o el primer párrafo
      let excerpt = article.excerpt
      if (!excerpt) {
        try { excerpt = extractExcerpt(await fetchBlocks(env, pageId)) } catch (_) {}
      }
      excerpt = shortExcerpt(excerpt)

      const results = await sendNotifications({
        title, excerpt, slug,
        brevoKey: env.BREVO_API_KEY,
        osAppId:  env.ONESIGNAL_APP_ID,
        osApiKey: env.ONESIGNAL_API_KEY,
        campaignId: pending?.campaignId,
      })

      if (results.brevo.ok) {
        // Solo se marca como notificada cuando la campaña de Brevo salió de verdad.
        if (KV) {
          await KV.put(`notified:${pageId}`, JSON.stringify({
            title, slug, notifiedAt: new Date().toISOString(),
            campaignId: results.brevo.campaignId,
            onesignalOk: !!results.onesignal?.ok,
          }))
          await KV.delete(`pending:${pageId}`)
        }
        report.push({ title, slug, notified: true, results })
        continue
      }

      // Falló el mail: anotar el intento y reintentar en la próxima corrida.
      const next: Pending = {
        attempts: (pending?.attempts || 0) + 1,
        campaignId: results.brevo.campaignId ?? pending?.campaignId,
        lastError: results.brevo.error,
        lastTry: new Date().toISOString(),
        alerted: pending?.alerted || false,
      }
      if (next.attempts >= MAX_ATTEMPTS && !next.alerted) {
        next.alerted = await sendAlertEmail({
          apiKey: env.BREVO_API_KEY,
          to: env.ALERT_EMAIL || DEFAULT_ALERT_EMAIL,
          subject: `Fallo el aviso de la nota: ${title}`,
          text: `No se pudo mandar la campaña de Brevo para "${title}" (${SITE_URL}/blog/${slug}) después de ${next.attempts} intentos.\n\nUltimo error: ${results.brevo.error}\n\nQue hacer: revisar los créditos y la campaña en Brevo. Cuando esté resuelto, borrar la clave pending:${pageId} del KV NOTIFIED_ARTICLES en Cloudflare y el cron lo reintenta solo.`,
        })
      }
      if (KV) await KV.put(`pending:${pageId}`, JSON.stringify(next))
      report.push({ title, slug, notified: false, attempt: next.attempts, error: results.brevo.error })
    }

    return c.json({ ok: true, ran: new Date().toISOString(), report })
  } catch (e: any) {
    report.push({ error: e.message })
    return c.json({ ok: false, ran: new Date().toISOString(), report }, 500)
  }
})

export default app
