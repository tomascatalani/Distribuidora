import { cld, IMG_CARD } from './site'

// Acceso a Notion compartido por la web (listado y nota) y por el cron de avisos.
// Toda la lógica de "qué se considera publicado" vive acá, en un solo lugar.

export type NotionEnv = {
  NOTION_TOKEN: string
  NOTION_DB_ID: string
}

export type Article = {
  id: string
  title: string
  slug: string          // dirección pública: sin tildes ni símbolos (ver publicSlug)
  notionSlug: string    // lo que dice el campo Slug en Notion, tal cual
  fecha: string | null
  imageUrl: string
  thumbUrl: string      // portada achicada para las tarjetas
  excerpt: string
  lastEdited: string | null
}

const NOTION_VERSION = '2022-06-28'

// ── Hora de publicación ─────────────────────────────────────────────────────
// Cloudflare corre en UTC. Una nota con Fecha = lunes tiene que aparecer el lunes
// en hora argentina, y no a medianoche sino a una hora razonable para que el mail
// a los suscriptores llegue de mañana. Antes de esa hora, la fecha de corte es
// "ayer", así que las notas de hoy todavía no se ven.

export const PUBLISH_HOUR_ARG = 9   // las notas con fecha salen a las 9:00 de Argentina

function argentinaParts(now: Date): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value || '00'
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) % 24 }
}

export function todayInArgentina(now: Date = new Date()): string {
  return argentinaParts(now).date
}

// Última fecha cuyas notas ya se muestran: hoy si ya son las 9:00 en Argentina,
// si no, ayer.
export function publishCutoffDate(now: Date = new Date()): string {
  const { date, hour } = argentinaParts(now)
  if (hour >= PUBLISH_HOUR_ARG) return date
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

// ── Filtro de publicación ───────────────────────────────────────────────────
// Una nota está publicada cuando Publicar está tildado Y (no tiene Fecha, o la
// Fecha ya llegó, a partir de las 9:00 de Argentina). Así se pueden dejar notas
// cargadas con fecha futura y salen solas el día indicado, de mañana.

export function publishedFilter(extra?: any) {
  const today = publishCutoffDate()
  const base: any[] = [
    { property: 'Publicar', checkbox: { equals: true } },
    {
      or: [
        { property: 'Fecha', date: { is_empty: true } },
        { property: 'Fecha', date: { on_or_before: today } },
      ],
    },
  ]
  if (extra) base.push(extra)
  return { and: base }
}

// ── Llamadas a la API ───────────────────────────────────────────────────────

function headers(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

export async function queryDatabase(env: NotionEnv, filter?: any): Promise<any[]> {
  const results: any[] = []
  let cursor: string | undefined
  do {
    const body: any = { sorts: [{ property: 'Fecha', direction: 'descending' }], page_size: 100 }
    if (filter) body.filter = filter
    if (cursor) body.start_cursor = cursor
    const res = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: headers(env.NOTION_TOKEN),
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Notion DB error: ${res.status}`)
    const data = await res.json() as any
    results.push(...(data.results || []))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

export async function fetchBlocks(env: NotionEnv, pageId: string): Promise<any[]> {
  const results: any[] = []
  let cursor: string | undefined
  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${pageId}/children`)
    url.searchParams.set('page_size', '100')
    if (cursor) url.searchParams.set('start_cursor', cursor)
    const res = await fetch(url.toString(), { headers: headers(env.NOTION_TOKEN) })
    if (!res.ok) throw new Error(`Notion blocks error: ${res.status}`)
    const data = await res.json() as any
    results.push(...(data.results || []))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

export async function listPublished(env: NotionEnv): Promise<any[]> {
  return queryDatabase(env, publishedFilter())
}

export async function findPublishedBySlug(env: NotionEnv, slug: string): Promise<any | null> {
  const bySlug = await queryDatabase(env, publishedFilter({ property: 'Slug', rich_text: { equals: slug } }))
  if (bySlug.length > 0) return bySlug[0]
  // Notas sin Slug usan el ID de página como URL.
  const all = await listPublished(env)
  return all.find((p: any) => p.id === slug) || null
}

// ── Parsers ─────────────────────────────────────────────────────────────────

export function richText(arr: any[]): string {
  if (!arr || arr.length === 0) return ''
  return arr.map((t: any) => t.plain_text || '').join('')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Las fuentes del final de cada nota vienen como texto ("Título — https://...").
// Esto convierte esas direcciones en links que se pueden tocar.
function linkify(escaped: string): string {
  return escaped.replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"]/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
}

export function richTextHTML(arr: any[]): string {
  if (!arr || arr.length === 0) return ''
  return arr.map((t: any) => {
    let s = escapeHtml(t.plain_text || '')
    if (!t.href) s = linkify(s)
    if (t.annotations?.bold) s = `<strong>${s}</strong>`
    if (t.annotations?.italic) s = `<em>${s}</em>`
    if (t.annotations?.underline) s = `<u>${s}</u>`
    if (t.annotations?.strikethrough) s = `<s>${s}</s>`
    if (t.annotations?.code) s = `<code>${s}</code>`
    if (t.href) s = `<a href="${escapeHtml(t.href)}" target="_blank" rel="noopener noreferrer">${s}</a>`
    return s
  }).join('')
}

function parseImageProp(props: any): string {
  const imgProp = props?.Imagen
  if (!imgProp) return ''
  if (imgProp.type === 'url' && imgProp.url) return imgProp.url
  if (imgProp.type === 'files' && imgProp.files?.length > 0) {
    const f = imgProp.files[0]
    return f.file?.url || f.external?.url || ''
  }
  if (imgProp.type === 'rich_text' && imgProp.rich_text?.length > 0) {
    return richText(imgProp.rich_text).trim()
  }
  return ''
}

// Dirección pública de una nota: el Slug de Notion sin tildes ni símbolos. Si la
// nota no tiene Slug, se arma con el título. Así "el-número-que-nadie-planeó"
// queda /blog/el-numero-que-nadie-planeo, y las direcciones viejas con tilde
// redirigen a la nueva (ver getArticlePage).
export function slugify(s: string): string {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function parseArticle(page: any): Article {
  const props = page.properties
  const title = richText(props?.Title?.title || []) || 'Sin título'
  const slugRaw = richText(props?.Slug?.rich_text || []).trim()
  const imageUrl = parseImageProp(props)
  return {
    id: page.id,
    title,
    slug: slugify(slugRaw) || slugify(title) || page.id,
    notionSlug: slugRaw,
    fecha: props?.Fecha?.date?.start || null,
    imageUrl,
    thumbUrl: cld(imageUrl, IMG_CARD),
    excerpt: richText(props?.Excerpt?.rich_text || []).trim(),
    lastEdited: page.last_edited_time || null,
  }
}

export function extractExcerpt(blocks: any[]): string {
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const text = richText(block.paragraph?.rich_text || []).trim()
      if (text) return text
    }
  }
  return ''
}

export function shortExcerpt(text: string, max = 150): string {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

// Descripción para Google y WhatsApp: entre 110 y 160 caracteres. Si el Excerpt
// de Notion es muy corto, se completa con el primer párrafo de la nota.
export function metaDescription(excerpt: string, firstParagraph: string, max = 160): string {
  let d = (excerpt || '').replace(/\s+/g, ' ').trim()
  const p = (firstParagraph || '').replace(/\s+/g, ' ').trim()
  if (!d) d = p
  else if (d.length < 110 && p && p !== d) d = p.startsWith(d) ? p : `${d} ${p}`
  if (d.length <= max) return d
  const cut = d.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-—]+$/, '') + '…'
}

// ── Bloques → HTML ──────────────────────────────────────────────────────────

export function blocksToHTML(blocks: any[]): string {
  const html: string[] = []
  let inBulletList = false
  let inNumberList = false

  const closeLists = () => {
    if (inBulletList) { html.push('</ul>'); inBulletList = false }
    if (inNumberList) { html.push('</ol>'); inNumberList = false }
  }

  for (const block of blocks) {
    const type = block.type
    const content = block[type]

    if (type !== 'bulleted_list_item' && inBulletList) { html.push('</ul>'); inBulletList = false }
    if (type !== 'numbered_list_item' && inNumberList) { html.push('</ol>'); inNumberList = false }

    switch (type) {
      case 'heading_1':
        closeLists()
        html.push(`<h1 class="blog-h1">${richTextHTML(content?.rich_text || [])}</h1>`)
        break
      case 'heading_2':
        closeLists()
        html.push(`<h2 class="blog-h2">${richTextHTML(content?.rich_text || [])}</h2>`)
        break
      case 'heading_3':
        closeLists()
        html.push(`<h3 class="blog-h3">${richTextHTML(content?.rich_text || [])}</h3>`)
        break
      case 'paragraph': {
        const pText = richTextHTML(content?.rich_text || [])
        html.push(pText ? `<p class="blog-p">${pText}</p>` : '<div class="blog-spacer"></div>')
        break
      }
      case 'bulleted_list_item':
        if (!inBulletList) { html.push('<ul class="blog-ul">'); inBulletList = true }
        html.push(`<li class="blog-li">${richTextHTML(content?.rich_text || [])}</li>`)
        break
      case 'numbered_list_item':
        if (!inNumberList) { html.push('<ol class="blog-ol">'); inNumberList = true }
        html.push(`<li class="blog-li">${richTextHTML(content?.rich_text || [])}</li>`)
        break
      case 'quote':
        html.push(`<blockquote class="blog-quote">${richTextHTML(content?.rich_text || [])}</blockquote>`)
        break
      case 'callout': {
        const icon = content?.icon?.emoji || ''
        const calloutText = richTextHTML(content?.rich_text || [])
        html.push(`<div class="blog-callout">${icon ? `<span>${icon}</span>` : ''}${calloutText}</div>`)
        break
      }
      case 'divider':
        html.push(`<hr class="blog-divider">`)
        break
      case 'image': {
        const imgUrl = content?.file?.url || content?.external?.url || ''
        const caption = escapeHtml(richText(content?.caption || []))
        if (imgUrl) {
          html.push(`<figure class="blog-figure">
            <img src="${escapeHtml(imgUrl)}" alt="${caption}" loading="lazy">
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>`)
        }
        break
      }
      case 'video': {
        const videoUrl = content?.file?.url || content?.external?.url || ''
        if (videoUrl) {
          html.push(`<div class="blog-video"><video controls src="${escapeHtml(videoUrl)}" style="max-width:100%"></video></div>`)
        }
        break
      }
      case 'embed':
      case 'bookmark': {
        const url = content?.url || ''
        if (url) {
          html.push(`<div class="blog-bookmark"><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(url)}</a></div>`)
        }
        break
      }
      case 'code': {
        const codeText = escapeHtml(richText(content?.rich_text || []))
        const lang = escapeHtml(content?.language || '')
        html.push(`<pre class="blog-code"><code class="language-${lang}">${codeText}</code></pre>`)
        break
      }
      case 'toggle': {
        const summary = richTextHTML(content?.rich_text || [])
        html.push(`<details class="blog-toggle"><summary>${summary}</summary></details>`)
        break
      }
      default: {
        const fallback = richTextHTML(content?.rich_text || [])
        if (fallback) html.push(`<p class="blog-p">${fallback}</p>`)
        break
      }
    }
  }

  if (inBulletList) html.push('</ul>')
  if (inNumberList) html.push('</ol>')
  return html.join('\n')
}

// ── Artículo completo (para la página de la nota) ───────────────────────────

export type ArticlePage = Article & { htmlContent: string; description: string; related: Article[] }

// Busca la nota por su dirección. Acepta la dirección nueva sin tildes, la vieja
// con tildes (el Slug tal cual está en Notion) y el ID de página que usaban las
// notas sin Slug. Quien llama compara article.slug con lo pedido para redirigir.
export async function getArticlePage(env: NotionEnv, requested: string): Promise<ArticlePage | null> {
  let req = requested || ''
  try { if (req.includes('%')) req = decodeURIComponent(req) } catch (_) {}
  const pages = await listPublished(env)
  const all = pages.map(parseArticle)
  const wanted = slugify(req)
  const idx = all.findIndex(a => a.slug === wanted || a.id === req || (a.notionSlug && a.notionSlug === req))
  if (idx < 0) return null
  const article = all[idx]
  const blocks = await fetchBlocks(env, article.id)
  const firstParagraph = extractExcerpt(blocks)
  if (!article.excerpt) article.excerpt = firstParagraph
  const related = all.filter((_, i) => i !== idx).slice(0, 3)
  return {
    ...article,
    htmlContent: blocksToHTML(blocks),
    description: metaDescription(article.excerpt, firstParagraph),
    related,
  }
}

export async function getArticleBySlug(env: NotionEnv, slug: string): Promise<ArticlePage | null> {
  return getArticlePage(env, slug)
}

export async function getPublishedArticles(env: NotionEnv): Promise<Article[]> {
  const pages = await listPublished(env)
  return Promise.all(pages.map(async (page: any) => {
    const article = parseArticle(page)
    if (!article.excerpt) {
      try {
        article.excerpt = extractExcerpt(await fetchBlocks(env, page.id))
      } catch (_) {
        article.excerpt = ''
      }
    }
    return article
  }))
}
