import { Hono } from 'hono'

type Bindings = {
  BREVO_API_KEY: string
}

export const apiSubscribe = new Hono<{ Bindings: Bindings }>()

async function sendWelcomeEmail(email: string, apiKey: string) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf8f4; padding: 48px 32px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <p style="font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #4a7c59; margin: 0;">Puesto de Palta</p>
      </div>
      <h2 style="font-family: Georgia, serif; font-size: 26px; color: #0a0a0a; line-height: 1.3; margin: 0 0 16px; font-weight: 400;">Bienvenido/a al loop paltero.</h2>
      <p style="color: #555; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
        Ya sos parte. Cada vez que suba una nota nueva te va a llegar directo acá.
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.7; margin: 0 0 32px;">
        <strong style="color: #0a0a0a;">Un tip importante:</strong> si este mail cayó en spam, marcalo como "No es spam" para que los próximos lleguen directo a tu bandeja.
      </p>
      <a href="https://puestodepalta.com/blog" style="display: inline-block; background: #0a0a0a; color: #faf8f4; text-decoration: none; padding: 14px 28px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Ver las notas →</a>
      <hr style="margin: 48px 0; border: none; border-top: 1px solid #e0ddd7;">
      <p style="font-size: 12px; color: #aaa; text-align: center; line-height: 1.8;">
        Puesto de Palta · Buenos Aires<br>
        <a href="https://puestodepalta.com" style="color: #4a7c59;">puestodepalta.com</a>
      </p>
    </div>
  `
  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Puesto de Palta', email: 'contacto@puestodepalta.com' },
        to: [{ email }],
        subject: '¡Ya sos parte del loop paltero!',
        htmlContent: html,
        textContent: 'Bienvenido/a al loop paltero. Ya sos parte — cada nota nueva te llega directo acá.\n\nSi este mail cayó en spam, marcalo como "No es spam".\n\nVer las notas: https://puestodepalta.com/blog\n\nPuesto de Palta · Buenos Aires',
      })
    })
  } catch (_) {}
}

apiSubscribe.post('/', async (c) => {
  try {
    const { email } = await c.req.json()
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Email inválido.' }, 400)
    }

    const apiKey = c.env?.BREVO_API_KEY || ''

    // Add contact to Brevo list (list ID 2 by default, or create default list)
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
        attributes: {
          SOURCE: 'website_subscription'
        }
      })
    })

    // 204 = created, 400 with "Contact already exist" is also ok
    if (res.status === 204 || res.status === 201) {
      await sendWelcomeEmail(email, apiKey)
      return c.json({ success: true })
    }

    const data = await res.json() as any
    // If contact already exists, treat as success
    if (data?.code === 'duplicate_parameter') {
      return c.json({ success: true })
    }

    if (!res.ok) {
      console.error('Brevo subscribe error:', data)
      return c.json({ error: 'Error al suscribirse.' }, 500)
    }

    await sendWelcomeEmail(email, apiKey)
    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ error: err.message || 'Error interno.' }, 500)
  }
})
