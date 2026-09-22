export function homeHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Puesto de Palta — La calidad no se explica, se nota.</title>
  <meta name="description" content="Distribuidora artesanal de paltas premium en Buenos Aires. Maduración personalizada, calidad que se nota.">
  <meta property="og:title" content="Puesto de Palta">
  <meta property="og:description" content="La calidad no se explica, se nota. Maduración personalizada, trato humano, logística rápida. Buenos Aires.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://puestodepalta.com/og-image.jpg">
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
    /* ═══════════════════════════════════════
       RESET & BASE
    ═══════════════════════════════════════ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Open Sans', sans-serif;
      background-color: #0a0a0a;
      color: #0a0a0a;
      font-size: 16px;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: #4a7c59; color: #faf8f4; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* ═══════════════════════════════════════
       TYPOGRAPHY SYSTEM
    ═══════════════════════════════════════ */
    .serif { font-family: 'Libre Baskerville', Georgia, serif; }
    .serif-italic { font-family: 'Libre Baskerville', Georgia, serif; font-style: italic; }
    h1, h2, h3 { font-family: 'Libre Baskerville', Georgia, serif; font-weight: 400; line-height: 1.2; }
    .section-label {
      font-family: 'Open Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #4a7c59;
      margin-bottom: 20px;
      display: block;
    }

    /* ═══════════════════════════════════════
       NAVIGATION
    ═══════════════════════════════════════ */
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
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      transition: all 0.3s ease;
    }
    .nav.scrolled {
      height: 60px;
      background: rgba(10, 10, 10, 0.98);
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Libre Baskerville', Georgia, serif;
      font-size: 18px;
      color: #faf8f4;
      letter-spacing: 1px;
    }
    .nav-logo img {
      height: 44px;
      width: 44px;
      object-fit: contain;
      display: block;
    }
    .nav-logo span {
      color: #4a7c59;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 36px;
      list-style: none;
    }
    .nav-links a {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(250, 248, 244, 0.7);
      transition: color 0.2s;
    }
    .nav-links a:hover { color: #faf8f4; }
    .nav-cta {
      background: #4a7c59;
      color: #faf8f4 !important;
      padding: 10px 22px;
      font-size: 11px !important;
      letter-spacing: 2px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      transition: background 0.2s !important;
    }
    .nav-cta:hover { background: #3d6b4a !important; color: #faf8f4 !important; }
    .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
    .nav-hamburger span { display: block; width: 24px; height: 1.5px; background: #faf8f4; transition: all 0.3s; }

    /* ═══════════════════════════════════════
       HERO
    ═══════════════════════════════════════ */
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #0a0a0a;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .hero-bg video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.7;
    }
    .hero-bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.85) 100%);
      z-index: 1;
    }
    .hero-content { z-index: 2; }
    @media (max-width: 480px) {
      .hero-ctas {
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .hero-btn-primary,
      .hero-btn-secondary {
        width: 100%;
        max-width: 280px;
        text-align: center;
      }
    }
    .scroll-indicator { z-index: 2; }
    .hero-content {
      position: relative;
      text-align: center;
      padding: 0 24px;
      max-width: 800px;
    }
    .hero-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #4a7c59;
      margin-bottom: 28px;
      display: block;
    }
    .hero h1 {
      font-size: clamp(28px, 5.5vw, 72px);
      color: #faf8f4;
      font-weight: 400;
      line-height: 1 !important;
      margin-bottom: 14px;
    }
    .hero h1 em {
      font-style: italic;
      color: rgba(250,248,244,0.85);
      display: block;
      white-space: nowrap;
      line-height: 1 !important;
      margin-bottom: 0.05em;
    }
    .hero-subtitle {
      font-size: clamp(14px, 2vw, 17px);
      color: #faf8f4;
      font-weight: 400;
      letter-spacing: 0.5px;
      max-width: 480px;
      margin: 0 auto;
      margin-top: 10px;
    }
    .hero-ctas {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 36px;
      flex-wrap: wrap;
    }
    .hero-btn-primary {
      display: inline-block;
      padding: 14px 34px;
      background: #4a7c59;
      color: #faf8f4;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 2px;
      transition: background 0.25s ease, transform 0.2s ease;
    }
    .hero-btn-primary:hover {
      background: #5e9970;
      transform: translateY(-2px);
    }
    .hero-btn-secondary {
      display: inline-block;
      padding: 14px 34px;
      background: transparent;
      color: #faf8f4;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 2px;
      border: 1.5px solid rgba(250,248,244,0.45);
      transition: border-color 0.25s ease, color 0.25s ease, transform 0.2s ease;
    }
    .hero-btn-secondary:hover {
      border-color: rgba(250,248,244,0.9);
      color: #faf8f4;
      transform: translateY(-2px);
    }
    .hero-mini-sub {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .hero-mini-sub-label {
      font-size: 11px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: rgba(250,248,244,0.45);
    }
    .hero-mini-sub-form {
      display: flex;
      gap: 0;
      max-width: 340px;
      width: 100%;
    }
    .hero-mini-sub-form input {
      flex: 1;
      background: rgba(250,248,244,0.07);
      border: 1px solid rgba(250,248,244,0.18);
      border-right: none;
      color: #faf8f4;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      padding: 10px 16px;
      outline: none;
      border-radius: 2px 0 0 2px;
      transition: border-color 0.2s, background 0.2s;
    }
    .hero-mini-sub-form input::placeholder { color: rgba(250,248,244,0.35); }
    .hero-mini-sub-form input:focus {
      background: rgba(250,248,244,0.11);
      border-color: rgba(74,124,89,0.7);
    }
    .hero-mini-sub-form button {
      background: #4a7c59;
      color: #faf8f4;
      font-family: 'Open Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 10px 18px;
      border: none;
      border-radius: 0 2px 2px 0;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }
    .hero-mini-sub-form button:hover { background: #5e9970; }
    .hero-mini-sub-msg {
      font-size: 11px;
      color: #4a7c59;
      letter-spacing: 1px;
      min-height: 16px;
    }
    @media (max-width: 480px) {
      .hero-mini-sub-form { max-width: 100%; }
    }
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .scroll-indicator span {
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(250,248,244,0.4);
    }
    .scroll-line {
      width: 1px;
      height: 50px;
      background: linear-gradient(to bottom, rgba(74,124,89,0.8), transparent);
      animation: scrollAnim 2s ease-in-out infinite;
    }
    @keyframes scrollAnim {
      0%, 100% { opacity: 1; transform: scaleY(1); transform-origin: top; }
      50% { opacity: 0.4; transform: scaleY(0.6); transform-origin: top; }
    }

    /* ═══════════════════════════════════════
       SECTIONS SHARED
    ═══════════════════════════════════════ */
    section { position: relative; }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 48px;
    }
    .section-pad {
      padding: 80px 0 100px;
      scroll-margin-top: 80px;
    }

    /* ═══════════════════════════════════════
       QUIÉNES SOMOS
    ═══════════════════════════════════════ */
    #quienes-somos {
      background: #faf8f4;
    }
    .quienes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    .quienes-text h2 {
      font-size: clamp(26px, 3.5vw, 42px);
      margin-bottom: 32px;
      color: #0a0a0a;
      line-height: 1.25;
    }
    .quienes-text p {
      font-size: 16px;
      line-height: 1.85;
      color: #444;
      margin-bottom: 20px;
    }
    .quienes-text p:last-child { margin-bottom: 0; }
    .quienes-text .accent-line {
      display: block;
      width: 48px;
      height: 2px;
      background: #4a7c59;
      margin: 36px 0;
    }
    .quienes-image-wrap {
      position: relative;
    }
    .quienes-image-wrap::before {
      content: '';
      position: absolute;
      top: -16px;
      right: -16px;
      bottom: 16px;
      left: 16px;
      background: #4a7c59;
      opacity: 0.12;
      z-index: 0;
    }
    .quienes-image-wrap img,
    .quienes-image-wrap video {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 520px;
      object-fit: cover;
      border-radius: 2px;
    }

    /* ═══════════════════════════════════════
       CONFÍAN EN NOSOTROS
    ═══════════════════════════════════════ */
    #confian {
      background: #0a0a0a;
      border-top: 1px solid rgba(255,255,255,0.04);
    }
    #confian h2 {
      font-size: clamp(22px, 3vw, 34px);
      color: #faf8f4;
      text-align: center;
      margin-bottom: 16px;
    }
    .confian-subtitle {
      text-align: center;
      font-size: 14px;
      color: rgba(250,248,244,0.35);
      letter-spacing: 0.5px;
      margin-bottom: 64px;
    }
    .logos-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      align-items: center;
    }
    .logo-placeholder {
      aspect-ratio: 2/1;
      background: #e8e4dc;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 20px;
      transition: box-shadow 0.3s;
    }
    .logo-placeholder:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .logo-placeholder img {
      max-width: 100%;
      max-height: 52px;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: opacity 0.3s;
    }
    .logo-placeholder:hover img {
      opacity: 1;
    }

    /* ═══════════════════════════════════════
       TESTIMONIOS
    ═══════════════════════════════════════ */
    /* ═══════════════════════════════════════
       TESTIMONIOS CARRUSEL
    ═══════════════════════════════════════ */
    #testimonios {
      background: #0a0a0a;
      overflow: hidden;
    }
    #testimonios .section-label {
      color: #4a7c59;
      text-align: center;
      display: block;
    }
    #testimonios h2 {
      font-size: clamp(22px, 3vw, 34px);
      text-align: center;
      margin-bottom: 52px;
      color: #faf8f4;
    }
    /* Carrusel testimonios — auto-scroll infinito (igual que galería) */
    .testi-stage {
      overflow: hidden;
      position: relative;
      padding: 20px 0;
    }
    .testi-stage::before,
    .testi-stage::after {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      width: 100px;
      z-index: 2;
      pointer-events: none;
    }
    .testi-stage::before {
      left: 0;
      background: linear-gradient(to right, #0a0a0a, transparent);
    }
    .testi-stage::after {
      right: 0;
      background: linear-gradient(to left, #0a0a0a, transparent);
    }
    .testi-track {
      display: flex;
      gap: 0;
      animation: testiScroll 25s linear infinite;
      will-change: transform;
    }
    .testi-track:hover { animation-play-state: paused; }
    @keyframes testiScroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-3540px); } /* 15 slides x 236px */
    }
    .testi-slide {
      flex-shrink: 0;
      width: 220px;
      margin-right: 16px;
      border-radius: 12px;
      overflow: hidden;
    }
    .testi-slide img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 12px;
    }
    .testi-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 28px;
    }
    .testi-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1.5px solid rgba(250,248,244,0.2);
      background: transparent;
      color: #faf8f4;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, background 0.2s;
      flex-shrink: 0;
    }
    .testi-btn:hover {
      border-color: #4a7c59;
      background: rgba(74,124,89,0.15);
    }
    .testi-dots {
      display: flex;
      gap: 7px;
      align-items: center;
    }
    .testi-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(250,248,244,0.2);
      border: none;
      padding: 0;
      cursor: pointer;
      transition: background 0.25s, transform 0.25s;
    }
    .testi-dot.active {
      background: #4a7c59;
      transform: scale(1.5);
    }
    .testi-counter {
      font-size: 11px;
      color: rgba(250,248,244,0.3);
      letter-spacing: 2px;
      text-align: center;
      margin-top: 14px;
    }
    @media (max-width: 600px) {
      .testi-stage { max-width: 100%; }
      .testi-slide { width: 160px; }
    }
    .ig-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border: 1.5px solid #0a0a0a;
      color: #0a0a0a;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 600;
      text-decoration: none;
      border-radius: 2px;
      transition: background 0.25s, color 0.25s, border-color 0.25s;
    }
    .ig-cta:hover {
      background: #0a0a0a;
      color: #faf8f4;
    }

    /* ═══════════════════════════════════════
       BLOG
    ═══════════════════════════════════════ */
    #blog {
      background: #f4f2ee;
    }
    .blog-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 56px;
    }
    .blog-header h2 {
      font-size: clamp(28px, 3.5vw, 44px);
      color: #0a0a0a;
    }
    .blog-header h2 em {
      font-style: italic;
      color: #4a7c59;
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 36px;
      min-height: 300px;
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
      width: 100%;
      height: 220px;
      object-fit: cover;
      background: #e8e4dc;
      display: block;
    }
    .blog-card-image-placeholder {
      width: 100%;
      height: 220px;
      background: linear-gradient(135deg, #d4cfc5 0%, #c8c2b5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .blog-card-image-placeholder span {
      font-size: 36px;
    }
    .blog-card-body {
      padding: 28px;
    }
    .blog-card-date {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #4a7c59;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .blog-card-title {
      font-family: 'Libre Baskerville', serif;
      font-size: 19px;
      line-height: 1.4;
      color: #0a0a0a;
      margin-bottom: 12px;
    }
    .blog-card-excerpt {
      font-size: 14px;
      color: #666;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .blog-card-link {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 600;
      color: #0a0a0a;
      border-bottom: 1px solid #0a0a0a;
      padding-bottom: 2px;
      transition: color 0.2s, border-color 0.2s;
      display: inline-block;
    }
    .blog-card-link:hover { color: #4a7c59; border-color: #4a7c59; }
    .blog-empty {
      grid-column: 1/-1;
      text-align: center;
      padding: 80px 0;
    }
    .blog-empty-icon {
      font-size: 48px;
      margin-bottom: 20px;
      display: block;
    }
    .blog-empty h3 {
      font-family: 'Libre Baskerville', serif;
      font-style: italic;
      font-size: 22px;
      color: #888;
      font-weight: 400;
    }
    #blog-loading {
      grid-column: 1/-1;
      text-align: center;
      padding: 60px 0;
    }
    .spinner {
      display: inline-block;
      width: 32px;
      height: 32px;
      border: 2px solid rgba(74,124,89,0.2);
      border-top-color: #4a7c59;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ═══════════════════════════════════════
       GALERÍA
    ═══════════════════════════════════════ */
    #galeria {
      background: #0a0a0a;
      overflow: hidden;
      padding: 120px 0;
    }
    .galeria-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .galeria-header h2 {
      font-size: clamp(28px, 3.5vw, 44px);
      color: #faf8f4;
      margin-bottom: 12px;
    }
    .galeria-header p {
      font-size: 14px;
      color: rgba(250,248,244,0.35);
    }
    .carousel-track-wrap {
      overflow: hidden;
      position: relative;
    }
    .carousel-track-wrap::before,
    .carousel-track-wrap::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 120px;
      z-index: 2;
    }
    .carousel-track-wrap::before {
      left: 0;
      background: linear-gradient(to right, #0a0a0a, transparent);
    }
    .carousel-track-wrap::after {
      right: 0;
      background: linear-gradient(to left, #0a0a0a, transparent);
    }
    .carousel-track {
      display: flex;
      gap: 0;
      animation: carouselScroll 22s linear infinite;
      will-change: transform;
    }
    .carousel-track:hover { animation-play-state: paused; }
    @keyframes carouselScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-4400px); }
    }
    .carousel-slide {
      flex-shrink: 0;
      width: 380px;
      height: 280px;
      margin-right: 20px;
      overflow: hidden;
      position: relative;
    }
    .carousel-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      transition: transform 0.5s ease;
      filter: brightness(0.85) saturate(0.9);
    }
    .carousel-slide:hover img {
      transform: scale(1.05);
      filter: brightness(1) saturate(1);
    }
    .carousel-slide--video video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.85) saturate(0.9);
      transition: filter 0.5s ease;
    }
    .carousel-slide--video:hover video {
      filter: brightness(1) saturate(1);
    }
    .carousel-slide-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }
    /* Gallery bg colors for placeholders */
    .gal-1 { background: linear-gradient(135deg, #1a2e1e, #2d4a35); }
    .gal-2 { background: linear-gradient(135deg, #2a2010, #3d3018); }
    .gal-3 { background: linear-gradient(135deg, #1e2a1e, #304530); }
    .gal-4 { background: linear-gradient(135deg, #201a10, #352b18); }
    .gal-5 { background: linear-gradient(135deg, #1a2820, #2a3d30); }
    .gal-6 { background: linear-gradient(135deg, #28201a, #3d3028); }

    /* ═══════════════════════════════════════
       MÚSICA
    ═══════════════════════════════════════ */
    #musica {
      background: #0e0e0e;
      padding: 80px 0;
    }
    .musica-inner {
      max-width: 680px;
      margin: 0 auto;
      text-align: center;
      padding: 0 24px;
    }
    .musica-inner .section-label {
      color: rgba(74,124,89,0.8);
      display: block;
      margin-bottom: 12px;
    }
    .musica-inner h2 {
      color: #faf8f4;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      margin-bottom: 8px;
      font-weight: 400;
    }
    .musica-inner h2 em {
      font-style: italic;
      color: #4a7c59;
    }
    .musica-inner p {
      color: rgba(250,248,244,0.55);
      font-size: 0.95rem;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .spotify-wrap {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    }
    .spotify-wrap iframe {
      display: block;
      width: 100%;
      border: none;
    }

    /* ═══════════════════════════════════════
       CONTACTO
    ═══════════════════════════════════════ */
    #contacto {
      background: #faf8f4;
    }
    .contacto-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 96px;
      align-items: start;
    }
    .contacto-info h2 {
      font-size: clamp(32px, 4vw, 56px);
      color: #0a0a0a;
      margin-bottom: 32px;
      line-height: 1.15;
    }
    .contacto-info h2 em {
      font-style: italic;
      color: #4a7c59;
    }
    .contacto-info p {
      font-size: 16px;
      color: #555;
      line-height: 1.8;
      margin-bottom: 40px;
      max-width: 420px;
    }
    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .contact-link-item {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 14px;
      color: #333;
      transition: color 0.2s;
    }
    .contact-link-item:hover { color: #4a7c59; }
    .contact-link-icon {
      width: 40px;
      height: 40px;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .contact-link-item:hover .contact-link-icon { background: #4a7c59; }
    .contact-link-icon svg { width: 18px; height: 18px; fill: #faf8f4; }
    .contact-form-wrap h3 {
      font-family: 'Libre Baskerville', serif;
      font-size: 20px;
      margin-bottom: 28px;
      color: #0a0a0a;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 600;
      color: #888;
      margin-bottom: 8px;
    }
    .form-input {
      width: 100%;
      padding: 14px 16px;
      background: #fff;
      border: 1px solid #e0ddd7;
      border-radius: 0;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      color: #0a0a0a;
      transition: border-color 0.2s;
      outline: none;
    }
    .form-input:focus { border-color: #4a7c59; }
    textarea.form-input { resize: vertical; min-height: 120px; }
    .form-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0a0a0a;
      color: #faf8f4;
      padding: 16px 32px;
      font-family: 'Open Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 8px;
    }
    .form-btn:hover { background: #4a7c59; }
    .form-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .form-msg {
      margin-top: 16px;
      padding: 12px 16px;
      font-size: 13px;
      display: none;
    }
    .form-msg.success {
      display: block;
      background: rgba(74,124,89,0.1);
      color: #2d5c3a;
      border-left: 3px solid #4a7c59;
    }
    .form-msg.error {
      display: block;
      background: rgba(180,40,40,0.08);
      color: #8b2020;
      border-left: 3px solid #c03030;
    }

    /* ═══════════════════════════════════════
       SUSCRIPCIÓN
    ═══════════════════════════════════════ */
    #suscripcion {
      background: #0a0a0a;
    }
    .suscripcion-header {
      text-align: center;
      margin-bottom: 64px;
    }
    .suscripcion-header h2 {
      font-size: clamp(28px, 3.5vw, 44px);
      color: #faf8f4;
      margin-bottom: 16px;
    }
    .suscripcion-header p {
      font-size: 15px;
      color: rgba(250,248,244,0.45);
      max-width: 480px;
      margin: 0 auto;
      line-height: 1.75;
    }
    .suscripcion-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      max-width: 900px;
      margin: 0 auto;
    }
    .suscripcion-option {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 48px 44px;
      transition: background 0.3s;
    }
    .suscripcion-option:hover {
      background: rgba(74,124,89,0.06);
    }
    .suscripcion-option-icon {
      font-size: 28px;
      margin-bottom: 20px;
      display: block;
    }
    .suscripcion-option h3 {
      font-family: 'Libre Baskerville', serif;
      font-size: 18px;
      color: #faf8f4;
      margin-bottom: 12px;
    }
    .suscripcion-option p {
      font-size: 14px;
      color: rgba(250,248,244,0.45);
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .subs-btn-push {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: #4a7c59;
      padding: 14px 28px;
      font-family: 'Open Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      border: 1px solid #4a7c59;
      cursor: pointer;
      transition: all 0.2s;
    }
    .subs-btn-push:hover {
      background: #4a7c59;
      color: #faf8f4;
    }
    .subs-email-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .subs-email-input {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 14px 16px;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      color: #faf8f4;
      outline: none;
      transition: border-color 0.2s;
    }
    .subs-email-input::placeholder { color: rgba(250,248,244,0.3); }
    .subs-email-input:focus { border-color: #4a7c59; }
    .subs-email-btn {
      background: #4a7c59;
      color: #faf8f4;
      padding: 14px 24px;
      font-family: 'Open Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .subs-email-btn:hover { background: #3d6b4a; }
    .subs-email-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .subs-success {
      font-size: 13px;
      color: #4a7c59;
      padding: 10px 0;
      display: none;
    }
    .subs-success.show { display: block; }
    .push-success {
      font-size: 13px;
      color: #4a7c59;
      padding: 10px 0;
      display: none;
    }
    .push-success.show { display: block; }

    /* ═══════════════════════════════════════
       FOOTER
    ═══════════════════════════════════════ */
    .footer {
      background: #050505;
      padding: 60px 0 40px;
      border-top: 1px solid rgba(255,255,255,0.04);
    }
    .footer-inner {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 40px;
      gap: 40px;
    }
    .footer-logo {
      font-family: 'Libre Baskerville', serif;
      font-size: 20px;
      color: #faf8f4;
      margin-bottom: 10px;
    }
    .footer-logo span { color: #4a7c59; }
    .footer-tagline {
      font-size: 12px;
      color: rgba(250,248,244,0.25);
      font-style: italic;
      font-family: 'Libre Baskerville', serif;
    }
    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-nav a {
      font-size: 12px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(250,248,244,0.4);
      transition: color 0.2s;
    }
    .footer-nav a:hover { color: #faf8f4; }
    .footer-contact {
      font-size: 13px;
      color: rgba(250,248,244,0.35);
      line-height: 2;
    }
    .footer-contact a { transition: color 0.2s; }
    .footer-contact a:hover { color: #4a7c59; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.04);
      padding-top: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-copy {
      font-size: 12px;
      color: rgba(250,248,244,0.2);
    }
    .footer-craft {
      font-size: 11px;
      color: rgba(250,248,244,0.12);
      letter-spacing: 1px;
    }

    /* ═══════════════════════════════════════
       PAGE TRANSITIONS
    ═══════════════════════════════════════ */
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ═══════════════════════════════════════
       MOBILE RESPONSIVE
    ═══════════════════════════════════════ */
    @media (max-width: 1024px) {
      .logos-grid { grid-template-columns: repeat(3, 1fr); }
      .quienes-grid { gap: 48px; }
    }
    @media (max-width: 768px) {
      .container { padding: 0 24px; }
      .section-pad { padding: 80px 0; }
      .nav { padding: 0 24px; }
      .nav-links { display: none; }
      .nav-links.open {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 72px;
        left: 0;
        right: 0;
        background: rgba(10,10,10,0.98);
        padding: 24px;
        gap: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        z-index: 99;
      }
      .nav-hamburger { display: flex; }
      .quienes-grid { grid-template-columns: 1fr; }
      .quienes-image-wrap { order: -1; }
      .logos-grid { grid-template-columns: repeat(2, 1fr); }

      .blog-grid { grid-template-columns: 1fr; }
      .blog-header { flex-direction: column; gap: 12px; }
      .contacto-grid { grid-template-columns: 1fr; gap: 48px; }
      .suscripcion-grid { grid-template-columns: 1fr; }
      .footer-inner { flex-direction: column; gap: 32px; }
      .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
      .carousel-slide { width: 280px; height: 210px; }
      .quienes-image-wrap img,
      .quienes-image-wrap video { height: 360px; }
    }
    @media (max-width: 480px) {
      .hero h1 { font-size: clamp(22px, 7.5vw, 32px); }
      .hero h1 em { white-space: normal; }
      .logos-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* ═══════════════════════════════════════
       SCROLLBAR
    ═══════════════════════════════════════ */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: #4a7c59; }
  </style>
</head>
<body>

  <!-- ═══════════════ NAVIGATION ═══════════════ -->
  <nav class="nav" id="main-nav">
    <a href="#" class="nav-logo">
      <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/v1773665883/puesto-de-palta/isologotipo.png" alt="Puesto de Palta" loading="eager" style="height:44px;width:44px;object-fit:contain;display:block;">
      Puesto de <span>Palta</span>
    </a>
    <ul class="nav-links" id="nav-links">
      <li><a href="#quienes-somos">Quiénes Somos</a></li>
      <li><a href="#testimonios">Testimonios</a></li>
      <li><a href="#confian">Confían en Nosotros</a></li>
      <li><a href="#galeria">Galería</a></li>
      <li><a href="#musica">Música</a></li>
      <li><a href="#contacto">Contacto</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="#suscripcion" class="nav-cta">Suscribite</a></li>
    </ul>
    <div class="nav-hamburger" id="nav-hamburger" aria-label="Menú" role="button" tabindex="0">
      <span></span><span></span><span></span>
    </div>
  </nav>

  <!-- ═══════════════ HERO ═══════════════ -->
  <section class="hero" id="inicio">
    <div class="hero-bg">
      <video autoplay muted loop playsinline poster="https://res.cloudinary.com/dxlunrd1f/image/upload/v1773666028/puesto-de-palta/galeria/foto-plato-oscuro.jpg">
        <source src="https://res.cloudinary.com/dxlunrd1f/video/upload/q_auto,f_auto/puesto-de-palta/video-hero.mp4" type="video/mp4">
      </video>
      <div class="hero-bg-overlay"></div>
    </div>
    <div class="hero-content">
      <span class="hero-eyebrow">Buenos Aires · Distribuidora Artesanal</span>
      <h1><em>La calidad no se explica,</em>se nota.</h1>
      <p class="hero-subtitle">Maduración personalizada, trato humano, logística rápida.</p>
      <div class="hero-ctas">
        <a href="/blog" class="hero-btn-primary">Leer el blog</a>
        <a href="#testimonios" class="hero-btn-secondary">Testimonios</a>
        <a href="#contacto" class="hero-btn-secondary">Contacto</a>
      </div>
      <!-- Mini suscripción hero -->
      <div class="hero-mini-sub">
        <span class="hero-mini-sub-label">Recibí novedades palteras</span>
        <form class="hero-mini-sub-form" id="heroSubForm">
          <input type="email" id="heroSubEmail" placeholder="tu@mail.com" autocomplete="email" required>
          <button type="submit">Suscribite</button>
        </form>
        <div class="hero-mini-sub-msg" id="heroSubMsg"></div>
      </div>
    </div>

  </section>

  <!-- ═══════════════ QUIÉNES SOMOS ═══════════════ -->
  <section class="section-pad" id="quienes-somos">
    <div class="container">
      <div class="quienes-grid">
        <div class="quienes-text fade-in">
          <span class="section-label">Quiénes Somos</span>
          <h2>Un ritual que empieza antes de llegar a tu mesa.</h2>
          <span class="accent-line"></span>
          <p>
            Somos un puesto artesanal de paltas premium con base en Buenos Aires. 
            Trabajamos directo con productores seleccionados, controlando cada etapa 
            del proceso desde la cosecha hasta la entrega.
          </p>
          <p>
            Fuera de la temporada nacional, trabajamos palta Chilena, Peruana y Brasilera, 
            eligiendo las zonas con los climas óptimos que junto con la experiencia, 
            habilitan una calidad magistral.
          </p>
          <p>
            Nuestra obsesión es la maduración. Cada palta llega en su punto exacto: 
            ni antes, ni después. Porque la calidad no se improvisa, se construye 
            con paciencia, criterio y proximidad humana.
          </p>
          <p>
            No vendemos volumen. Vendemos confianza. Trabajamos con restaurantes, 
            cafes especializados, franquicias exigentes, verdulerías boutique y particulares 
            que entienden que lo artesanal no es un capricho — es una elección de vida.
          </p>
        </div>
        <div class="quienes-image-wrap fade-in">
          <video autoplay muted loop playsinline
            style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
            poster="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-bowl-limones.jpg"
          >
            <source src="https://res.cloudinary.com/dxlunrd1f/video/upload/q_auto,f_auto/puesto-de-palta/reel-05-artesania.mp4" type="video/mp4">
          </video>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ CONFÍAN EN NOSOTROS ═══════════════ -->
  <section class="section-pad" id="confian">
    <div class="container">
      <span class="section-label" style="color: rgba(74,124,89,0.7); text-align: center; display: block;">Referencias</span>
      <h2>Confían en nosotros</h2>
      <p class="confian-subtitle">Restaurantes, hoteles y espacios que eligen calidad sin concesiones.</p>
      <div class="logos-grid">
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/blu-cafe.png" alt="Blu Café de Especialidad" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/dalone.png" alt="Dalone" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/la-valiente.png" alt="La Valiente Panadería" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/lo-de-facu.png" alt="Lo de Facu" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/pausa-cafe.png" alt="Pausa Café" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/sushiclub.png" alt="Sushi Club" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/sushi-pop.png" alt="Sushi Pop" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/tr3ce-cafe.png" alt="TR3CE Café" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/malagrino.png" alt="Malagrino" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/siba.png" alt="Siba" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/afines.png" alt="Afines" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/amaida.png" alt="Amaida" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/amano.png" alt="Amano" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/gokana.png" alt="Gokana" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/pushi.png" alt="Pushi" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/sombra.png" alt="Sombra" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/soshburger.png" alt="Sosh Burger" loading="lazy"></div>
        <div class="logo-placeholder"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_240/puesto-de-palta/logos/sushitown.png" alt="Sushi Town" loading="lazy"></div>
      </div>
      <p style="text-align:center; margin-top:28px; color:rgba(250,248,244,0.4); font-size:13px; letter-spacing:1.5px; text-transform:uppercase;">Y varios más&hellip;&nbsp; :)</p>
    </div>
  </section>

  <!-- ═══════════════ TESTIMONIOS CARRUSEL ═══════════════ -->
  <section class="section-pad" id="testimonios">
    <div class="container">
      <span class="section-label">Lo que dicen nuestros clientes</span>
      <h2>Palabras reales.</h2>
      <div id="testiCarousel">
        <div class="testi-stage">
          <div class="testi-track" id="testiTrack">
            <!-- set 1 — 15 fotos reales de WhatsApp portrait -->
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t05_foto_entrega1.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t06_espectaculo.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t07_caro_hermosas.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t08_facu_increibles.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t11_foto_entrega2.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t14_juana.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t16_mari_guacamole.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t17_grace.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t18_15dias.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t19_mejor_palta.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t23_magda.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t24_clau.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t25_juan_pablo.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t02_marie.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t10_rosana.jpg" alt="Testimonio" loading="lazy"></div>
            <!-- set 2 — duplicado para loop infinito -->
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t05_foto_entrega1.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t06_espectaculo.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t07_caro_hermosas.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t08_facu_increibles.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t11_foto_entrega2.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t14_juana.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t16_mari_guacamole.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t17_grace.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t18_15dias.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t19_mejor_palta.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t23_magda.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t24_clau.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t25_juan_pablo.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t02_marie.jpg" alt="Testimonio" loading="lazy"></div>
            <div class="testi-slide"><img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_400/puesto-de-palta/testimonios/t10_rosana.jpg" alt="Testimonio" loading="lazy"></div>
          </div>
        </div>
      </div>
      <!-- CTA Instagram -->
      <div style="text-align: center; margin-top: 48px;">
        <a
          href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTA1MDk5MTI4MjMwNDYz?igsh=OWdqa3h1Z292ZXk0"
          target="_blank"
          rel="noopener noreferrer"
          class="ig-cta"
          style="border-color: rgba(250,248,244,0.3); color: #faf8f4;"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="flex-shrink:0;">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Ver más en Instagram
        </a>
      </div>
    </div>
  </section>
  <!-- ═══════════════ BLOG ═══════════════ -->
  <section class="section-pad" id="blog">
    <div class="container">
      <div class="blog-header fade-in">
        <h2>Del mundo <em>paltero.</em></h2>
      </div>
      <div class="blog-grid" id="blog-grid">
        <div id="blog-loading" style="grid-column:1/-1; text-align:center; padding: 60px 0;">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ GALERÍA ═══════════════ -->
  <section id="galeria" style="scroll-margin-top: 100px;">
    <div class="galeria-header container">
      <span class="section-label" style="color: rgba(74,124,89,0.7); text-align: center; display: block;">Imágenes</span>
      <h2>Galería</h2>
      <p>Texturas, procesos y el verde que lo cambia todo.</p>
    </div>
    <div class="carousel-track-wrap">
      <div class="carousel-track" id="carousel-track">
        <!-- Slides will be duplicated for infinite scroll -->
        <!-- Fotos propias -->
        <!-- SET 1 -->
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-plato-oscuro.jpg" alt="Palta en plato, maduración perfecta" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-cortada-tabla.jpg" alt="Palta cortada sobre tabla" loading="lazy" style="object-position: center center;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-palta-vino.jpg" alt="Palta con vino Catena" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide carousel-slide--video">
          <video autoplay muted loop playsinline>
            <source src="https://res.cloudinary.com/dxlunrd1f/video/upload/q_auto,f_auto/puesto-de-palta/reel-02-maduracion.mp4" type="video/mp4">
          </video>
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-restaurante-turquesa.jpg" alt="Palta en restaurante" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-paltas-negro.jpg" alt="Paltas sobre fondo negro" loading="lazy" style="object-position: center center;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-avocado-toast-vino.jpg" alt="Avocado toast con vino" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide carousel-slide--video">
          <video autoplay muted loop playsinline>
            <source src="https://res.cloudinary.com/dxlunrd1f/video/upload/q_auto,f_auto/puesto-de-palta/reel-05-artesania.mp4" type="video/mp4">
          </video>
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-bowl-limones.jpg" alt="Bowl con paltas y limones" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-sushi-palta.jpg" alt="Palta con salsa soja" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-editorial-cuchillo.jpg" alt="Palta editorial con cuchillo" loading="lazy" style="object-position: center center;">
        </div>
        <!-- SET 2 – duplicate for seamless infinite loop -->
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-plato-oscuro.jpg" alt="Palta en plato, maduración perfecta" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-cortada-tabla.jpg" alt="Palta cortada sobre tabla" loading="lazy" style="object-position: center center;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-palta-vino.jpg" alt="Palta con vino Catena" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide carousel-slide--video">
          <video autoplay muted loop playsinline>
            <source src="https://res.cloudinary.com/dxlunrd1f/video/upload/q_auto,f_auto/puesto-de-palta/reel-02-maduracion.mp4" type="video/mp4">
          </video>
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-restaurante-turquesa.jpg" alt="Palta en restaurante" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-paltas-negro.jpg" alt="Paltas sobre fondo negro" loading="lazy" style="object-position: center center;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-avocado-toast-vino.jpg" alt="Avocado toast con vino" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide carousel-slide--video">
          <video autoplay muted loop playsinline>
            <source src="https://res.cloudinary.com/dxlunrd1f/video/upload/q_auto,f_auto/puesto-de-palta/reel-05-artesania.mp4" type="video/mp4">
          </video>
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-bowl-limones.jpg" alt="Bowl con paltas y limones" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-sushi-palta.jpg" alt="Palta con salsa soja" loading="lazy" style="object-position: center 85%;">
        </div>
        <div class="carousel-slide">
          <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/q_auto,f_auto,w_800/puesto-de-palta/galeria/foto-editorial-cuchillo.jpg" alt="Palta editorial con cuchillo" loading="lazy" style="object-position: center center;">
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ MÚSICA ═══════════════ -->
  <section id="musica" style="scroll-margin-top: 100px;">
    <div class="musica-inner">
      <span class="section-label">Nuestra canción</span>
      <h2>Sonamos <em>distinto.</em></h2>
      <p>Una canción original de Puesto de Palta. Clickeá play — o el título para abrirla en Spotify.</p>
      <div class="spotify-wrap">
        <iframe
          src="https://open.spotify.com/embed/album/1Yr5z2RbWshNQsphdxv2T1?utm_source=generator&theme=0"
          width="100%"
          height="352"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy">
        </iframe>
      </div>
    </div>
  </section>

  <!-- ═══════════════ CONTACTO ═══════════════ -->
  <section class="section-pad" id="contacto">
    <div class="container">
      <div class="contacto-grid">
        <div class="contacto-info fade-in">
          <span class="section-label">Contacto</span>
          <h2><em>Hablemos.</em></h2>
          <p>
            Si querés hacer un pedido, sumarte como cliente, 
            o simplemente saber más sobre lo que hacemos, 
            escribinos. Respondemos siempre.
          </p>
          <div class="contact-links">
            <a href="mailto:contacto@puestodepalta.com" class="contact-link-item">
              <div class="contact-link-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              contacto@puestodepalta.com
            </a>
            <a href="https://instagram.com/puestodepalta" target="_blank" rel="noopener" class="contact-link-item">
              <div class="contact-link-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              @puestodepalta
            </a>
            <a href="https://wa.me/5491140270343" target="_blank" rel="noopener" class="contact-link-item">
              <div class="contact-link-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              WhatsApp
            </a>
          </div>
        </div>
        <div class="contact-form-wrap fade-in" style="transition-delay: 0.15s">
          <h3>Envianos un mensaje</h3>
          <form id="contact-form">
            <div class="form-group">
              <label for="contact-name">Nombre</label>
              <input type="text" id="contact-name" class="form-input" placeholder="Tu nombre" required>
            </div>
            <div class="form-group">
              <label for="contact-email">Email</label>
              <input type="email" id="contact-email" class="form-input" placeholder="tu@email.com" required>
            </div>
            <div class="form-group">
              <label for="contact-phone">Teléfono</label>
              <input type="tel" id="contact-phone" class="form-input" placeholder="+54 9 11 0000 0000" required>
            </div>
            <div class="form-group">
              <label for="contact-message">Mensaje <span style="font-size:11px;color:rgba(10,10,10,0.4);font-weight:400;">(opcional)</span></label>
              <textarea id="contact-message" class="form-input" placeholder="¿En qué te podemos ayudar?"></textarea>
            </div>
            <button type="submit" class="form-btn" id="contact-btn">
              <span id="contact-btn-text">Enviar mensaje</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
            <div class="form-msg" id="contact-msg"></div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ SUSCRIPCIÓN ═══════════════ -->
  <section class="section-pad" id="suscripcion">
    <div class="container">
      <div class="suscripcion-header fade-in">
        <span class="section-label" style="color: rgba(74,124,89,0.7); text-align: center; display: block;">Newsletter</span>
        <h2>Quedá en el loop paltero.</h2>
        <p>Notas nuevas, curiosidades y detrás de escena.<br>Sin spam. Sin ruido.</p>
      </div>
      <div class="suscripcion-grid fade-in">
        <div class="suscripcion-option">
          <span class="suscripcion-option-icon">✉️</span>
          <h3>Suscripción por email</h3>
          <p>Si preferís recibirlo por mail. Te mandamos las notas nuevas directo a tu bandeja.</p>
          <form class="subs-email-form" id="subs-email-form">
            <input 
              type="email" 
              class="subs-email-input" 
              id="subs-email-input"
              placeholder="tu@email.com" 
              required
            >
            <button type="submit" class="subs-email-btn" id="subs-email-btn">Suscribirme</button>
          </form>
          <p class="subs-success" id="subs-success">¡Listo! Te mandamos un mail de confirmación. Si cae en spam, marcalo como No es spam para que los próximos lleguen directo.</p>
        </div>
        <div class="suscripcion-option">
          <span class="suscripcion-option-icon">🔔</span>
          <h3>Notificaciones push</h3>
          <p>Notificación instantánea cuando publicamos algo nuevo. Directa al navegador, sin ruido extra.</p>
          <button class="subs-btn-push" id="push-btn" onclick="handlePushSubscription()">
            Activar notificaciones
          </button>
          <p class="push-success" id="push-success">¡Listo! Te avisamos en el navegador cuando sube algo nuevo.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ FOOTER ═══════════════ -->
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <div class="footer-logo">
            <img src="https://res.cloudinary.com/dxlunrd1f/image/upload/v1773665883/puesto-de-palta/isologotipo.png" alt="Puesto de Palta" style="height:52px;width:52px;object-fit:contain;vertical-align:middle;margin-right:8px;">
            Puesto de <span>Palta</span>
          </div>
          <div class="footer-tagline">Un ritual que se comparte.</div>
        </div>
        <nav class="footer-nav">
          <a href="#quienes-somos">Quiénes Somos</a>
          <a href="/blog">Blog</a>
          <a href="#contacto">Contacto</a>
          <a href="#suscripcion">Suscribite</a>
        </nav>
        <div class="footer-contact">
          <a href="mailto:contacto@puestodepalta.com">contacto@puestodepalta.com</a><br>
          <a href="https://instagram.com/puestodepalta" target="_blank" rel="noopener">@puestodepalta — Instagram</a><br>
          <a href="https://wa.me/5491140270343" target="_blank" rel="noopener">+54 9 11 4027 0343</a><br>
          <span>Buenos Aires, Argentina</span>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-copy">© 2026 Puesto de Palta. Buenos Aires.</div>
        <div class="footer-craft">Hecho con criterio.</div>
      </div>
    </div>
  </footer>

  <!-- ═══════════════ JAVASCRIPT ═══════════════ -->
  <script>
    // ── Navigation scroll effect ──
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── Hamburger menu ──
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // ── Intersection Observer for fade-in ──
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));

    // ── Blog loader ──
    async function loadBlog() {
      const grid = document.getElementById('blog-grid');
      try {
        const res = await fetch('/api/blog?t=' + Date.now());
        const data = await res.json();
        const articles = data.articles || [];
        if (articles.length === 0) {
          grid.innerHTML = \`
            <div class="blog-empty">
              <span class="blog-empty-icon">🥑</span>
              <h3>Próximamente, notas del mundo paltero.</h3>
            </div>
          \`;
          return;
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
        \`).join('');
      } catch (err) {
        grid.innerHTML = \`
          <div class="blog-empty">
            <span class="blog-empty-icon">🥑</span>
            <h3>Próximamente, notas del mundo paltero.</h3>
          </div>
        \`;
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    loadBlog();

    // ── Contact form ──
    // ── Mini suscripción hero ──
    document.getElementById('heroSubForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const msg = document.getElementById('heroSubMsg');
      const btn = this.querySelector('button');
      const email = document.getElementById('heroSubEmail').value;
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.success) {
          this.style.display = 'none';
          msg.textContent = '¡Listo! Revisá tu casilla 🌿';
        } else {
          btn.disabled = false;
          btn.textContent = 'Suscribite';
          msg.textContent = 'Algo salió mal, intentá de nuevo.';
        }
      } catch(err) {
        btn.disabled = false;
        btn.textContent = 'Suscribite';
      }
    });

    document.getElementById('contact-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('contact-btn');
      const msg = document.getElementById('contact-msg');
      const btnText = document.getElementById('contact-btn-text');
      btn.disabled = true;
      btnText.textContent = 'Enviando…';
      msg.className = 'form-msg';
      msg.style.display = 'none';
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            message: document.getElementById('contact-message').value
          })
        });
        const data = await res.json();
        if (data.success) {
          msg.className = 'form-msg success';
          msg.textContent = '¡Mensaje enviado! Te respondemos a la brevedad.';
          msg.style.display = 'block';
          this.reset();
        } else {
          throw new Error(data.error || 'Error al enviar.');
        }
      } catch (err) {
        msg.className = 'form-msg error';
        msg.textContent = 'Hubo un error al enviar. Intentá de nuevo o escribinos directo.';
        msg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btnText.textContent = 'Enviar mensaje';
      }
    });

    // ── Email subscription ──
    document.getElementById('subs-email-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('subs-email-btn');
      const success = document.getElementById('subs-success');
      const emailVal = document.getElementById('subs-email-input').value;
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

    // ── OneSignal push subscription ──
    async function handlePushSubscription() {
      const btn = document.getElementById('push-btn');
      const success = document.getElementById('push-success');
      if (!btn) return;

      btn.disabled = true;
      btn.textContent = 'Activando…';

      // OneSignal v16 exposes the instance only inside the deferred queue.
      // We push a new task — it runs immediately if SDK is already initialized.
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal) {
        try {
          const permission = await OneSignal.Notifications.requestPermission();
          if (permission) {
            await OneSignal.User.PushSubscription.optIn();
            btn.style.display = 'none';
            if (success) success.classList.add('show');
          } else {
            btn.disabled = false;
            btn.textContent = 'Activar notificaciones';
          }
        } catch(e) {
          console.warn('OneSignal error:', e);
          btn.disabled = false;
          btn.textContent = 'Activar notificaciones';
        }
      });
    }

    // ── Active nav link ──
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      sections.forEach(section => {
        const sTop = section.offsetTop - 100;
        const sHeight = section.offsetHeight;
        const sId = section.getAttribute('id');
        const navLink = document.querySelector('.nav-links a[href="#' + sId + '"]');
        if (navLink) {
          if (scrollY >= sTop && scrollY < sTop + sHeight) {
            navLink.style.color = '#faf8f4';
          } else {
            navLink.style.color = '';
          }
        }
      });
    }, { passive: true });
  </script>

  <!-- ═══════════════ BOTÓN FLOTANTE WHATSAPP ═══════════════ -->
  <a
    href="https://wa.me/5491140270343"
    target="_blank"
    rel="noopener noreferrer"
    class="wpp-flotante"
    aria-label="Contactar por WhatsApp"
  >
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white" width="28" height="28">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>

  <style>
    .wpp-flotante {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      width: 58px;
      height: 58px;
      background: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45);
      animation: wppBounce 2.4s ease-in-out infinite;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .wpp-flotante:hover {
      animation: none;
      transform: scale(1.12);
      box-shadow: 0 6px 28px rgba(37, 211, 102, 0.65);
    }
    @keyframes wppBounce {
      0%, 100% { transform: translateY(0); }
      40%       { transform: translateY(-10px); }
      60%       { transform: translateY(-5px); }
    }
  </style>

</body>
</html>`
}
