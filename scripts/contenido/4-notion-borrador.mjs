// PASO 4 — Crea el borrador en Notion (Publicar destildado).
// Uso: node scripts/contenido/4-notion-borrador.mjs .contenido/articulo.json
// articulo.json: { titulo, slug, excerpt, contenido_markdown, fuentes_usadas:[{titulo,url,fecha}], imagen_url }
// excerpt = subtítulo: 1 o 2 oraciones que aparecen en las tarjetas del blog y en el mail.
// Cuerpo: solo párrafos (el artículo) y las fuentes al final, como hacía Genspark.
import { readFileSync, writeFileSync } from 'node:fs'
import { env, notion, slugify, todayArgentina, countWords } from './lib.mjs'

const file = process.argv[2]
if (!file) { console.error('Uso: node scripts/contenido/4-notion-borrador.mjs <articulo.json>'); process.exit(1) }
const a = JSON.parse(readFileSync(file, 'utf8'))
for (const k of ['titulo', 'contenido_markdown', 'imagen_url']) if (!a[k]) { console.error(`articulo.json sin "${k}"`); process.exit(1) }
const slug = a.slug || slugify(a.titulo)
if (slug !== slugify(slug)) { console.error(`El slug "${slug}" tiene tildes o caracteres inválidos. Usar: ${slugify(slug)}`); process.exit(1) }

const words = countWords(a.contenido_markdown)
if (words < 350 || words > 900) console.error(`AVISO: el artículo tiene ${words} palabras (regla: 400-700, nunca más de 900).`)

// Markdown mínimo -> rich_text de Notion: **negrita**, *cursiva*; sin headings ni listas.
function inline(text) {
  const out = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g
  let last = 0, m
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', text: { content: text.slice(last, m.index) } })
    const tok = m[0]
    if (tok.startsWith('**')) out.push({ type: 'text', text: { content: tok.slice(2, -2) }, annotations: { bold: true } })
    else out.push({ type: 'text', text: { content: tok.slice(1, -1) }, annotations: { italic: true } })
    last = m.index + tok.length
  }
  if (last < text.length) out.push({ type: 'text', text: { content: text.slice(last) } })
  // Notion limita cada fragmento a 2000 caracteres
  return out.flatMap(t => t.text.content.length <= 2000 ? [t] : t.text.content.match(/[\s\S]{1,2000}/g).map(c => ({ ...t, text: { content: c } })))
}
const paragraph = (text) => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: inline(text) } })

const paras = a.contenido_markdown.split(/\n\s*\n/).map(p => p.replace(/^#+\s*/, '').replace(/\n/g, ' ').trim()).filter(Boolean)
const children = paras.map(paragraph)
if (a.fuentes_usadas?.length) {
  children.push(paragraph(''))
  children.push(paragraph('**Fuentes**'))
  for (const f of a.fuentes_usadas) children.push(paragraph(`${f.titulo}${f.fecha ? ` (${f.fecha})` : ''} — ${f.url}`))
}

const page = await notion('/pages', { method: 'POST', body: {
  parent: { database_id: env('NOTION_DB_ID') },
  properties: {
    Title:    { title: [{ text: { content: a.titulo } }] },
    Slug:     { rich_text: [{ text: { content: slug } }] },
    Fecha:    { date: { start: a.fecha || todayArgentina() } },
    Publicar: { checkbox: false },
    Imagen:   { url: a.imagen_url },
    ...(a.excerpt ? { Excerpt: { rich_text: [{ text: { content: a.excerpt.slice(0, 2000) } }] } } : {}),
  },
  children: children.slice(0, 100),
}})
// Notion acepta hasta 100 bloques por llamada; si hay más, se agregan después
for (let i = 100; i < children.length; i += 100) {
  await notion(`/blocks/${page.id}/children`, { method: 'PATCH', body: { children: children.slice(i, i + 100) } })
}

const result = { notion_page_id: page.id, notion_url: page.url, slug, palabras: words, fecha: a.fecha || todayArgentina() }
writeFileSync(file, JSON.stringify({ ...a, ...result }, null, 2))
console.error(`borrador creado en Notion -> ${page.url} (${words} palabras, ${paras.length} párrafos)`)
console.log(JSON.stringify(result))
