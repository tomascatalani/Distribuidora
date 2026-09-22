import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { homePage } from './routes/home'
import { blogPage } from './routes/blog'
import { apiBlog } from './routes/api-blog'
import { apiContact } from './routes/api-contact'
import { apiSubscribe } from './routes/api-subscribe'
import { apiNotify, sendNotifications } from './routes/api-notify'

type Bindings = {
  NOTION_TOKEN: string
  NOTION_DB_ID: string
  BREVO_API_KEY: string
  ONESIGNAL_APP_ID: string
  ONESIGNAL_API_KEY: string
  NOTIFIED_ARTICLES: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))
app.use('/public/*', serveStatic({ root: './' }))

// Pages
app.route('/', homePage)
app.route('/blog', blogPage)

// API Routes
app.route('/api/blog', apiBlog)
app.route('/api/contact', apiContact)
app.route('/api/subscribe', apiSubscribe)
app.route('/api/notify', apiNotify)

// Cron endpoint — called by cron-job.org every 5 minutes
app.get('/api/cron', async (c) => {
  const secret = c.req.header('x-cron-secret') || c.req.query('secret')
  if (secret !== 'palta2026cron') {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  try {
    const report = await checkAndNotifyWithReport(c.env as Bindings)
    return c.json({ ok: true, ran: new Date().toISOString(), report })
  } catch (e: any) {
    return c.json({ ok: false, error: e.message }, 500)
  }
})

// ── Scheduled cron: poll Notion every 5 min for newly published articles ─────

async function checkAndNotifyWithReport(env: Bindings) {
  const NOTION_TOKEN = env.NOTION_TOKEN  || ''
  const NOTION_DB_ID = env.NOTION_DB_ID  || '3233fd35-c857-8076-8608-f97f0cbf9873'
  const BREVO_KEY    = env.BREVO_API_KEY || ''
  const OS_APP_ID    = env.ONESIGNAL_APP_ID  || 'f79c1b7e-b2fc-4f3f-a7eb-fb0ba3dec26e'
  const OS_API_KEY   = env.ONESIGNAL_API_KEY || ''
  const KV = env.NOTIFIED_ARTICLES
  const report: any[] = []
  report.push({ kvAvailable: !!KV })

  // Query Notion for all published articles
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'Publicar', checkbox: { equals: true } },
      sorts:  [{ property: 'Fecha', direction: 'descending' }],
    })
  })
  if (!dbRes.ok) return [{ error: `Notion DB error: ${dbRes.status}` }]

  const db = await dbRes.json() as any
  const pages = db.results || []
  report.push({ notionArticles: pages.length })

  for (const page of pages) {
    const pageId = page.id
    const props  = page.properties

    const title   = (props?.Title?.title || []).map((t: any) => t.plain_text).join('') || 'Sin título'
    const slugRaw = (props?.Slug?.rich_text || []).map((t: any) => t.plain_text).join('').trim()
    const slug    = slugRaw || pageId

    // Check KV
    const alreadyNotified = KV ? await KV.get(`notified:${pageId}`) : null
    if (alreadyNotified) {
      report.push({ title, slug, skipped: 'ya notificado' })
      continue
    }

    // Get excerpt
    let excerpt = ''
    try {
      const bRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=10`, {
        headers: { 'Authorization': `Bearer ${NOTION_TOKEN}`, 'Notion-Version': '2022-06-28' }
      })
      if (bRes.ok) {
        const bData = await bRes.json() as any
        for (const block of (bData.results || [])) {
          if (block.type === 'paragraph') {
            const text = (block.paragraph?.rich_text || []).map((t: any) => t.plain_text).join('').trim()
            if (text) { excerpt = text.length > 150 ? text.slice(0, 150) + '…' : text; break }
          }
        }
      }
    } catch (_) {}

    // Send notifications
    const results = await sendNotifications({ title, excerpt, slug, brevoKey: BREVO_KEY, osAppId: OS_APP_ID, osApiKey: OS_API_KEY })
    report.push({ title, slug, notified: true, results })

    // Mark as notified in KV
    if (KV) {
      await KV.put(`notified:${pageId}`, JSON.stringify({ title, slug, notifiedAt: new Date().toISOString() }))
    }
  }

  return report
}

async function checkAndNotify(env: Bindings) {
  await checkAndNotifyWithReport(env)
}

// Export fetch + scheduled handlers
export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(checkAndNotify(env))
  }
}
