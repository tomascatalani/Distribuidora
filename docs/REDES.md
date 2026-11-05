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

- **Nada se publica sin el OK de Tomás.** Claude deja borradores o publicaciones
  programadas para revisar; publicar o programar en firme lo decide Tomás.
- Misma voz que el blog (ver Anexo A de `docs/MIGRACION.md`).
- Cada nota nueva del blog puede tener su post para Instagram y Facebook.

## 4. Estado actual

- [x] Relevamiento de conexiones (5/11/2026).
- [ ] Tomás crea la cuenta de Metricool, vincula Instagram y Facebook, y agrega el
  conector de Metricool en Claude.
- [ ] Diagnóstico de las últimas publicaciones (necesita Metricool).
- [ ] Estudio de competencia.
- [ ] Rutina semanal de publicaciones.
