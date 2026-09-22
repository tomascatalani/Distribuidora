export function blogListHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Puesto de Palta</title>
  <meta name="description" content="Notas sobre palta, gastronomía y el mundo de la maduración artesanal. Puesto de Palta · Buenos Aires.">
  <meta property="og:title" content="Blog — Puesto de Palta">
  <meta property="og:description" content="Notas sobre palta, gastronomía y el mundo de la maduración artesanal.">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png">
  <link rel="apple-touch-icon" href="/favicon-512.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
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
      font-family: 'Libre Baskerville', serif;
      font-size: 18px; color: #faf8f4;
    }
    .nav-logo span { color: #4a7c59; }
    .nav-back {
      font-size: 12px; font-weight: 500; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(250,248,244,0.5);
      display: flex; align-items: center; gap: 8px; transition: color 0.2s;
    }
    .nav-back:hover { color: #faf8f4; }
    .nav-back svg { width: 14px; height: 14px; fill: currentColor; }

    /* Hero */
    .blog-list-hero {
      margin-top: 72px;
      background: #0a0a0a;
      padding: 80px 48px 72px;
      text-align: center;
    }
    .blog-list-hero .eyebrow {
      font-size: 11px; font-weight: 600; letter-spacing: 5px;
      text-transform: uppercase; color: #4a7c59;
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
      font-size: 15px; color: rgba(250,248,244,0.45);
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
      background: #faf8f4;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    .blog-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(10,10,10,0.1);
    }
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
      text-transform: uppercase; color: #4a7c59; margin-bottom: 10px;
    }
    .blog-card-title {
      font-family: 'Libre Baskerville', serif;
      font-size: 20px; font-weight: 400; line-height: 1.4;
      color: #0a0a0a; margin-bottom: 12px;
    }
    .blog-card-excerpt {
      font-size: 14px; line-height: 1.7;
      color: rgba(10,10,10,0.55); margin-bottom: 16px;
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
      color: rgba(10,10,10,0.3); font-size: 14px; letter-spacing: 2px;
      text-transform: uppercase;
    }
    .blog-empty {
      grid-column: 1 / -1; text-align: center; padding: 80px 0;
    }
    .blog-empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
    .blog-empty h3 {
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
    .footer-mini-copy { font-size: 12px; color: rgba(250,248,244,0.2); }

    /* Blog mini-sub */
    .blog-mini-sub {
      margin-top: 32px;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
    }
    .blog-mini-sub-label {
      font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
      color: rgba(250,248,244,0.45);
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
      font-size: 12px; color: rgba(250,248,244,0.55);
      letter-spacing: 0.5px; min-height: 18px;
    }

    @media (max-width: 1024px) {
      .blog-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .nav { padding: 0 24px; }
      .blog-list-hero { padding: 60px 24px 56px; }
      .blog-list-body { padding: 48px 24px 80px; }
      .blog-grid { grid-template-columns: 1fr; }
      .footer-mini { padding: 24px; flex-direction: column; gap: 10px; text-align: center; }
    }
  </style>
</head>
<body>

  <nav class="nav">
    <a href="/" class="nav-logo">Puesto de <span>Palta</span></a>
    <a href="/" class="nav-back">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      Volver al inicio
    </a>
  </nav>

  <div class="blog-list-hero">
    <span class="eyebrow">Blog Paltero</span>
    <h1>Notas del mundo <em>verde.</em></h1>
    <p>Curiosidades, detrás de escena y todo lo que pasa alrededor de la palta.</p>
    <div class="blog-mini-sub">
      <span class="blog-mini-sub-label">Recibí novedades palteras</span>
      <form class="blog-mini-sub-form" id="blogSubForm">
        <input type="email" id="blogSubEmail" placeholder="tu@mail.com" autocomplete="email" required>
        <button type="submit">Suscribite</button>
      </form>
      <div class="blog-mini-sub-msg" id="blogSubMsg"></div>
    </div>
  </div>

  <main class="blog-list-body">
    <div class="blog-grid" id="blog-grid">
      <div class="blog-loading">Cargando notas…</div>
    </div>
  </main>

  <footer class="footer-mini">
    <div class="footer-mini-logo">Puesto de <span>Palta</span></div>
    <div class="footer-mini-copy">© 2026 Puesto de Palta · Buenos Aires</div>
  </footer>

  <script>
    function formatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr + 'T12:00:00')
      return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    async function loadBlog() {
      const grid = document.getElementById('blog-grid')
      try {
        const res = await fetch('/api/blog?t=' + Date.now())
        const data = await res.json()
        const articles = data.articles || []
        if (articles.length === 0) {
          grid.innerHTML = \`
            <div class="blog-empty">
              <span class="blog-empty-icon">🥑</span>
              <h3>Próximamente, notas del mundo paltero.</h3>
            </div>
          \`
          return
        }
        grid.innerHTML = articles.map(a => \`
          <article class="blog-card" onclick="window.location='/blog/\${a.slug}'">
            \${a.imageUrl
              ? \`<img class="blog-card-image" src="\${a.imageUrl}" alt="\${a.title}" loading="lazy">\`
              : \`<div class="blog-card-image-placeholder"><span>🥑</span></div>\`
            }
            <div class="blog-card-body">
              \${a.fecha ? \`<div class="blog-card-date">\${formatDate(a.fecha)}</div>\` : ''}
              <h3 class="blog-card-title">\${a.title}</h3>
              \${a.excerpt ? \`<p class="blog-card-excerpt">\${a.excerpt}</p>\` : ''}
              <a href="/blog/\${a.slug}" class="blog-card-link">Leer más</a>
            </div>
          </article>
        \`).join('')
      } catch (err) {
        grid.innerHTML = \`
          <div class="blog-empty">
            <span class="blog-empty-icon">🥑</span>
            <h3>Próximamente, notas del mundo paltero.</h3>
          </div>
        \`
      }
    }

    loadBlog()

    // Mini-sub form — blog page
    document.getElementById('blogSubForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var msg = document.getElementById('blogSubMsg');
      var btn = this.querySelector('button');
      var email = document.getElementById('blogSubEmail').value;
      btn.disabled = true; btn.textContent = '...';
      try {
        var res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        var data = await res.json();
        if (data.success) {
          this.style.display = 'none';
          msg.textContent = '¡Listo! Revisá tu casilla 🌿';
          msg.style.color = 'rgba(250,248,244,0.75)';
        } else {
          btn.disabled = false; btn.textContent = 'Suscribite';
          msg.textContent = 'Algo salió mal, intentá de nuevo.';
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
