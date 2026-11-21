// Datos fijos del sitio usados por las plantillas.

export const SITE_URL = 'https://puestodepalta.com'

// Imagen que muestran WhatsApp, Instagram y Google cuando alguien comparte un link
// del sitio. Es una foto real de Cloudinary recortada al tamaño estándar (1200x630).
export const OG_IMAGE = 'https://res.cloudinary.com/dxlunrd1f/image/upload/c_fill,w_1200,h_630,q_auto,f_jpg/PALTA_PERU_METALES_PESADOS_ART%C3%8DCULO_1_eeasg2.jpg'

// Isologotipo en Cloudinary, achicado a 120 px (se muestra a ~40 px; 120 cubre
// pantallas de alta densidad). El original pesa 200 KB; esta versión, 3 KB.
export const LOGO_URL = 'https://res.cloudinary.com/dxlunrd1f/image/upload/f_auto,q_auto,w_120/v1773665883/puesto-de-palta/isologotipo.png'

export const INSTAGRAM_URL = 'https://instagram.com/puestodepalta'

export const INSTAGRAM_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>'

export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61590740365285'

export const FACEBOOK_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'

// Íconos redondos de Instagram y Facebook. Cada plantilla define el estilo de
// .social-icons (todas las ubicaciones actuales van sobre fondo oscuro).
export function socialIcons(extraClass = ''): string {
  return `<div class="social-icons${extraClass ? ' ' + extraClass : ''}">
    <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" aria-label="Instagram de Puesto de Palta" title="Instagram">${INSTAGRAM_ICON}</a>
    <a href="${FACEBOOK_URL}" target="_blank" rel="noopener" aria-label="Facebook de Puesto de Palta" title="Facebook">${FACEBOOK_ICON}</a>
  </div>`
}

// Medición de visitas de Metricool (JavaScript tag que dio el panel de Metricool para
// puestodepalta.com). Va en el <head> del inicio, del listado del blog y de cada nota.
// El hash no es secreto: es público en cualquier sitio que usa Metricool.
export const METRICOOL_TRACKER = `<script>function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"3617cc31807ca9d216fdc87b4b623b81"})});</script>`

// ── WhatsApp ────────────────────────────────────────────────────────────────
// Los pedidos entran por WhatsApp. Cada botón abre el chat con un mensaje ya
// escrito que dice de dónde viene, así Tomás sabe qué pedidos llegan por la web.

export const WHATSAPP_NUMBER = '5491140270343'
export const WHATSAPP_DISPLAY = '+54 9 11 4027 0343'

export const WA_MSG = {
  general: 'Hola! Vengo de la web y quiero hacer un pedido de paltas.',
  negocio: 'Hola! Vengo de la web. Tengo un negocio y quiero info para hacer pedidos de palta.',
  casa: 'Hola! Vengo de la web. Quiero pedir paltas para mi casa.',
  blog: 'Hola! Vengo del blog de Puesto de Palta y quiero info para hacer un pedido.',
}

export function waLink(msg: string = WA_MSG.general): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export const WHATSAPP_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'

// Botón flotante de WhatsApp, igual en todas las páginas. Rebota dos veces al
// cargar (no sin parar) y se queda quieto si el teléfono pide "reducir movimiento".
export function whatsappFloat(msg: string = WA_MSG.general): string {
  return `<a href="${waLink(msg)}" target="_blank" rel="noopener" class="wpp-float" aria-label="Escribinos por WhatsApp para hacer un pedido">${WHATSAPP_ICON}</a>
  <style>
    .wpp-float {
      position: fixed; right: 20px; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%; background: #25D366;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      animation: wppBounce 1.4s ease-in-out 1.2s 2;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .wpp-float svg { width: 28px; height: 28px; fill: #fff; }
    .wpp-float:hover, .wpp-float:focus-visible { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45); }
    .wpp-float:focus-visible { outline: 3px solid #faf8f4; outline-offset: 3px; }
    @keyframes wppBounce { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-9px); } 60% { transform: translateY(-4px); } }
    @media (max-width: 480px) { .wpp-float { width: 52px; height: 52px; right: 14px; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); } .wpp-float svg { width: 26px; height: 26px; } }
    @media (prefers-reduced-motion: reduce) { .wpp-float { animation: none; } }
  </style>`
}

// ── Imágenes de Cloudinary ──────────────────────────────────────────────────
// Las portadas del blog se cargan en Notion con la URL original (PNG de 1792x1024,
// 1 a 2,5 MB). Esta función le agrega a la URL una transformación de Cloudinary
// para pedir una versión achicada. Si la URL no es de Cloudinary, o ya trae una
// transformación, la devuelve igual.
export function cld(url: string, transform: string): string {
  if (!url) return url
  const m = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/)
  if (!m) return url
  const first = m[2].split('/')[0]
  const isTransform = first.split(',').every(p => /^[a-z]{1,3}_[^/]+$/.test(p))
  if (isTransform) return url
  return m[1] + transform + '/' + m[2]
}

export const IMG_CARD = 'f_auto,q_auto,c_fill,w_800,h_450'          // tarjetas del blog
export const IMG_HERO = 'f_auto,q_auto,w_1600'                      // foto grande de la nota
export const IMG_SHARE = 'c_fill,w_1200,h_630,q_auto:good,f_jpg'    // vista previa al compartir (WhatsApp pide < 300 KB)

// ── Tipografías ─────────────────────────────────────────────────────────────
// Se cargan sin frenar el primer dibujo de la página (antes demoraban ~1 s en el
// celular). Mientras llegan, se usa Georgia / la letra del sistema.
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@300;400;500;600&display=swap'
export const FONTS_HEAD = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="${FONTS_URL}">
  <link rel="stylesheet" href="${FONTS_URL}" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="${FONTS_URL}"></noscript>`

// ── Año del pie ─────────────────────────────────────────────────────────────
// Las páginas fijas se generan al publicar; el script actualiza el año en el
// navegador para que no quede viejo si pasa el 1 de enero sin un deploy.
export function yearSpan(): string {
  return `<span class="js-year">${new Date().getUTCFullYear()}</span><script>document.querySelectorAll('.js-year').forEach(function(e){e.textContent=new Date().getFullYear()})</script>`
}

// ── Texto seguro dentro del HTML ────────────────────────────────────────────
export function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
