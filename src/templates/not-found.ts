// Página 404 genérica. Se usa en el Worker y también se guarda como dist/404.html,
// que es la que muestra Cloudflare Pages para cualquier dirección que no existe
// (sin gastar pedidos del plan gratuito de Workers; ver vite.config.ts).
export function notFoundHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Página no encontrada — Puesto de Palta</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Open Sans', sans-serif; background: #faf8f4; color: #0a0a0a; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .wrap { text-align: center; padding: 48px 24px; }
    .icon { font-size: 64px; display: block; margin-bottom: 24px; }
    h1 { font-family: 'Libre Baskerville', serif; font-size: 28px; font-weight: 400; margin-bottom: 16px; color: #0a0a0a; }
    p { color: #666; font-size: 16px; margin-bottom: 32px; }
    a { display: inline-block; background: #0a0a0a; color: #faf8f4; padding: 14px 28px; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; transition: background 0.2s; margin: 4px; }
    a:hover { background: #4a7c59; }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="icon">🥑</span>
    <h1>Página no encontrada.</h1>
    <p>La página que buscás no existe o cambió de lugar.</p>
    <a href="/">Ir al inicio</a>
    <a href="/blog">Ver el blog</a>
  </div>
</body>
</html>`
}
