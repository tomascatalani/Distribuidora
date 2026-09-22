import { Hono } from 'hono'

type Bindings = {
  BREVO_API_KEY: string
}

export const apiContact = new Hono<{ Bindings: Bindings }>()

apiContact.post('/', async (c) => {
  try {
    const { name, email, phone, message } = await c.req.json()
    if (!name || !email || !phone) {
      return c.json({ error: 'Nombre, email y teléfono son requeridos.' }, 400)
    }

    const apiKey = c.env?.BREVO_API_KEY || ''

    const emailBody = {
      sender: { name: 'Puesto de Palta Web', email: 'contacto@puestodepalta.com' },
      to: [
        { email: 'tomascatalani@gmail.com', name: 'Tomás Catalani' }
      ],
      replyTo: { email, name },
      subject: `Nuevo mensaje de contacto de ${name}`,
      textContent: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nMensaje:\n${message || '(sin mensaje)'}`,
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #faf8f4;">
          <h2 style="color: #0a0a0a; font-size: 20px; margin-bottom: 24px;">Nuevo mensaje de contacto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px; width: 100px;"><strong>Nombre:</strong></td><td style="padding: 8px 0; color: #0a0a0a;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color:#4a7c59;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Teléfono:</strong></td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color:#4a7c59;">${phone}</a></td></tr>
          </table>
          ${message ? `<div style="margin-top: 24px; padding: 20px; background: #fff; border-left: 3px solid #4a7c59;"><p style="color: #0a0a0a; line-height: 1.7; white-space: pre-wrap;">${message}</p></div>` : ''}
          <p style="margin-top: 32px; font-size: 12px; color: #999;">Puesto de Palta · Buenos Aires · Respondé directamente a este mail para contactar a ${name}</p>
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
