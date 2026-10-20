// PASO 5 — Mail a Tomás: "hay un borrador nuevo para revisar".
// Uso: node scripts/contenido/5-avisar.mjs .contenido/articulo.json
import { readFileSync } from 'node:fs'
import { env } from './lib.mjs'

const a = JSON.parse(readFileSync(process.argv[2] || '.contenido/articulo.json', 'utf8'))
const to = env('ALERT_EMAIL', { fallback: 'tomascatalani@gmail.com' })
const text = `Hay un nuevo borrador en Notion.

Título: ${a.titulo}
Slug: ${a.slug}
Fecha: ${a.fecha}
Imagen: ${a.imagen_url}
Palabras: ${a.palabras || ''}

Revisalo, editá si hace falta, y activá Publicar cuando estés listo.
Si le ponés una fecha futura, sale solo ese día a las 9:00.

Notion: ${a.notion_url || 'https://www.notion.so'}
`
const res = await fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: { 'api-key': env('BREVO_API_KEY'), 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({
    sender: { name: 'Puesto de Palta Blog', email: 'contacto@puestodepalta.com' },
    to: [{ email: to }],
    subject: `Nuevo borrador listo para revisar: ${a.titulo}`,
    textContent: text,
  }),
})
if (!res.ok) { console.error('Brevo error:', await res.text()); process.exit(5) }
console.log(`mail enviado a ${to}`)
