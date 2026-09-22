import { Hono } from 'hono'
import { blogDetailHTML, blogNotFoundHTML } from '../templates/blog-detail'
import { blogListHTML } from '../templates/blog-list'

type Bindings = {
  NOTION_TOKEN: string
  NOTION_DB_ID: string
}

export const blogPage = new Hono<{ Bindings: Bindings }>()

// Página listado /blog
blogPage.get('/', async (c) => {
  return c.html(blogListHTML())
})

blogPage.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const token = c.env?.NOTION_TOKEN || ''
    const dbId = c.env?.NOTION_DB_ID || '3233fd35c85780bf8f1efd29cbdde59e'

    const host = c.req.header('host') || 'localhost:3000'
    const proto = host.includes('localhost') ? 'http' : 'https'
    const apiUrl = `${proto}://${host}/api/blog/${slug}`

    const res = await fetch(apiUrl)
    if (!res.ok) {
      return c.html(blogNotFoundHTML())
    }
    const data = await res.json() as any
    if (!data.article) {
      return c.html(blogNotFoundHTML())
    }
    return c.html(blogDetailHTML(data.article))
  } catch (err: any) {
    return c.html(blogNotFoundHTML())
  }
})
