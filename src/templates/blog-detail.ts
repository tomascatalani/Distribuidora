export function blogDetailHTML(article: any): string {
  const { title, fecha, imageUrl, htmlContent, excerpt } = article
  const formattedDate = fecha
    ? new Date(fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Puesto de Palta</title>
  <meta name="description" content="${excerpt || ''}">
  <meta property="og:title" content="${title} — Puesto de Palta">
  <meta property="og:description" content="${excerpt || ''}">
  <meta property="og:type" content="article">
  ${imageUrl ? `<meta property="og:image" content="${imageUrl}">` : ''}
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png">
  <link rel="apple-touch-icon" href="/favicon-512.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <!-- OneSignal Web SDK -->
  <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
  <script>
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
        appId: "f79c1b7e-b2fc-4f3f-a7eb-fb0ba3dec26e",
      });
    });
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Open Sans', sans-serif;
      background-color: #faf8f4;
      color: #0a0a0a;
      font-size: 16px;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: #4a7c59; color: #faf8f4; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: inherit; text-decoration: none; }

    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px;
      height: 72px;
      background: rgba(10, 10, 10, 0.97);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .nav-logo {
      font-family: 'Libre Baskerville', Georgia, serif;
      font-size: 18px;
      color: #faf8f4;
    }
    .nav-logo span { color: #4a7c59; }
    .nav-back {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(250,248,244,0.5);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: color 0.2s;
    }
    .nav-back:hover { color: #faf8f4; }
    .nav-back svg { width: 14px; height: 14px; fill: currentColor; }

    /* Hero */
    .blog-hero {
      margin-top: 72px;
      ${imageUrl ? `
      background: linear-gradient(to bottom, rgba(10,10,10,0.1), rgba(10,10,10,0.7)), url('${imageUrl}') center/cover no-repeat;
      min-height: 480px;
      display: flex;
      align-items: flex-end;
      padding-bottom: 60px;
      ` : `
      background: #0a0a0a;
      min-height: 280px;
      display: flex;
      align-items: flex-end;
      padding-bottom: 60px;
      `}
    }
    .blog-hero-content {
      max-width: 820px;
      margin: 0 auto;
      padding: 0 48px;
      width: 100%;
    }
    .blog-date {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #4a7c59;
      margin-bottom: 16px;
      display: block;
    }
    .blog-title {
      font-family: 'Libre Baskerville', Georgia, serif;
      font-size: clamp(28px, 4vw, 52px);
      font-weight: 400;
      line-height: 1.2;
      color: #faf8f4;
      margin-bottom: 16px;
    }
    .blog-excerpt-lead {
      font-size: 18px;
      color: rgba(250,248,244,0.65);
      font-style: italic;
      font-family: 'Libre Baskerville', serif;
      max-width: 580px;
    }

    /* Article body */
    .article-body {
      max-width: 720px;
      margin: 0 auto;
      padding: 72px 48px 100px;
    }

    /* Rich text styles */
    .blog-h1 {
      font-family: 'Libre Baskerville', serif;
      font-size: 32px;
      font-weight: 400;
      color: #0a0a0a;
      margin: 48px 0 20px;
      line-height: 1.3;
    }
    .blog-h2 {
      font-family: 'Libre Baskerville', serif;
      font-size: 26px;
      font-weight: 400;
      color: #0a0a0a;
      margin: 40px 0 16px;
      line-height: 1.35;
    }
    .blog-h3 {
      font-family: 'Libre Baskerville', serif;
      font-size: 21px;
      font-weight: 700;
      color: #0a0a0a;
      margin: 32px 0 12px;
    }
    .blog-p {
      font-size: 17px;
      line-height: 1.85;
      color: #2a2a2a;
      margin-bottom: 24px;
    }
    .blog-p strong { font-weight: 600; color: #0a0a0a; }
    .blog-p em { font-style: italic; color: #333; }
    .blog-p a { color: #4a7c59; border-bottom: 1px solid #4a7c59; transition: opacity 0.2s; }
    .blog-p a:hover { opacity: 0.7; }
    .blog-p code { background: #f0ede7; padding: 2px 6px; font-family: monospace; font-size: 14px; }
    .blog-quote {
      border-left: 3px solid #4a7c59;
      padding: 20px 28px;
      margin: 36px 0;
      font-family: 'Libre Baskerville', serif;
      font-style: italic;
      font-size: 20px;
      line-height: 1.65;
      color: #333;
      background: rgba(74,124,89,0.04);
    }
    .blog-li, .blog-li-num {
      font-size: 17px;
      line-height: 1.85;
      color: #2a2a2a;
      margin-left: 24px;
      margin-bottom: 8px;
    }
    .blog-divider {
      border: none;
      border-top: 1px solid #e0ddd7;
      margin: 48px 0;
    }
    .blog-figure {
      margin: 36px 0;
    }
    .blog-figure img {
      width: 100%;
      max-height: 500px;
      object-fit: cover;
    }
    .blog-figure figcaption {
      font-size: 13px;
      color: #999;
      text-align: center;
      margin-top: 10px;
      font-style: italic;
    }
    .blog-code {
      background: #0a0a0a;
      color: #faf8f4;
      padding: 20px 24px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.6;
      margin: 28px 0;
    }

    /* Empty content */
    .article-empty {
      text-align: center;
      padding: 60px 0;
      color: #999;
      font-style: italic;
      font-family: 'Libre Baskerville', serif;
      font-size: 18px;
    }

    /* Back to blog */
    .article-back {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 48px 80px;
      border-top: 1px solid #e0ddd7;
      padding-top: 40px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #0a0a0a;
      border-bottom: 1px solid #0a0a0a;
      padding-bottom: 2px;
      transition: color 0.2s, border-color 0.2s;
    }
    .back-link:hover { color: #4a7c59; border-color: #4a7c59; }
    .back-link svg { width: 14px; height: 14px; fill: currentColor; }

    /* Suscripción inline */
    .inline-subs {
      max-width: 720px;
      margin: 0 auto 0;
      padding: 56px 48px;
      background: #0e0e0e;
      text-align: center;
    }
    .inline-subs .subs-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: rgba(74,124,89,0.8);
      display: block;
      margin-bottom: 14px;
    }
    .inline-subs h3 {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(20px, 3vw, 28px);
      font-weight: 400;
      color: #faf8f4;
      margin-bottom: 10px;
    }
    .inline-subs h3 em { font-style: italic; color: #6aaa82; }
    .inline-subs .subs-copy {
      font-size: 14px;
      color: rgba(250,248,244,0.5);
      margin-bottom: 28px;
      line-height: 1.6;
    }
    .inline-subs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 0;
    }
    .inline-subs-option {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 28px 24px;
      text-align: left;
    }
    .inline-subs-option h4 {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #faf8f4;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .inline-subs-option p {
      font-size: 13px;
      color: rgba(250,248,244,0.45);
      margin-bottom: 18px;
      line-height: 1.55;
    }
    .inline-email-form { display: flex; gap: 8px; }
    .inline-email-input {
      flex: 1;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      color: #faf8f4;
      padding: 10px 14px;
      font-size: 13px;
      border-radius: 4px;
      outline: none;
    }
    .inline-email-input::placeholder { color: rgba(250,248,244,0.3); }
    .inline-email-input:focus { border-color: #4a7c59; }
    .inline-email-btn {
      background: #4a7c59;
      color: #faf8f4;
      border: none;
      padding: 10px 18px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .inline-email-btn:hover { background: #3d6b4a; }
    .inline-email-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .inline-push-btn {
      width: 100%;
      background: transparent;
      border: 1.5px solid rgba(250,248,244,0.25);
      color: #faf8f4;
      padding: 11px 18px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 4px;
      transition: border-color 0.2s, background 0.2s;
    }
    .inline-push-btn:hover { border-color: #4a7c59; background: rgba(74,124,89,0.1); }
    .inline-push-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .inline-subs-success {
      display: none;
      font-size: 13px;
      color: #6aaa82;
      margin-top: 10px;
      font-weight: 500;
    }
    .inline-subs-success.show { display: block; }
    @media (max-width: 600px) {
      .inline-subs { padding: 40px 24px; }
      .inline-subs-grid { grid-template-columns: 1fr; }
      .inline-email-form { flex-direction: column; }
    }

    /* Footer mini */
    .footer-mini {
      background: #0a0a0a;
      padding: 32px 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-mini-logo {
      font-family: 'Libre Baskerville', serif;
      font-size: 16px;
      color: #faf8f4;
    }
    .footer-mini-logo span { color: #4a7c59; }
    .footer-mini-copy {
      font-size: 12px;
      color: rgba(250,248,244,0.2);
    }

    @media (max-width: 768px) {
      .nav { padding: 0 24px; }
      .blog-hero-content { padding: 0 24px; }
      .article-body { padding: 48px 24px 72px; }
      .article-back { padding: 32px 24px 60px; }
      .footer-mini { padding: 24px; flex-direction: column; gap: 10px; text-align: center; }
      .blog-title { font-size: 28px; }
    }
  </style>
</head>
<body>

  <nav class="nav">
    <a href="/" class="nav-logo">Puesto de <span>Palta</span></a>
    <a href="/#blog" class="nav-back">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      Volver al blog
    </a>
  </nav>

  <div class="blog-hero">
    <div class="blog-hero-content">
      ${formattedDate ? `<span class="blog-date">${formattedDate}</span>` : ''}
      <h1 class="blog-title">${title}</h1>
      ${excerpt ? `<p class="blog-excerpt-lead">${excerpt}</p>` : ''}
    </div>
  </div>

  <article class="article-body">
    ${htmlContent
      ? htmlContent
      : `<p class="article-empty">El contenido de este artículo está en preparación.</p>`
    }
  </article>

  <!-- Suscripción inline post-artículo -->
  <div class="inline-subs">
    <span class="subs-label">Newsletter</span>
    <h3>¿Te gustó la nota? <em>Quedá en el loop.</em></h3>
    <p class="subs-copy">Notas nuevas, curiosidades y detrás de escena. Sin spam. Sin ruido.</p>
    <div class="inline-subs-grid">
      <div class="inline-subs-option">
        <h4>✉️ &nbsp;Por email</h4>
        <p>Te mandamos cada nota nueva directo a tu bandeja.</p>
        <form class="inline-email-form" id="inline-email-form">
          <input type="email" class="inline-email-input" id="inline-email-input" placeholder="tu@email.com" required>
          <button type="submit" class="inline-email-btn" id="inline-email-btn">Suscribirme</button>
        </form>
        <p class="inline-subs-success" id="inline-subs-success">¡Listo! Te mandamos un mail de confirmación. Si cae en spam, marcalo como No es spam para que los próximos lleguen directo.</p>
      </div>
      <div class="inline-subs-option">
        <h4>🔔 &nbsp;Notificaciones push</h4>
        <p>Aviso instantáneo en el navegador cuando publicamos algo nuevo.</p>
        <button class="inline-push-btn" id="inline-push-btn" onclick="handleInlinePush()">Activar notificaciones</button>
        <p class="inline-subs-success" id="inline-push-success">¡Listo! Te avisamos cuando sube algo nuevo.</p>
      </div>
    </div>
  </div>

  <div class="article-back">
    <a href="/#blog" class="back-link">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      Volver al blog
    </a>
  </div>

  <footer class="footer-mini">
    <div class="footer-mini-logo">Puesto de <span>Palta</span></div>
    <div class="footer-mini-copy">© 2026 Puesto de Palta. Buenos Aires.</div>
  </footer>

  <script>
    // Email suscripción inline
    document.getElementById('inline-email-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('inline-email-btn');
      const success = document.getElementById('inline-subs-success');
      const emailVal = document.getElementById('inline-email-input').value;
      btn.disabled = true;
      btn.textContent = 'Procesando…';
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal })
        });
        const data = await res.json();
        if (data.success) {
          this.style.display = 'none';
          success.classList.add('show');
        } else {
          btn.disabled = false;
          btn.textContent = 'Suscribirme';
          alert('Error al suscribirse. Intentá de nuevo.');
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Suscribirme';
      }
    });

    // Push suscripción inline
    async function handleInlinePush() {
      const btn = document.getElementById('inline-push-btn');
      const success = document.getElementById('inline-push-success');
      if (!btn) return;
      btn.disabled = true;
      btn.textContent = 'Activando…';
      try {
        await window.OneSignalDeferred?.push(async function(OneSignal) {
          await OneSignal.Slidedown.promptPush();
          const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
          if (isSubscribed) {
            btn.style.display = 'none';
            success.classList.add('show');
          } else {
            btn.disabled = false;
            btn.textContent = 'Activar notificaciones';
          }
        });
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Activar notificaciones';
      }
    }
  </script>

</body>
</html>`
}

export function blogNotFoundHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Artículo no encontrado — Puesto de Palta</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Open Sans', sans-serif; background: #faf8f4; color: #0a0a0a; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .wrap { text-align: center; padding: 48px 24px; }
    .icon { font-size: 64px; display: block; margin-bottom: 24px; }
    h1 { font-family: 'Libre Baskerville', serif; font-size: 28px; font-weight: 400; margin-bottom: 16px; color: #0a0a0a; }
    p { color: #666; font-size: 16px; margin-bottom: 32px; }
    a { display: inline-block; background: #0a0a0a; color: #faf8f4; padding: 14px 28px; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; transition: background 0.2s; }
    a:hover { background: #4a7c59; }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="icon">🥑</span>
    <h1>Artículo no encontrado.</h1>
    <p>El artículo que buscás no existe o fue removido.</p>
    <a href="/#blog">Volver al blog</a>
  </div>
</body>
</html>`
}
