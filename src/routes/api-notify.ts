import { Hono } from 'hono'

type Bindings = {
  BREVO_API_KEY: string
  ONESIGNAL_APP_ID: string
  ONESIGNAL_API_KEY: string
}

export const apiNotify = new Hono<{ Bindings: Bindings }>()

const BREVO_LIST_ID    = 2
const BREVO_SENDER_ID  = 2   // "Puesto de Palta - Blog Paltero" <contacto@puestodepalta.com>

const DEFAULT_BREVO_KEY = ''
const DEFAULT_OS_APP_ID = 'f79c1b7e-b2fc-4f3f-a7eb-fb0ba3dec26e'
const DEFAULT_OS_API_KEY = ''

// ── Email HTML template ───────────────────────────────────────────────────────

function buildEmailHtml(title: string, excerpt: string, articleUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#faf8f4;border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#6aaa82;">Puesto de Palta</p>
          </td>
        </tr>

        <!-- Label -->
        <tr>
          <td style="padding:40px 40px 0;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#6aaa82;">Nueva nota del blog paltero</p>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:20px 40px 0;">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;line-height:1.3;color:#0a0a0a;">${title}</h1>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:24px 40px 0;">
            <div style="width:40px;height:2px;background:#6aaa82;"></div>
          </td>
        </tr>

        ${excerpt ? `
        <!-- Excerpt -->
        <tr>
          <td style="padding:24px 40px 0;">
            <p style="margin:0;font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#444;font-style:italic;">${excerpt}</p>
          </td>
        </tr>` : ''}

        <!-- CTA -->
        <tr>
          <td style="padding:36px 40px 48px;">
            <a href="${articleUrl}" style="display:inline-block;background:#0a0a0a;color:#faf8f4;text-decoration:none;padding:14px 32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Leer nota →</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0ede8;padding:28px 40px;border-top:1px solid #e0ddd7;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999;line-height:1.8;text-align:center;">
              Puesto de Palta · Buenos Aires<br>
              Recibís esto porque te suscribiste en <a href="https://puestodepalta.com" style="color:#6aaa82;text-decoration:none;">puestodepalta.com</a><br>
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

// ── Create + send Brevo email campaign ───────────────────────────────────────
// Uses the Marketing Campaigns API: 1 API call per newsletter, regardless of
// subscriber count. No SMTP transactional credits consumed.

async function sendBrevoEmailCampaign(opts: {
  apiKey: string
  title: string
  excerpt: string
  slug: string
}): Promise<{ ok: boolean; campaignId?: number; error?: string }> {
  const { apiKey, title, excerpt, slug } = opts
  const articleUrl = `https://puestodepalta.com/blog/${slug}`
  const htmlContent = buildEmailHtml(title, excerpt, articleUrl)
  const textContent = `${title}\n\n${excerpt || ''}\n\nLeer nota: ${articleUrl}\n\n---\nDesuscribirte: {{unsubscribe}}`

  // 1. Create campaign
  const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name:        `Blog: ${title.slice(0, 80)}`,
      subject:     `Nueva nota: ${title}`,
      sender:      { id: BREVO_SENDER_ID },
      type:        'classic',
      htmlContent,
      textContent,
      recipients:  { listIds: [BREVO_LIST_ID] },
    })
  })

  if (!createRes.ok) {
    const errText = await createRes.text()
    return { ok: false, error: `Create campaign failed (${createRes.status}): ${errText}` }
  }

  const createData = await createRes.json() as any
  const campaignId: number = createData.id

  // 2. Send immediately
  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Accept': 'application/json',
    }
  })

  if (!sendRes.ok) {
    const errText = await sendRes.text()
    return { ok: false, campaignId, error: `Send campaign failed (${sendRes.status}): ${errText}` }
  }

  return { ok: true, campaignId }
}

// ── Send notifications (push + email campaign) ────────────────────────────────

export async function sendNotifications(opts: {
  title: string
  excerpt: string
  slug: string
  brevoKey: string
  osAppId: string
  osApiKey: string
}): Promise<{ onesignal: any; brevo: any }> {
  const { title, excerpt, slug, brevoKey, osAppId, osApiKey } = opts
  const articleUrl = `https://puestodepalta.com/blog/${slug}`
  const results: any = { onesignal: null, brevo: null }

  // ── 1. OneSignal push ──────────────────────────────────────────────────────
  try {
    const osRes = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${osApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        app_id:              osAppId,
        included_segments:   ['All'],
        headings:            { es: '🥑 Puesto de Palta', en: '🥑 Puesto de Palta' },
        contents:            { es: title, en: title },
        web_url:             articleUrl,
        chrome_web_icon:     'https://puestodepalta.com/favicon.svg',
        firefox_icon:        'https://puestodepalta.com/favicon.svg',
      })
    })
    const osData = await osRes.json()
    results.onesignal = { ok: osRes.ok, status: osRes.status, data: osData }
  } catch (e: any) {
    results.onesignal = { ok: false, error: e.message }
  }

  // ── 2. Brevo email campaign ────────────────────────────────────────────────
  try {
    const brevoResult = await sendBrevoEmailCampaign({ apiKey: brevoKey, title, excerpt, slug })
    results.brevo = brevoResult
  } catch (e: any) {
    results.brevo = { ok: false, error: e.message }
  }

  return results
}

// ── POST /api/notify ─────────────────────────────────────────────────────────

apiNotify.post('/', async (c) => {
  try {
    const { title, excerpt, slug } = await c.req.json()
    if (!title || !slug) {
      return c.json({ error: 'title y slug son requeridos.' }, 400)
    }

    const results = await sendNotifications({
      title,
      excerpt: excerpt || '',
      slug,
      brevoKey: c.env?.BREVO_API_KEY     || DEFAULT_BREVO_KEY,
      osAppId:  c.env?.ONESIGNAL_APP_ID  || DEFAULT_OS_APP_ID,
      osApiKey: c.env?.ONESIGNAL_API_KEY || DEFAULT_OS_API_KEY,
    })

    return c.json({ success: true, results })
  } catch (err: any) {
    return c.json({ error: err.message || 'Error interno.' }, 500)
  }
})
