import { FACEBOOK_ICON, FACEBOOK_URL, INSTAGRAM_ICON, INSTAGRAM_URL, LOGO_URL, OG_IMAGE, SITE_URL, socialIcons, METRICOOL_TRACKER, WA_MSG, whatsappFloat, FONTS_HEAD, yearSpan } from '../lib/site'

export function blogListHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Paltero: historias y datos sobre la palta | Puesto de Palta</title>
  <meta name="description" content="Notas sobre la palta: ciencia, industria, cultura y ecología, contadas desde Buenos Aires. Una nota nueva cada dos semanas. Blog de Puesto de Palta.">
  <link rel="canonical" href="${SITE_URL}/blog">
  <meta property="og:title" content="Blog Paltero — Puesto de Palta">
  <meta property="og:description" content="Notas sobre la palta: ciencia, industria, cultura y ecología. Una nota nueva cada dos semanas.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_AR">
  <meta property="og:site_name" content="Puesto de Palta">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${SITE_URL}/blog">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0a0a0a">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png">
  <link rel="apple-touch-icon" href="/favicon-512.png">
  ${FONTS_HEAD}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Open Sans', sans-serif;
      background: #faf8f4;
      color: #0a0a0a;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: #4a7c59; color: #faf8f4; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }

    /* Nav */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 48px; height: 72px;
      background: rgba(10,10,10,0.97);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      font-family: 'Libre Baskerville', serif;
      font-size: 18px; color: #faf8f4;
    }
    .nav-logo-name span { color: #4a7c59; }
    .nav-logo img { width: 44px; height: 44px; object-fit: contain; }
    .nav-back {
      font-size: 12px; font-weight: 500; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(250,248,244,0.5);
      display: flex; align-items: center; gap: 8px; transition: color 0.2s;
    }
    .nav-back:hover { color: #faf8f4; }
    .nav-back svg { width: 14px; height: 14px; fill: currentColor; }
    .nav-right { display: flex; align-items: center; gap: 28px; }

    /* Íconos de Instagram y Facebook */
    .social-icons { display: flex; align-items: center; gap: 8px; }
    .social-icons a {
      width: 30px; height: 30px; border-radius: 50%;
      border: 1px solid rgba(250,248,244,0.25); color: rgba(250,248,244,0.75);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .social-icons a:hover { background: #4a7c59; border-color: #4a7c59; color: #faf8f4; }
    .social-icons svg { width: 14px; height: 14px; fill: currentColor; }

    /* Hero */
    .blog-list-hero {
      margin-top: 72px;
      background: #0a0a0a;
      padding: 80px 48px 72px;
      text-align: center;
    }
    .blog-list-hero .eyebrow {
      font-size: 11px; font-weight: 600; letter-spacing: 5px;
      text-transform: uppercase; color: #6fa37d;
      display: block; margin-bottom: 20px;
    }
    .blog-list-hero h1 {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(32px, 5vw, 60px);
      font-weight: 400; color: #faf8f4; line-height: 1.15;
      margin-bottom: 16px;
    }
    .blog-list-hero h1 em { font-style: italic; color: rgba(250,248,244,0.7); }
    .blog-list-hero p {
      font-size: 15px; color: rgba(250,248,244,0.7);
      letter-spacing: 0.5px;
    }

    /* Grid */
    .blog-list-body {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 48px 120px;
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 36px;
    }
    .blog-card {
      display: block;
      background: #faf8f4;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    .blog-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(10,10,10,0.1);
    }
    .blog-card:focus-visible { outline: 2px solid #4a7c59; outline-offset: 4px; }
    .blog-card:hover .blog-card-link { color: #4a7c59; border-color: #4a7c59; }
    .blog-card-image {
      width: 100%; height: 220px; object-fit: cover;
    }
    .blog-card-image-placeholder {
      width: 100%; height: 220px;
      background: #e8e4dc;
      display: flex; align-items: center; justify-content: center;
      font-size: 40px;
    }
    .blog-card-body { padding: 24px 0 8px; }
    .blog-card-date {
      font-size: 11px; font-weight: 600; letter-spacing: 3px;
      text-transform: uppercase; color: #3d6b4a; margin-bottom: 10px;
    }
    .blog-card-title {
      font-family: 'Libre Baskerville', serif;
      font-size: 20px; font-weight: 400; line-height: 1.4;
      color: #0a0a0a; margin-bottom: 12px;
    }
    .blog-card-excerpt {
      font-size: 14px; line-height: 1.7;
      color: #555; margin-bottom: 16px;
      display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
    }
    .blog-card-link {
      font-size: 11px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: #0a0a0a;
      border-bottom: 1px solid #0a0a0a; padding-bottom: 2px;
      transition: color 0.2s, border-color 0.2s; display: inline-block;
    }
    .blog-card-link:hover { color: #4a7c59; border-color: #4a7c59; }

    /* Loading / empty */
    .blog-loading {
      grid-column: 1 / -1; text-align: center; padding: 80px 0;
      color: rgba(10,10,10,0.6); font-size: 14px; letter-spacing: 2px;
      text-transform: uppercase;
    }
    .blog-empty {
      grid-column: 1 / -1; text-align: center; padding: 80px 0;
    }
    .blog-empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
    .blog-empty h2, .blog-empty h3 {
      font-family: 'Libre Baskerville', serif;
      font-size: 20px; font-weight: 400; color: rgba(10,10,10,0.4);
    }

    /* Footer mini */
    .footer-mini {
      background: #0a0a0a; padding: 32px 48px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .footer-mini-logo {
      font-family: 'Libre Baskerville', serif;
      font-size: 16px; color: #faf8f4;
    }
    .footer-mini-logo span { color: #4a7c59; }
    .footer-mini-logo img {
      display: inline-block; vertical-align: middle;
      width: 36px; height: 36px; object-fit: contain; margin-right: 8px;
    }
    .footer-mini-ig {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; letter-spacing: 1px; color: rgba(250,248,244,0.7);
      transition: color 0.2s;
    }
    .footer-mini-ig:hover { color: #faf8f4; }
    .footer-mini-ig svg { width: 16px; height: 16px; fill: currentColor; }
    .footer-mini-social { display: flex; align-items: center; gap: 24px; }
    .footer-mini-copy { font-size: 12px; color: rgba(250,248,244,0.55); }
    .hp { position: absolute !important; left: -10000px !important; width: 1px; height: 1px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .blog-card:hover { transform: none; } }

    /* Blog mini-sub */
    .blog-mini-sub {
      margin-top: 32px;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
    }
    .blog-mini-sub-label {
      font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
      color: rgba(250,248,244,0.7);
    }
    .blog-mini-sub-form {
      display: flex; gap: 0; max-width: 340px; width: 100%;
    }
    .blog-mini-sub-form input {
      flex: 1;
      background: rgba(250,248,244,0.07);
      border: 1px solid rgba(250,248,244,0.18);
      border-right: none;
      color: #faf8f4;
      font-size: 13px;
      padding: 10px 16px;
      border-radius: 2px 0 0 2px;
      outline: none;
      font-family: 'Open Sans', sans-serif;
      transition: border-color 0.2s;
    }
    .blog-mini-sub-form input::placeholder { color: rgba(250,248,244,0.28); }
    .blog-mini-sub-form input:focus { border-color: rgba(250,248,244,0.4); }
    .blog-mini-sub-form button {
      background: #4a7c59; color: #faf8f4;
      font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 10px 18px;
      border-radius: 0 2px 2px 0; border: none; cursor: pointer;
      font-family: 'Open Sans', sans-serif;
      transition: background 0.2s;
    }
    .blog-mini-sub-form button:hover { background: #3d6b4a; }
    .blog-mini-sub-form button:disabled { opacity: 0.6; cursor: default; }
    .blog-mini-sub-msg {
      font-size: 12px; color: rgba(250,248,244,0.75);
      letter-spacing: 0.5px; min-height: 18px;
    }

    @media (max-width: 1024px) {
      .blog-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .nav { padding: 0 24px; }
      .nav-logo-name { display: none; }
      .nav-right { gap: 16px; }
      .blog-list-hero { padding: 60px 24px 56px; }
      .blog-list-body { padding: 48px 24px 80px; }
      .blog-grid { grid-template-columns: 1fr; }
      .footer-mini { padding: 24px; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
    }
  </style>
  ${METRICOOL_TRACKER}
</head>
<body>

  <nav class="nav" aria-label="Principal">
    <a href="/" class="nav-logo">
      <img src="${LOGO_URL}" alt="Puesto de Palta" width="44" height="44" loading="eager">
      <span class="nav-logo-name" aria-hidden="true">Puesto de <span>Palta</span></span>
    </a>
    <div class="nav-right">
      ${socialIcons()}
      <a href="/" class="nav-back">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Volver al inicio
      </a>
    </div>
  </nav>

  <div class="blog-list-hero">
    <span class="eyebrow">Blog Paltero</span>
    <h1>Notas del mundo <em>verde.</em></h1>
    <p>Curiosidades, detrás de escena y todo lo que pasa alrededor de la palta.</p>
    <div class="blog-mini-sub">
      <span class="blog-mini-sub-label" id="blogSubLabel">Recibí cada nota nueva por mail</span>
      <form class="blog-mini-sub-form" id="blogSubForm" aria-labelledby="blogSubLabel">
        <input type="email" id="blogSubEmail" placeholder="tu@mail.com" autocomplete="email" aria-label="Tu email" required>
        <input type="text" id="blogSubWebsite" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button type="submit">Suscribite</button>
      </form>
      <div class="blog-mini-sub-msg" id="blogSubMsg" role="status"></div>
    </div>
  </div>

  <main class="blog-list-body">
    <div class="blog-grid" id="blog-grid">
      <div class="blog-loading">Cargando notas…<noscript><br>Para ver las notas hace falta JavaScript.</noscript></div>
    </div>
  </main>

  <footer class="footer-mini">
    <a href="/" class="footer-mini-logo">
      <img src="${LOGO_URL}" alt="" width="36" height="36" loading="lazy">
      Puesto de <span>Palta</span>
    </a>
    <div class="footer-mini-social">
      <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" class="footer-mini-ig">
        ${INSTAGRAM_ICON}
        @puestodepalta
      </a>
      <a href="${FACEBOOK_URL}" target="_blank" rel="noopener" class="footer-mini-ig">
        ${FACEBOOK_ICON}
        Facebook
      </a>
    </div>
    <div class="footer-mini-copy">© ${yearSpan()} Puesto de Palta · Buenos Aires</div>
  </footer>

  ${whatsappFloat(WA_MSG.blog)}

  <script>
    function escHTML(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    function formatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(String(dateStr).slice(0, 10) + 'T12:00:00')
      return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    function emptyBlog(grid) {
      grid.innerHTML = '<div class="blog-empty"><span class="blog-empty-icon" aria-hidden="true">🥑</span><h2>Próximamente, notas del mundo paltero.</h2></div>'
    }

    async function loadBlog() {
      const grid = document.getElementById('blog-grid')
      try {
        const res = await fetch('/api/blog')
        const data = await res.json()
        const articles = data.articles || []
        if (articles.length === 0) return emptyBlog(grid)
        grid.innerHTML = articles.map((a, i) => {
          const img = a.thumbUrl || a.imageUrl
          return '<a class="blog-card" href="/blog/' + encodeURIComponent(a.slug) + '">' +
            (img
              ? '<img class="blog-card-image" src="' + escHTML(img) + '" alt="" ' + (i < 3 ? 'fetchpriority="high"' : 'loading="lazy"') + ' width="800" height="450">'
              : '<div class="blog-card-image-placeholder"><span aria-hidden="true">🥑</span></div>') +
            '<div class="blog-card-body">' +
              (a.fecha ? '<div class="blog-card-date">' + formatDate(a.fecha) + '</div>' : '') +
              '<h2 class="blog-card-title">' + escHTML(a.title) + '</h2>' +
              (a.excerpt ? '<p class="blog-card-excerpt">' + escHTML(a.excerpt) + '</p>' : '') +
              '<span class="blog-card-link">Leer más</span>' +
            '</div></a>'
        }).join('')
      } catch (err) {
        emptyBlog(grid)
      }
    }

    loadBlog()

    // Mini-sub form — blog page
    var pageLoadedAt = Date.now();
    document.getElementById('blogSubForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var msg = document.getElementById('blogSubMsg');
      var btn = this.querySelector('button');
      var email = document.getElementById('blogSubEmail').value;
      var website = document.getElementById('blogSubWebsite').value;
      btn.disabled = true; btn.textContent = '...';
      try {
        var res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, website: website, t: pageLoadedAt })
        });
        var data = await res.json();
        if (data.success) {
          this.style.display = 'none';
          msg.textContent = '¡Listo! Revisá tu casilla 🌿';
          msg.style.color = 'rgba(250,248,244,0.75)';
        } else {
          btn.disabled = false; btn.textContent = 'Suscribite';
          msg.textContent = data.error || 'Algo salió mal, intentá de nuevo.';
        }
      } catch(err) {
        btn.disabled = false; btn.textContent = 'Suscribite';
        msg.textContent = 'Error de conexión.';
      }
    });
  </script>

</body>
</html>`
}
