// Utilidades compartidas por los scripts de contenido (etapa 4).
// Las claves se leen de variables de entorno; si falta alguna y existe .dev.vars en
// la raíz del repo, se toma de ahí. Nunca se escriben en el repo.
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const WORK_DIR = resolve(ROOT, '.contenido')   // archivos intermedios (gitignored)
export const CF_ACCOUNT_ID = '69cab80f6399b619326813da2ca872ef'
export const SITE_URL = 'https://puestodepalta.com'
export const NOTION_VERSION = '2022-06-28'

function loadDevVars() {
  const p = resolve(ROOT, '.dev.vars')
  if (!existsSync(p)) return {}
  const out = {}
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const i = line.indexOf('=')
    if (i > 0 && !line.trim().startsWith('#')) out[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return out
}
const devVars = loadDevVars()

export function env(name, { required = true, fallback } = {}) {
  const v = process.env[name] || devVars[name] || fallback
  if (!v && required) {
    console.error(`Falta la variable ${name}. Cargala en el entorno de Claude Code o en .dev.vars.`)
    process.exit(2)
  }
  return v
}

export function ensureWorkDir() { mkdirSync(WORK_DIR, { recursive: true }); return WORK_DIR }

export async function notion(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${env('NOTION_TOKEN')}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Notion ${method} ${path} -> ${res.status}: ${data.message || JSON.stringify(data).slice(0, 200)}`)
  return data
}

export async function notionQueryAll(dbId, body = {}) {
  const results = []
  let cursor
  do {
    const data = await notion(`/databases/${dbId}/query`, { method: 'POST', body: { page_size: 100, ...body, ...(cursor ? { start_cursor: cursor } : {}) } })
    results.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

export async function notionBlocksAll(blockId) {
  const results = []
  let cursor
  do {
    const data = await notion(`/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`)
    results.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

export const richText = (arr) => (arr || []).map(t => t.plain_text || '').join('')

// Texto plano de una página de Notion (para la guía de voz), bloque por bloque.
export async function notionPageText(pageId) {
  const blocks = await notionBlocksAll(pageId)
  const lines = []
  for (const b of blocks) {
    const c = b[b.type]
    const t = richText(c?.rich_text)
    switch (b.type) {
      case 'heading_1': lines.push(`# ${t}`); break
      case 'heading_2': lines.push(`## ${t}`); break
      case 'heading_3': lines.push(`### ${t}`); break
      case 'bulleted_list_item': lines.push(`• ${t}`); break
      case 'numbered_list_item': lines.push(`1. ${t}`); break
      case 'divider': lines.push('---'); break
      case 'quote': lines.push(`> ${t}`); break
      default: if (t) lines.push(t)
    }
    if (b.has_children && b.type !== 'child_page') {
      try { lines.push(await notionPageText(b.id)) } catch (_) {}
    }
  }
  return lines.join('\n')
}

// Slug: minúsculas, sin tildes, palabras separadas por guiones.
export function slugify(title) {
  return title.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/ñ/g, 'n').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function todayArgentina() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const g = (t) => parts.find(p => p.type === t).value
  return `${g('year')}-${g('month')}-${g('day')}`
}

export function countWords(text) { return (text.match(/[\p{L}\p{N}]+(?:[''’-][\p{L}\p{N}]+)*/gu) || []).length }
