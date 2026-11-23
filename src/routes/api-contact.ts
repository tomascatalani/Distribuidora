import { Hono } from 'hono'
import { formGuard, EMAIL_RE } from '../lib/edge'
import { esc } from '../lib/site'

type Bindings = {
  BREVO_API_KEY: string
}

export const apiContact = new Hono<{ Bindings: Bindings }>()

apiContact.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const clean = (v: any, max: number) => String(v ?? '').trim().slice(0, max)
    const name = clean(body?.name, 120)
    const email = clean(body?.email, 254)
    const phone = clean(body?.phone, 40)
    const business = clean(body?.business, 120)
    const message = clean(body?.message, 3000)
    if (!name || !email || !EMAIL_RE.test(email)) {
      return c.json({ error: 'Nombre y un email válido son requeridos.' }, 400)
    }

    // Anti-bots: a un bot se le contesta "ok" sin mandar nada, para que no insista.
    const guard = await formGuard(c, body, 'contact')
    if (guard === 'bot') return c.json({ success: true, message: 'Mensaje enviado correctamente.' })
    if (guard === 'forbidden') return c.json({ error: 'No permitido.' }, 403)
    if (guard === 'too-many') return c.json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, 429)

    // Todo lo que escribió la persona va limpio al mail (sin HTML ni links armados).
    const n = esc(name), e = esc(email), ph = esc(phone), b = esc(business), m = esc(message)

    const apiKey = c.env?.BREVO_API_KEY || ''

    const emailBody = {
      sender: { name: 'Puesto de Palta Web', email: 'contacto@puestodepalta.com' },
      to: [
        { email: 'tomascatalani@gmail.com', name: 'Tomás Catalani' }
      ],
      replyTo: { email, name },
      subject: `Nuevo mensaje de contacto de ${name}${business ? ` (${business})` : ''}`,
      textContent: `Nombre: ${name}\nNegocio: ${business || '-'}\nEmail: ${email}\nTeléfono: ${phone || '-'}\n\nMensaje:\n${message || '(sin mensaje)'}`,
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #faf8f4;">
          <h2 style="color: #0a0a0a; font-size: 20px; margin-bottom: 24px;">Nuevo mensaje de contacto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px; width: 100px;"><strong>Nombre:</strong></td><td style="padding: 8px 0; color: #0a0a0a;">${n}</td></tr>
            ${b ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Negocio:</strong></td><td style="padding: 8px 0; color: #0a0a0a;">${b}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${e}" style="color:#4a7c59;">${e}</a></td></tr>
            ${ph ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Teléfono:</strong></td><td style="padding: 8px 0;"><a href="tel:${ph}" style="color:#4a7c59;">${ph}</a></td></tr>` : ''}
          </table>
          ${m ? `<div style="margin-top: 24px; padding: 20px; background: #fff; border-left: 3px solid #4a7c59;"><p style="color: #0a0a0a; line-height: 1.7; white-space: pre-wrap;">${m}</p></div>` : ''}
          <p style="margin-top: 32px; font-size: 12px; color: #999;">Puesto de Palta · Buenos Aires · Respondé directamente a este mail para contactar a ${n}</p>
        </div>
      `
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailBody)
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Brevo contact error:', errText)
      return c.json({ error: 'Error al enviar el mensaje.' }, 500)
    }

    return c.json({ success: true, message: 'Mensaje enviado correctamente.' })
  } catch (err: any) {
    return c.json({ error: err.message || 'Error interno.' }, 500)
  }
})
