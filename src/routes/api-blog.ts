import { Hono } from 'hono'
import { getArticlePage, getPublishedArticles, type NotionEnv } from '../lib/notion'
import { cachedResponse } from '../lib/edge'

export const apiBlog = new Hono<{ Bindings: NotionEnv }>()

// GET /api/blog — todas las notas publicadas (Publicar tildado y Fecha ya llegada).
// Se guarda 5 minutos en Cloudflare (ver src/lib/edge.ts).
apiBlog.get('/', (c) => cachedResponse(c, async () => {
  try {
    const articles = await getPublishedArticles(c.env)
    return c.json({ articles })
  } catch (err: any) {
    return c.json({ articles: [], error: err.message }, 500)
  }
}))

// GET /api/blog/:slug — una nota con su contenido en HTML
apiBlog.get('/:slug', (c) => cachedResponse(c, async () => {
  try {
    const article = await getArticlePage(c.env, c.req.param('slug'))
    if (!article) return c.json({ error: 'Article not found' }, 404)
    return c.json({ article })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
}))
