import { Hono } from 'hono'
import { getArticleBySlug, getPublishedArticles, type NotionEnv } from '../lib/notion'

export const apiBlog = new Hono<{ Bindings: NotionEnv }>()

// GET /api/blog — todas las notas publicadas (Publicar tildado y Fecha ya llegada)
apiBlog.get('/', async (c) => {
  try {
    const articles = await getPublishedArticles(c.env)
    c.header('Cache-Control', 'no-store')
    return c.json({ articles })
  } catch (err: any) {
    return c.json({ articles: [], error: err.message }, 500)
  }
})

// GET /api/blog/:slug — una nota con su contenido en HTML
apiBlog.get('/:slug', async (c) => {
  try {
    const article = await getArticleBySlug(c.env, c.req.param('slug'))
    if (!article) return c.json({ error: 'Article not found' }, 404)
    c.header('Cache-Control', 'no-store')
    return c.json({ article })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})
