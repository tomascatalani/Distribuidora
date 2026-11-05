# Redes sociales de Puesto de Palta

Documento de referencia para todo lo de Instagram, Facebook y WhatsApp: publicaciones,
análisis, recomendaciones y estudio de competencia. **Sin claves ni contraseñas.**

Creado el 5/11/2026. Actualizar la sección 4 en cada sesión de redes.

---

## 1. Cuentas

| Red | Dirección | Dónde aparece en la web |
|---|---|---|
| Instagram | https://instagram.com/puestodepalta | `INSTAGRAM_URL` en `src/lib/site.ts` |
| Facebook | https://www.facebook.com/profile.php?id=61590740365285 (página "Puesto de Palta") | `FACEBOOK_URL` en `src/lib/site.ts` |
| WhatsApp | https://wa.me/5491140270343 | Botón flotante y Contacto en `src/templates/home.ts` |

## 2. Cómo se conecta Claude a las redes (relevado el 5/11/2026)

- **No hay conexión oficial de Meta para publicar en Instagram o Facebook.** Las
  conexiones oficiales de Meta (https://developers.facebook.com/documentation/mcp) son
  tres: anuncios pagos (Meta Ads MCP), herramientas para desarrolladores, y WhatsApp
  Business Tools (beta). Ninguna publica posts orgánicos ni lee comentarios.
- **Opción elegida como recomendación: Metricool** (conector del directorio de
  Claude). Conecta Instagram y Facebook en un solo lugar. Herramientas: programar y
  editar publicaciones, ver métricas, mejor horario para publicar. Según su ayuda, el
  conector funciona con el plan gratis de Metricool (se aplican los límites del plan).
  Requisitos: cuenta en metricool.com con la marca creada, Instagram como cuenta
  profesional (empresa o creador) y la página de Facebook vinculadas dentro de Metricool.
- Alternativa: **Windsor.ai for Social Media** (plan gratis con una sola fuente y 30
  días de historia). Más orientado a informes.
- **WhatsApp:** la conexión oficial (WhatsApp Business Tools MCP) es para la
  plataforma API de WhatsApp (Cloud API): necesita una app de desarrollador de Meta,
  aceptar los términos de la Cloud API, y los mensajes se cobran. No sirve para la app
  común de WhatsApp Business. **Recomendación: no conectar por ahora.**
- Competencia: se puede estudiar sin conectar nada, con búsqueda web y la Biblioteca
  de anuncios de Meta (pública).

## 3. Reglas de trabajo en redes

- Los posts que arma Claude van a Metricool siempre como borrador (`draft: true`).
  Programar en firme o publicar lo hace Tomás.

- **Nada se publica sin el OK de Tomás.** Claude deja borradores o publicaciones
  programadas para revisar; publicar o programar en firme lo decide Tomás.
- Misma voz que el blog (ver Anexo A de `docs/MIGRACION.md`).
- Cada nota nueva del blog puede tener su post para Instagram y Facebook.

## 4. Estado actual

- [x] Relevamiento de conexiones (5/11/2026).
- [x] Tomás creó la cuenta de Metricool y agregó el conector en Claude (5/11/2026).
  Marca de Metricool: `blogId` 7908067. Vincular redes:
  https://app.metricool.com/brands/connections?blogId=7908067
- [x] Código de medición web de Metricool (JavaScript tag, hash `3617cc31…`) instalado
  en puestodepalta.com el 5/11/2026: va en el `<head>` del inicio, del listado del blog y
  de cada nota (constante `METRICOOL_TRACKER` en `src/lib/site.ts`). Las páginas 404 no
  lo llevan. Las visitas aparecen en Metricool → sección Web.
- [x] Instagram (@puestodepalta), Facebook y TikTok vinculados en Metricool
  (5/11/2026). El historial tarda unas horas en cargar.
- [ ] Cargar 5 competidores de Instagram en Metricool (plan gratis: 5 por red, no se
  pueden cambiar después). Al 5/11 22:30 UTC ya aparecían @paltasagrada (57.363
  seguidores) y @lapalteria10 (55.551; 11 Reels y 1 post en 30 días).
- [ ] Diagnóstico de las últimas publicaciones (esperando que Metricool cargue).
- [x] **Documento principal: "Plan de redes — Puesto de Palta"**
  (https://claude.ai/artifact/2uUFoTooRGhhWfVuKPpnSP), con tres pestañas: Análisis,
  Acción y Creación. Reemplaza al primero, "Competencia en redes y guiones".
- [x] Lote 1 creado (5/11/2026): carrusel de 6 imágenes "La palta dejó de tener
  temporada" (nota Supply sin fin) + texto del post, en la carpeta del proyecto
  `redes/lote-1-temporada/`. Hecho en HTML con las fotos de la galería de Cloudinary y
  las fuentes del sitio, renderizado con Chromium a 1080x1350. Con OK de Tomás
  (5/11/2026) quedó como **borrador** en Metricool (post 418326829, uuid
  6454583438595015730) para Instagram y Facebook, sábado 7/11/2026 20:00 ART. Tomás lo
  confirma con "Planificar". Imágenes en Cloudinary, carpeta
  `puesto-de-palta/redes/lote-1-temporada/` (preset sin firma). Para Instagram se pasan
  como JPG con `f_jpg,q_92` en la URL, porque Instagram no acepta PNG.
- [ ] Rutina semanal de publicaciones (propuesta en la pestaña Acción).

## 5. Contexto que dio Tomás (5/11/2026)

- Tiene una CM que maneja las redes y están bastante activas. Este trabajo es para
  sumarle contenido, no para reemplazarla.
- Las notas del blog salen cada dos semanas y las genera `/nota-semanal`. Desde redes
  se convierten en posts.
- Quiere guiones para grabar él mismo en off.
- Competencia que nombró: Palta Sagrada (@paltasagrada, mayorista en Vicente López),
  La Bella Palta (@labellapalta, distribuidora mayorista), La Paltería
  (**@lapalteria10**, distribuidora de paltas en Castelar, unos 55.000 seguidores según Tomás: el
  competidor más directo; ojo, @lapalteria_ es otro negocio) y las distribuidoras de
  fruta fresca en general.
- Lección: Instagram no se puede mirar sin iniciar sesión desde el entorno de Claude, y
  la búsqueda web no siempre encuentra la cuenta por el nombre. Pedirle a Tomás el
  usuario exacto de cada cuenta antes de analizarla.
