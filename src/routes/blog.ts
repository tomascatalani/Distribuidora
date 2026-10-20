import { Hono } from 'hono'
import { blogDetailHTML, blogNotFoundHTML } from '../templates/blog-detail'
import { blogListHTML } from '../templates/blog-list'
import { getArticleBySlug, type NotionEnv } from '../lib/notion'

export const blogPage = new Hono<{ Bindings: NotionEnv }>()

// Listado /blog (las notas se cargan desde /api/blog en el navegador)
blogPage.get('/', (c) => c.html(blogListHTML()))

// Nota individual /blog/:slug
blogPage.get('/:slug', async (c) => {
  try {
    const article = await getArticleBySlug(c.env, c.req.param('slug'))
    if (!article) return c.html(blogNotFoundHTML(), 404)
    c.header('Cache-Control', 'no-store')
    return c.html(blogDetailHTML(article))
  } catch (_) {
    return c.html(blogNotFoundHTML(), 404)
  }
})
