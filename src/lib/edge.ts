// Ayudas que usan la caché de Cloudflare (gratis, sin cuota diaria).
//
// 1. Copia guardada de páginas: la lista de notas, cada nota y el mapa del sitio
//    se guardan unos minutos en Cloudflare. Así no se le pregunta a Notion en cada
//    visita: la web responde más rápido y sigue andando si Notion tarda.
//    Una nota editada en Notion se ve en la web a más tardar en CACHE_SECONDS.
// 2. Límite de envíos por persona para los formularios (ver formGuard).
//
// En `npm run dev` o en las direcciones *.pages.dev la caché no existe o no guarda
// nada: todo funciona igual, solo que sin copia.

import type { Context } from 'hono'

export const CACHE_SECONDS = 300   // 5 minutos

function edgeCache(): Cache | null {
  const c = (globalThis as any).caches
  return c && c.default ? (c.default as Cache) : null
}

function waitUntil(c: Context, p: Promise<any>) {
  try { c.executionCtx.waitUntil(p) } catch (_) { p.catch(() => {}) }
}

// Devuelve la copia guardada si existe; si no, arma la respuesta con `build` y,
// si salió bien (código 200), la guarda. La clave es la dirección sin "?…".
export async function cachedResponse(c: Context, build: () => Promise<Response>, seconds = CACHE_SECONDS): Promise<Response> {
  const cache = edgeCache()
  const url = new URL(c.req.url)
  const key = new Request(url.origin + url.pathname, { method: 'GET' })
  if (cache) {
    try {
      const hit = await cache.match(key)
      if (hit) return hit
    } catch (_) {}
  }
  const res = await build()
  if (cache && res.status === 200) {
    const copy = new Response(res.clone().body, res)
    copy.headers.set('Cache-Control', `public, max-age=${seconds}`)
    waitUntil(c, cache.put(key, copy).catch(() => {}))
  }
  return res
}

// ── Protección de formularios ───────────────────────────────────────────────
// Sin claves externas: un campo trampa que la gente no ve (los bots lo llenan),
// un tiempo mínimo entre que se abre la página y se envía, que el envío venga de
// la propia web, y como mucho LIMIT envíos por IP cada WINDOW segundos.

const LIMIT = 5
const WINDOW = 600   // 10 minutos

export type GuardResult = 'ok' | 'bot' | 'too-many' | 'forbidden'

function allowedOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname
    return host === 'puestodepalta.com' || host === 'www.puestodepalta.com' ||
      host.endsWith('.puesto-de-palta-web.pages.dev') || host === 'puesto-de-palta-web.pages.dev' ||
      host === 'localhost' || host === '127.0.0.1'
  } catch (_) {
    return false
  }
}

export async function formGuard(c: Context, body: any, name: string): Promise<GuardResult> {
  const origin = c.req.header('origin')
  if (origin && !allowedOrigin(origin)) return 'forbidden'

  // Campo trampa (oculto para la gente) y tiempo mínimo de 2,5 segundos.
  if (body?.website) return 'bot'
  const t = Number(body?.t)
  if (!t || Date.now() - t < 2500) return 'bot'

  const cache = edgeCache()
  if (!cache) return 'ok'
  const ip = c.req.header('cf-connecting-ip') || 'sin-ip'
  const key = new Request(`https://limite.puestodepalta.com/${name}/${encodeURIComponent(ip)}`)
  let count = 0
  try {
    const hit = await cache.match(key)
    if (hit) count = Number(await hit.text()) || 0
  } catch (_) {}
  if (count >= LIMIT) return 'too-many'
  const next = new Response(String(count + 1), { headers: { 'Cache-Control': `max-age=${WINDOW}` } })
  waitUntil(c, cache.put(key, next).catch(() => {}))
  return 'ok'
}

export const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/
