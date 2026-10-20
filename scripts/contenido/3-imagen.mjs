// PASO 3 — Portada: genera la imagen con Cloudflare Workers AI y la sube a Cloudinary.
// Uso: node scripts/contenido/3-imagen.mjs <slug> "<prompt en inglés>"
// Imprime la URL pública. Guarda también .contenido/<slug>.jpg para revisar.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { env, CF_ACCOUNT_ID, ensureWorkDir } from './lib.mjs'

const [slug, prompt] = process.argv.slice(2)
if (!slug || !prompt) { console.error('Uso: node scripts/contenido/3-imagen.mjs <slug> "<prompt>"'); process.exit(1) }

const MODEL = process.env.IMAGE_MODEL || '@cf/leonardo/phoenix-1.0'
const NEGATIVE = 'plastic, 3d render, cgi, glossy, oversaturated, perfect symmetry, smooth, artificial, cartoon, illustration, text, letters, watermark, logo, people, hands'
const STYLE = 'Documentary editorial photograph, natural window light from the side, matte textures with real imperfections, subtle film grain, 50mm lens at f2.8, shallow depth of field, muted earthy greens (#3D8B27) and deep browns, black (#0a0a0a) and cream (#faf8f4) tones, clean composition with generous negative space, sober and artisanal mood'

const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${env('CF_AI_TOKEN')}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: `${prompt}. ${STYLE}`, negative_prompt: NEGATIVE, width: 1792, height: 1024, guidance: 4 }),
})
const raw = Buffer.from(await res.arrayBuffer())
let img
if (raw[0] === 0x7b) {  // JSON
  const d = JSON.parse(raw.toString())
  if (!d.success) { console.error('Workers AI error:', d.errors?.map(e => e.message).join('; ')); process.exit(3) }
  img = Buffer.from(d.result.image, 'base64')
} else img = raw

const work = ensureWorkDir()
const local = resolve(work, `${slug}.jpg`)
writeFileSync(local, img)
console.error(`imagen generada (${Math.round(img.length / 1024)} KB) -> ${local}`)

const form = new FormData()
form.append('file', new Blob([img], { type: 'image/jpeg' }), `${slug}.jpg`)
form.append('upload_preset', env('CLOUDINARY_UPLOAD_PRESET', { fallback: 'blog-puesto-de-palta' }))
form.append('public_id', slug)
const up = await fetch(`https://api.cloudinary.com/v1_1/${env('CLOUDINARY_CLOUD_NAME', { fallback: 'dxlunrd1f' })}/image/upload`, { method: 'POST', body: form })
const upData = await up.json()
if (!up.ok) { console.error('Cloudinary error:', upData.error?.message); process.exit(4) }
console.error(`subida a Cloudinary -> ${upData.secure_url}`)
console.log(upData.secure_url)
