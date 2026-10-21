// Reemplaza la propiedad Imagen de una página de Notion (por ejemplo, cuando la
// portada se generó después de crear el borrador).
// Uso: node scripts/contenido/3b-actualizar-imagen.mjs <notion_page_id> <url>
import { notion } from './lib.mjs'
const [pageId, url] = process.argv.slice(2)
if (!pageId || !url) { console.error('Uso: node scripts/contenido/3b-actualizar-imagen.mjs <notion_page_id> <url>'); process.exit(1) }
const page = await notion(`/pages/${pageId}`, { method: 'PATCH', body: { properties: { Imagen: { url } } } })
console.log(`Imagen actualizada en ${page.url}`)
