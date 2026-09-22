import { Hono } from 'hono'

type Bindings = {
  NOTION_TOKEN: string
  NOTION_DB_ID: string
}

export const apiBlog = new Hono<{ Bindings: Bindings }>()

const NOTION_TOKEN_DEFAULT = ''
const NOTION_DB_ID_DEFAULT = '3233fd35-c857-8076-8608-f97f0cbf9873'

// ── Notion API helpers ──────────────────────────────────────────────────────

async function queryDatabase(token: string, dbId: string, filter?: any) {
  const body: any = {
    sorts: [{ property: 'Fecha', direction: 'descending' }]
  }
  if (filter) body.filter = filter

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`Notion DB error: ${res.status}`)
  return res.json() as Promise<any>
}

async function fetchBlocks(token: string, pageId: string): Promise<any[]> {
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    }
  })
  if (!res.ok) throw new Error(`Notion blocks error: ${res.status}`)
  const data = await res.json() as any
  return data.results || []
}

// ── Parsers ─────────────────────────────────────────────────────────────────

function richText(arr: any[]): string {
  if (!arr || arr.length === 0) return ''
  return arr.map((t: any) => t.plain_text || '').join('')
}

function richTextHTML(arr: any[]): string {
  if (!arr || arr.length === 0) return ''
  return arr.map((t: any) => {
    let s = (t.plain_text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    if (t.annotations?.bold) s = `<strong>${s}</strong>`
    if (t.annotations?.italic) s = `<em>${s}</em>`
    if (t.annotations?.underline) s = `<u>${s}</u>`
    if (t.annotations?.strikethrough) s = `<s>${s}</s>`
    if (t.annotations?.code) s = `<code>${s}</code>`
    if (t.href) s = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${s}</a>`
    return s
  }).join('')
}

function parseImageProp(props: any): string {
  const imgProp = props?.Imagen
  if (!imgProp) return ''

  // url property (plain URL string — primary type)
  if (imgProp.type === 'url' && imgProp.url) {
    return imgProp.url
  }

  // files property (uploaded or external file)
  if (imgProp.type === 'files' && imgProp.files?.length > 0) {
    const f = imgProp.files[0]
    return f.file?.url || f.external?.url || ''
  }

  // rich_text property containing a URL string
  if (imgProp.type === 'rich_text' && imgProp.rich_text?.length > 0) {
    return richText(imgProp.rich_text).trim()
  }

  return ''
}

function parseArticle(page: any) {
  const props = page.properties

  // Title
  const title = richText(props?.Title?.title || []) || 'Sin título'

  // Slug — fall back to page ID if empty
  const slugRaw = richText(props?.Slug?.rich_text || []).trim()
  const slug = slugRaw || page.id

  // Date
  const fecha = props?.Fecha?.date?.start || null

  // Cover image
  const imageUrl = parseImageProp(props)

  // Excerpt — propiedad manual primero, si no hay, auto desde bloques
  const excerptManual = richText(props?.Excerpt?.rich_text || []).trim()

  return {
    id: page.id,
    title,
    slug,
    fecha,
    imageUrl,
    excerpt: excerptManual // si tiene valor manual lo usa, sino se llena después con extractExcerpt
  }
}

// ── Block renderer ───────────────────────────────────────────────────────────

function blocksToHTML(blocks: any[]): string {
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

    // Handle list grouping
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
        const caption = richText(content?.caption || [])
        if (imgUrl) {
          html.push(`<figure class="blog-figure">
            <img src="${imgUrl}" alt="${caption}" loading="lazy">
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>`)
        }
        break
      }
      case 'video': {
        const videoUrl = content?.file?.url || content?.external?.url || ''
        if (videoUrl) {
          html.push(`<div class="blog-video"><video controls src="${videoUrl}" style="max-width:100%"></video></div>`)
        }
        break
      }
      case 'embed':
      case 'bookmark': {
        const url = content?.url || ''
        if (url) {
          html.push(`<div class="blog-bookmark"><a href="${url}" target="_blank" rel="noopener">${url}</a></div>`)
        }
        break
      }
      case 'code': {
        const codeText = richText(content?.rich_text || [])
        const lang = content?.language || ''
        html.push(`<pre class="blog-code"><code class="language-${lang}">${codeText}</code></pre>`)
        break
      }
      case 'toggle': {
        const summary = richTextHTML(content?.rich_text || [])
        html.push(`<details class="blog-toggle"><summary>${summary}</summary></details>`)
        break
      }
      default:
        // Unknown block — try to render any text
        const fallback = richText(content?.rich_text || [])
        if (fallback) html.push(`<p class="blog-p">${fallback}</p>`)
        break
    }
  }

  // Close any open lists
  if (inBulletList) html.push('</ul>')
  if (inNumberList) html.push('</ol>')

  return html.join('\n')
}

function extractExcerpt(blocks: any[]): string {
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const text = richText(block.paragraph?.rich_text || []).trim()
      if (text) return text  // párrafo completo, sin cortar
    }
  }
  return ''
}

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/blog — list all published articles
apiBlog.get('/', async (c) => {
  try {
    const token = c.env?.NOTION_TOKEN || NOTION_TOKEN_DEFAULT
    const dbId = c.env?.NOTION_DB_ID || NOTION_DB_ID_DEFAULT

    const data = await queryDatabase(token, dbId, {
      property: 'Publicar',
      checkbox: { equals: true }
    })

    // Parse articles — fetch first paragraph block for excerpt
    const articles = await Promise.all(
      (data.results || []).map(async (page: any) => {
        const article = parseArticle(page)
        // Solo busca en bloques si no tiene excerpt manual en Notion
        if (!article.excerpt) {
          try {
            const blocks = await fetchBlocks(token, page.id)
            article.excerpt = extractExcerpt(blocks)
          } catch (_) {
            article.excerpt = ''
          }
        }
        return article
      })
    )

    c.header('Cache-Control', 'no-store')
    return c.json({ articles })
  } catch (err: any) {
    return c.json({ articles: [], error: err.message }, 500)
  }
})

// GET /api/blog/:slug — single article with full block content
apiBlog.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const token = c.env?.NOTION_TOKEN || NOTION_TOKEN_DEFAULT
    const dbId = c.env?.NOTION_DB_ID || NOTION_DB_ID_DEFAULT

    // Try matching by Slug property first
    let pageResult: any = null
    const bySlug = await queryDatabase(token, dbId, {
      and: [
        { property: 'Publicar', checkbox: { equals: true } },
        { property: 'Slug', rich_text: { equals: slug } }
      ]
    })

    if (bySlug.results?.length > 0) {
      pageResult = bySlug.results[0]
    } else {
      // Fall back: try matching by page ID (slug was the page ID)
      // Fetch all published and find by ID
      const all = await queryDatabase(token, dbId, {
        property: 'Publicar',
        checkbox: { equals: true }
      })
      pageResult = (all.results || []).find((p: any) => p.id === slug) || null
    }

    if (!pageResult) {
      return c.json({ error: 'Article not found' }, 404)
    }

    const article = parseArticle(pageResult)

    // Fetch page body blocks for content
    const blocks = await fetchBlocks(token, pageResult.id)
    if (!article.excerpt) article.excerpt = extractExcerpt(blocks)
    const htmlContent = blocksToHTML(blocks)

    return c.json({ article: { ...article, htmlContent } })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

export { parseArticle }
