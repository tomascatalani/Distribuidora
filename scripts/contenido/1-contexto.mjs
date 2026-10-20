// PASO 1 — Contexto para investigar y escribir.
// Lee de Notion: la guía de voz, todos los títulos de la base (publicados y borradores)
// y las URLs de fuentes de los últimos 5 artículos. Guarda .contenido/contexto.json.
// Uso: node scripts/contenido/1-contexto.mjs
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { env, notion, notionQueryAll, notionBlocksAll, notionPageText, richText, ensureWorkDir } from './lib.mjs'

const DB = env('NOTION_DB_ID')
const STYLE = env('NOTION_STYLE_GUIDE_ID')
const work = ensureWorkDir()

const pages = await notionQueryAll(DB, { sorts: [{ property: 'Fecha', direction: 'descending' }] })
const titulos = pages.map(p => ({
  titulo: richText(p.properties.Title?.title),
  fecha: p.properties.Fecha?.date?.start || null,
  publicada: !!p.properties.Publicar?.checkbox,
  slug: richText(p.properties.Slug?.rich_text) || null,
}))

// URLs de fuentes: cualquier http(s) en el cuerpo de los últimos 5 artículos
const urlRe = /https?:\/\/[^\s)\]>"']+/g
const fuentes = []
for (const p of pages.slice(0, 5)) {
  const blocks = await notionBlocksAll(p.id)
  const text = blocks.map(b => richText(b[b.type]?.rich_text)).join('\n')
  const urls = [...new Set(text.match(urlRe) || [])]
  fuentes.push({ titulo: richText(p.properties.Title?.title), urls })
}

const guia = await notionPageText(STYLE)

const ctx = { generadoEl: new Date().toISOString(), totalNotas: titulos.length, titulos, fuentesRecientes: fuentes, guiaDeVoz: guia }
const out = resolve(work, 'contexto.json')
writeFileSync(out, JSON.stringify(ctx, null, 2))
console.log(`OK contexto -> ${out}`)
console.log(`  notas en Notion: ${titulos.length} (${titulos.filter(t => t.publicada).length} publicadas)`)
console.log(`  guía de voz: ${guia.length} caracteres`)
console.log(`  fuentes de los últimos 5: ${fuentes.reduce((n, f) => n + f.urls.length, 0)} URLs`)
