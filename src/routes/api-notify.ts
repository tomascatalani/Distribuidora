import { Hono } from 'hono'

// Envío de avisos cuando sale una nota nueva: push por OneSignal y campaña por
// Brevo a la lista de suscriptores. Lo usa el cron (src/index.tsx) y el endpoint
// manual POST /api/notify (protegido con CRON_SECRET).

type Bindings = {
  BREVO_API_KEY: string
  ONESIGNAL_APP_ID: string
  ONESIGNAL_API_KEY: string
  ALERT_EMAIL?: string
}

export const apiNotify = new Hono<{ Bindings: Bindings }>()

export const BREVO_LIST_ID    = 2
export const BREVO_SENDER_ID  = 2   // "Puesto de Palta - Blog Paltero" <contacto@puestodepalta.com>
export const SITE_URL         = 'https://puestodepalta.com'
export const DEFAULT_ALERT_EMAIL = 'tomascatalani@gmail.com'

// ── Email HTML de la campaña ──────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildEmailHtml(title: string, excerpt: string, articleUrl: string): string {
  const t = escapeHtml(title)
  const e = escapeHtml(excerpt)
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t}</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#faf8f4;border-radius:4px;overflow:hidden;">
        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#6aaa82;">Puesto de Palta</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 0;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#6aaa82;">Nueva nota del blog paltero</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 0;">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;line-height:1.3;color:#0a0a0a;">${t}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 0;">
            <div style="width:40px;height:2px;background:#6aaa82;"></div>
          </td>
        </tr>
        ${e ? `
        <tr>
          <td style="padding:24px 40px 0;">
            <p style="margin:0;font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#444;font-style:italic;">${e}</p>
          </td>
        </tr>` : ''}
        <tr>
          <td style="padding:36px 40px 48px;">
            <a href="${articleUrl}" style="display:inline-block;background:#0a0a0a;color:#faf8f4;text-decoration:none;padding:14px 32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Leer nota →</a>
          </td>
        </tr>
        <tr>
          <td style="background:#f0ede8;padding:28px 40px;border-top:1px solid #e0ddd7;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999;line-height:1.8;text-align:center;">
              Puesto de Palta · Buenos Aires<br>
              Recibís esto porque te suscribiste en <a href="${SITE_URL}" style="color:#6aaa82;text-decoration:none;">puestodepalta.com</a><br>
              <a href="{{unsubscribe}}" style="color:#bbb;text-decoration:underline;">Desuscribirte</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Campaña de Brevo ──────────────────────────────────────────────────────────
// Usa la API de campañas: una sola llamada por nota, sin importar cuántos
// suscriptores haya. Si ya existe una campaña creada de un intento anterior
// (campaignId), solo reintenta el envío en vez de crear otra.

export type BrevoResult = { ok: boolean; campaignId?: number; error?: string }

async function sendBrevoEmailCampaign(opts: {
  apiKey: string
  title: string
  excerpt: string
  slug: string
  campaignId?: number
}): Promise<BrevoResult> {
  const { apiKey, title, excerpt, slug } = opts
  let campaignId = opts.campaignId
  const articleUrl = `${SITE_URL}/blog/${slug}`

  if (!campaignId) {
    const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:        `Blog: ${title.slice(0, 80)}`,
        subject:     `Nueva nota: ${title}`,
        sender:      { id: BREVO_SENDER_ID },
        type:        'classic',
        htmlContent: buildEmailHtml(title, excerpt, articleUrl),
        textContent: `${title}\n\n${excerpt || ''}\n\nLeer nota: ${articleUrl}\n\n---\nDesuscribirte: {{unsubscribe}}`,
        recipients:  { listIds: [BREVO_LIST_ID] },
      }),
    })
    if (!createRes.ok) {
      return { ok: false, error: `Create campaign failed (${createRes.status}): ${await createRes.text()}` }
    }
    campaignId = ((await createRes.json()) as any).id
  }

  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Accept': 'application/json' },
  })
  if (!sendRes.ok) {
    return { ok: false, campaignId, error: `Send campaign failed (${sendRes.status}): ${await sendRes.text()}` }
  }
  return { ok: true, campaignId }
}

// ── Push de OneSignal ─────────────────────────────────────────────────────────

async function sendOneSignalPush(opts: { appId: string; apiKey: string; title: string; articleUrl: string }) {
  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: { 'Authorization': `Key ${opts.apiKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      app_id:            opts.appId,
      included_segments: ['All'],
      headings:          { es: '🥑 Puesto de Palta', en: '🥑 Puesto de Palta' },
      contents:          { es: opts.title, en: opts.title },
      web_url:           opts.articleUrl,
      chrome_web_icon:   `${SITE_URL}/favicon.svg`,
      firefox_icon:      `${SITE_URL}/favicon.svg`,
    }),
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, data }
}

// ── Aviso de nota nueva: push + campaña ───────────────────────────────────────

export type NotifyResults = { onesignal: any; brevo: BrevoResult }

export async function sendNotifications(opts: {
  title: string
  excerpt: string
  slug: string
  brevoKey: string
  osAppId: string
  osApiKey: string
  campaignId?: number   // reintento de una campaña ya creada
}): Promise<NotifyResults> {
  const articleUrl = `${SITE_URL}/blog/${opts.slug}`
  const results: NotifyResults = { onesignal: null, brevo: { ok: false } }

  try {
    results.onesignal = await sendOneSignalPush({ appId: opts.osAppId, apiKey: opts.osApiKey, title: opts.title, articleUrl })
  } catch (e: any) {
    results.onesignal = { ok: false, error: e.message }
  }

  try {
    results.brevo = await sendBrevoEmailCampaign({
      apiKey: opts.brevoKey, title: opts.title, excerpt: opts.excerpt, slug: opts.slug, campaignId: opts.campaignId,
    })
  } catch (e: any) {
    results.brevo = { ok: false, campaignId: opts.campaignId, error: e.message }
  }

  return results
}

// ── Mail de alerta a Tomás (cuando algo falla) ────────────────────────────────

export async function sendAlertEmail(opts: { apiKey: string; to: string; subject: string; text: string }): Promise<boolean> {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': opts.apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Puesto de Palta Web', email: 'contacto@puestodepalta.com' },
        to: [{ email: opts.to }],
        subject: opts.subject,
        textContent: opts.text,
      }),
    })
    return res.ok
  } catch (_) {
    return false
  }
}

// ── POST /api/notify — envío manual (requiere CRON_SECRET, ver src/index.tsx) ──

apiNotify.post('/', async (c) => {
  try {
    const { title, excerpt, slug, campaignId } = await c.req.json()
    if (!title || !slug) {
      return c.json({ error: 'title y slug son requeridos.' }, 400)
    }
    const results = await sendNotifications({
      title,
      excerpt: excerpt || '',
      slug,
      campaignId: campaignId ? Number(campaignId) : undefined,
      brevoKey: c.env.BREVO_API_KEY,
      osAppId:  c.env.ONESIGNAL_APP_ID,
      osApiKey: c.env.ONESIGNAL_API_KEY,
    })
    return c.json({ success: results.brevo.ok, results })
  } catch (err: any) {
    return c.json({ error: err.message || 'Error interno.' }, 500)
  }
})
