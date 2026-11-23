import { Hono } from 'hono'
import { blogDetailHTML, blogNotFoundHTML } from '../templates/blog-detail'
import { blogListHTML } from '../templates/blog-list'
import { getArticlePage, type NotionEnv } from '../lib/notion'
import { cachedResponse } from '../lib/edge'

export const blogPage = new Hono<{ Bindings: NotionEnv }>()

// Listado /blog (las notas se cargan desde /api/blog en el navegador)
blogPage.get('/', (c) => c.html(blogListHTML()))

// Nota individual /blog/:slug
// - Se guarda 5 minutos en Cloudflare (ver src/lib/edge.ts).
// - Las direcciones viejas (con tildes, o el ID de página de las notas sin Slug)
//   redirigen con 301 a la dirección limpia, para no perder links compartidos.
blogPage.get('/:slug', (c) => cachedResponse(c, async () => {
  const requested = c.req.param('slug')
  try {
    const article = await getArticlePage(c.env, requested)
    if (!article) return c.html(blogNotFoundHTML(), 404)
    let asked = requested
    try { if (asked.includes('%')) asked = decodeURIComponent(asked) } catch (_) {}
    if (asked !== article.slug) return c.redirect(`/blog/${article.slug}`, 301)
    return c.html(blogDetailHTML(article))
  } catch (_) {
    // Notion no respondió: 503 (y no 404) para que Google no dé la nota por borrada.
    return c.html(blogNotFoundHTML(true), 503, { 'Retry-After': '300' })
  }
}))
