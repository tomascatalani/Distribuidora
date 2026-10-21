# Migración de puestodepalta.com fuera de Genspark

Documento de referencia. Contiene todo lo relevado en la sesión inicial: cómo está
armada la web, qué hacía Genspark, la configuración literal del workflow de contenido
y el plan de migración. **No contiene claves ni contraseñas.** Las claves se cargan
como variables de entorno en Cloudflare y en el entorno de Claude Code.

Relevamiento: 23 de septiembre de 2026. Última actualización: 20 de octubre de 2026.

---

## 1. Cómo está armada la web hoy

- **Tecnología:** aplicación Hono (framework web liviano) en TypeScript, empaquetada
  con Vite, desplegada en **Cloudflare Pages** (proyecto `puesto-de-palta`).
- **Repo:** `tomascatalani/Distribuidora` en GitHub. Rama principal: `main`.
- **Hosting y dominio:** el sitio ya corre en Cloudflare Pages. El DNS de
  puestodepalta.com resuelve a Cloudflare. Genspark NO alojaba la web: solo editaba el
  código en su sandbox y lo desplegaba con `npm run deploy`. **No hace falta cambio de DNS.**
- **Sin base de datos propia.** Cada visita a `/blog` o a una nota consulta la API de
  Notion en tiempo real y arma el HTML.

### Estructura del código

| Ruta en el repo | Qué es |
|---|---|
| `src/index.tsx` | Entrada. Conecta rutas y contiene el endpoint `/api/cron`. |
| `src/routes/home.ts`, `blog.ts` | Páginas home, listado del blog y nota individual. |
| `src/routes/api-blog.ts` | Lee Notion y convierte bloques a HTML. |
| `src/routes/api-subscribe.ts` | Alta en Brevo lista 2 + mail de bienvenida. |
| `src/routes/api-contact.ts` | Formulario de contacto → mail a tomascatalani@gmail.com. |
| `src/routes/api-notify.ts` | Push OneSignal + campaña Brevo por nota nueva. |
| `src/templates/*.ts` | HTML completo de cada página, con CSS incluido. |
| `public/` | Favicons, worker de OneSignal, `_routes.json`. `style.css` está vacío. |
| `wrangler.jsonc` | Config de Cloudflare Pages y KV `NOTIFIED_ARTICLES`. |
| `ecosystem.config.cjs` | Resto del sandbox de Genspark (PM2). Se puede borrar. |

### Mapa de rutas

| Ruta | Método | Qué hace |
|---|---|---|
| `/` | GET | Home |
| `/blog` | GET | Listado de notas (consulta Notion) |
| `/blog/:slug` | GET | Nota individual (consulta Notion) |
| `/api/blog` | GET | JSON con notas publicadas |
| `/api/blog/:slug` | GET | JSON con una nota completa |
| `/api/subscribe` | POST | Alta en Brevo lista 2 + bienvenida |
| `/api/contact` | POST | Mail de contacto |
| `/api/notify` | POST | Campaña Brevo + push OneSignal para una nota |
| `/api/cron` | GET | Endpoint que llama cron-job.org (con secreto) |

### Servicios externos

| Servicio | Rol | Datos públicos |
|---|---|---|
| Notion | CMS del blog | Base de datos ID `3233fd35-c857-8076-8608-f97f0cbf9873`. Propiedades: Title (title), Slug (text), Fecha (date), Publicar (checkbox), Imagen (url), Excerpt (text, opcional). |
| Notion | Guía de voz y estilo | Página ID `3243fd35c857805ea524c1aedcc9f022`. |
| Brevo | Emails | Lista ID 2 "Your first list" (165 contactos al 20/10/2026). Remitente ID 2 "Blog Paltero" / "Puesto de Palta Blog", contacto@puestodepalta.com. Plan gratuito: 300 mails/día. |
| OneSignal | Push en navegador | App ID `f79c1b7e-b2fc-4f3f-a7eb-fb0ba3dec26e`. |
| Cloudflare KV | Memoria de notas ya notificadas | Namespace `c3392b7e9a07445eac9bb73d9ea24ac7`. Claves `notified:{pageId}`. 12 claves al 23/09/2026. |
| Cloudinary | Imágenes y videos | Cloud `dxlunrd1f`. Carpeta `puesto-de-palta` (logos, galeria, testimonios). Upload preset unsigned `blog-puesto-de-palta` para portadas del blog. |
| cron-job.org | Dispara `/api/cron` cada 5 minutos | URL con `?secret=` en la query. |

### Variables de entorno en Cloudflare Pages (solo nombres)

`NOTION_TOKEN`, `NOTION_DB_ID`, `BREVO_API_KEY`, `ONESIGNAL_APP_ID`,
`ONESIGNAL_API_KEY`, `CRON_SECRET`, `CF_API_TOKEN`, `CF_KV_NAMESPACE`.

### Formularios y captura

- 4 formularios de suscripción por email (hero, sección Suscripción, listado del blog,
  dentro de cada nota) → `/api/subscribe`.
- 1 formulario de contacto (nombre, email, teléfono, mensaje) → `/api/contact`.
- 1 botón de notificaciones push → OneSignal.

### Cómo se publica una nota

1. La nota existe en Notion con Slug, Fecha e Imagen cargados.
2. Se tilda **Publicar**. Aparece en la web en el próximo request.
3. cron-job.org llama a `/api/cron` cada 5 minutos. Por cada nota publicada que no
   esté en el KV: manda push por OneSignal, crea y envía campaña por Brevo a la lista 2,
   y graba `notified:{pageId}` en el KV.
4. Si se destilda Publicar, la nota desaparece. Si se vuelve a tildar, no se notifica
   otra vez (el KV ya la tiene).

### Problemas detectados en el código original (estado al 20/10/2026)

1. ~~Secreto del cron escrito en el código.~~ **Resuelto en la etapa 2:** se lee de
   `CRON_SECRET`. Si la variable falta, `/api/cron` responde 503.
2. ~~`/api/notify` sin protección.~~ **Resuelto:** exige el mismo secreto
   (header `x-cron-secret` o `?secret=`).
3. ~~KV se marca antes de confirmar el envío.~~ **Resuelto:** se marca solo si la
   campaña de Brevo salió. Si falla, reintenta en las corridas siguientes reusando la
   campaña ya creada, hasta 3 veces, y después manda un mail de alerta a
   `ALERT_EMAIL` (por defecto tomascatalani@gmail.com). Para destrabar a mano: borrar
   la clave `pending:<pageId>` del KV.
4. ~~ID de Notion duplicado.~~ **Resuelto:** toda la lógica de Notion está en
   `src/lib/notion.ts`.
5. ~~`og-image.jpg` no existe.~~ **Resuelto:** `src/lib/site.ts` apunta a la foto de
   Cloudinary elegida por Tomás, recortada a 1200x630.
6. ~~No hay publicación por fecha.~~ **Resuelto:** una nota se muestra cuando Publicar
   está tildado Y (no tiene Fecha, o la Fecha ya llegó). Las notas con fecha salen a
   las **9:00 de Argentina** de ese día (constante `PUBLISH_HOUR_ARG` en
   `src/lib/notion.ts`), y el aviso a suscriptores sale en los 5 minutos siguientes.
   Reglas: tilde sin fecha → al instante; tilde con fecha pasada o de hoy (después de
   las 9) → al instante; tilde con fecha futura → ese día a las 9; sin tilde → nunca.
7. Sin límite de intentos ni anti-spam en formularios. Pendiente, baja prioridad.

Además en la etapa 2: `NOTIFY_ENABLED` (si no es `"true"`, el cron solo simula y no
manda ni graba nada; así el proyecto de prueba nunca spamea), `?dry=1` para forzar
simulación, escape de HTML del contenido de Notion, proyecto de Pages renombrado a
`puesto-de-palta-web`, `ecosystem.config.cjs` eliminado, `npm run typecheck`.

---

## 2. Qué hacía Genspark

Genspark cumplía dos roles, ninguno de hosting:

1. **Sandbox de edición y despliegue del código** hacia Cloudflare Pages.
2. **Workflow semanal de generación de contenido**, que termina en un borrador en Notion
   y un mail de aviso. No publica, no manda newsletter, no difunde en redes.

Confirmado por Genspark: **no existe ningún paso de redes sociales.** Si se hace
difusión, es manual.

---

## 3. Configuración literal del workflow de contenido (exportada de Genspark)

### Paso 1. Disparador

- Tipo: semanal. Día: lunes. Hora: 09:00. Zona horaria: America/Buenos_Aires.

### Paso 2. Investigación

- Máximo **4 búsquedas web** por corrida.
- Antigüedad máxima de fuentes: **90 días**. Priorizar últimos 30 días; si no hay
  material original, ampliar a 31-90 días; nunca más de 90.
- **Áreas temáticas, en orden:**
  1. Crecimiento nacional (PRIORIDAD): expansión del cultivo de palta en Argentina,
     nuevas hectáreas, inversiones en aceite de palta y derivados a nivel país, marcas
     argentinas de aceite de palta, exportaciones nacionales, políticas agrícolas
     locales, emprendimientos argentinos con palta.
  2. Ciencia e innovación: bioplásticos del carozo, aceites, compuestos bioactivos,
     estudios clínicos.
  3. Ecología: cultivos que destruyen ecosistemas, metales pesados en Perú, uso del
     agua, monocultivos.
  4. Industria y economía: producción mundial, nuevos mercados, exportaciones, cambios
     en la cadena de valor.
  5. Derivados: productos derivados, beneficios, innovaciones, usos, cultura.
  6. Historia y cultura: palta en culturas precolombinas, nombres y significados,
     gastronomía histórica.
  7. Tendencias globales: consumo per cápita por país, platos nuevos, usos cosméticos,
     palta y mascotas.
  8. Investigación de frontera: nuevos usos industriales, veterinaria, polvo de palta,
     colorantes naturales.
- **Línea editorial pro-palta:** el fruto nunca queda mal parado. Temas crudos sobre la
  cadena, permitidos. Ángulos anti-fruto ("la palta no es sana"), prohibidos.
- **Lista negra de tópicos ya cubiertos** (prioridad absoluta, se descartan aunque haya
  fuentes nuevas):
  - Carozo/semilla de palta como colorante o tinte
  - Aguacates resistentes al frío en Florida / Universidad de Florida / José Chaparro
  - Conservación de palta en el mar / transporte marítimo prolongado
  - China como productor y no solo comprador de palta
  - Lo que la comunidad tira al agua puede salvar el agua
- **Anti-repetición contra Notion** (base `3233fd35-c857-8076-8608-f97f0cbf9873`):
  compara (a) títulos de todas las páginas, publicadas y borradores; (b) URLs de fuentes
  de los últimos 5 artículos; (c) tema central, semántico y no solo literal. Mismo
  tópico = descarte automático.
- **Plan B (solo si no hay nada fresco en 90 días):**
  1. Recetas extrañas con palta: atípicas o contraintuitivas con palta como ingrediente
     central. No guacamole ni tostadas. Postres, fermentados, bebidas, cocina molecular,
     platos de países lejanos. Contarla como historia: origen, quién la inventó, por qué
     funciona. Tono editorial, no recetario.
  2. Datos nutricionales con profundidad: no "la palta tiene vitamina E". Sí contexto
     científico real, comparaciones inesperadas, estudios específicos (composición
     lipídica, fitoesteroles, perfil por variedad Hass vs Fuerte vs Bacon). Citar papers
     con precisión.
- **Resultado:** tema seleccionado con justificación y lista de temas descartados con
  motivo. Estructura de referencia:

```json
{
  "titulo_fuente": "string",
  "url": "string",
  "fecha_publicacion": "YYYY-MM-DD",
  "resumen_hallazgo": "string",
  "tema_seleccionado": { "tema": "string", "justificacion": "string", "es_evergreen": false },
  "temas_descartados": [ { "tema": "string", "motivo": "string" } ]
}
```

### Paso 3. Redacción

- Idioma: español rioplatense.
- **Guía de voz:** se lee desde la página de Notion `3243fd35c857805ea524c1aedcc9f022`.
  Copia de referencia al final de este documento (Anexo A).
- **Estructura obligatoria:** título breve sin clickbait, sin exclamaciones, sin
  listas numeradas. Apertura con imagen concreta, dato extraño, anécdota o pregunta;
  nunca una definición ni "En este artículo vamos a ver". Desarrollo de lo particular a
  lo amplio (dato → contexto → implicancia). Cierre abierto.
- **Tono:** directo, curioso, sobrio. Sin emojis, exclamaciones ni hipérboles. No
  mencionar Puesto de Palta. Sin llamado a la acción ni lenguaje de marketing.
- **Extensión:** 400 a 700 palabras. Nunca más de 900. Alternar oraciones cortas
  (impacto) con largas (análisis).
- **Slug:** título en minúsculas, sin tildes, palabras separadas por guiones.
  Ejemplo: "El carozo que no es basura" → `el-carozo-que-no-es-basura`.
- **Resultado:** `titulo`, `slug`, `contenido_markdown`, `fuentes_usadas`
  (array de `{titulo, url, fecha}`).
- Modelo y parámetros: no especificados en Genspark.

### Paso 4. Imagen de portada y Cloudinary

- Generar con IA. Prompt **en inglés**, adaptado al tema del artículo. Formato
  horizontal 16:9, aproximadamente 1792x1024.
- **Paleta** (basada en el isologotipo): verde Puesto de Palta `#3D8B27` (principal),
  negro profundo `#0a0a0a`, blanco puro `#FFFFFF`, madera/roble `#8B6914`, crema
  `#faf8f4`.
- **Estilo:** editorial, artesanal, sobrio. Fotografía de producto o natural. Sin
  oversaturación. Composición limpia con espacio negativo. Que evoque el tema de forma
  visual, no literal. Sin texto superpuesto. Sin logos ni marcas.
- Prompts orientativos:
  - "Close-up of an avocado pit on dark wood, dramatic side lighting, editorial style, deep blacks and earthy greens"
  - "Avocado tree roots seen from below, looking upward, chiaroscuro, artisanal photography feel"
  - "Avocado cross-section macro shot on slate background, minimal composition, rich textures"
- **Subida a Cloudinary:** POST a `https://api.cloudinary.com/v1_1/dxlunrd1f/image/upload`
  con `file` (imagen), `upload_preset=blog-puesto-de-palta` (unsigned, sin clave) y
  `public_id=<slug>`. Carpeta: la que defina el preset. Sin transformaciones extra. Se
  guarda la `secure_url`.
- En Genspark la imagen la generaba su herramienta nativa. Fuera de Genspark hace falta
  un proveedor externo (ver sección 5).

### Paso 5. Borrador en Notion

- Base: `3233fd35-c857-8076-8608-f97f0cbf9873`.
- Propiedades: `Title` (title) = título; `Slug` (text) = slug; `Fecha` (date) = fecha
  de ejecución YYYY-MM-DD; `Publicar` (checkbox) = false; `Imagen` (url) = secure_url
  de Cloudinary.
- Cuerpo: cada párrafo como bloque `paragraph`. Fuentes al final, también como
  párrafos. Sin headings ni listas. Prohibido escribir en el cuerpo slug, fecha, URL
  de imagen o estado de publicación.

### Paso 6. Aviso por Brevo

- Endpoint transaccional `POST https://api.brevo.com/v3/smtp/email`.
- Remitente: "Puesto de Palta Blog" <contacto@puestodepalta.com>.
- Destinatario: tomascatalani@gmail.com.
- Asunto: `Nuevo borrador listo para revisar: [TÍTULO]`.
- Cuerpo:

```
Hay un nuevo borrador en Notion.

Título: [TÍTULO]
Slug: [SLUG]
Fecha: [FECHA]
Imagen: [URL CLOUDINARY]

Revisalo, editá si hace falta, y activá Publicar cuando estés listo.

Notión: https://www.notion.so
```

  Mejora prevista: el link apunta a la página exacta del borrador.

### Variables que usaba el workflow (solo nombres)

`var_brevo_api_key`, `var_cloudinary_cloud_name`, `var_cloudinary_upload_preset`,
`var_notion_blog_db_id`, `var_notion_style_guide_id`, token OAuth de Notion (nativo).

---

## 4. Arquitectura nueva

- **Web:** Cloudflare Pages, proyecto `puesto-de-palta-web`, conectado a GitHub.
  Cada push a `main` despliega el sitio real; cada push a otra rama genera una URL de
  vista previa `<rama>.puesto-de-palta-web.pages.dev`. (Hecho el 20/10/2026.)
- **Contenido:** un comando dentro del repo que Claude Code ejecuta y que reproduce los
  pasos 2 a 6. Se puede correr a mano ("generá la nota de la semana") o programado como
  Rutina de Claude Code en la web (lunes 9:00). Corre con la suscripción Max, sin API de
  Anthropic.
- **Imagen:** único paso que necesita proveedor externo. Recomendado: Google Gemini
  (modelo de imagen), con capa gratuita y ~USD 0,04 por imagen. Alternativas: Replicate
  (Flux) u OpenAI.
- **Avisos a suscriptores:** siguen igual (cron-job.org → `/api/cron`), con las
  correcciones de la sección 1. Opción futura: cron nativo de Cloudflare.
- **Difusión en redes:** no existía. Queda manual; Claude puede dejar el texto listo.

### Costos aproximados

| Servicio | Costo |
|---|---|
| Cloudflare Pages + KV | Gratis |
| GitHub | Gratis |
| Notion | Gratis |
| Cloudinary | Gratis (plan actual) |
| Brevo | Gratis hasta 300 mails/día (165 contactos hoy) |
| OneSignal | Gratis |
| cron-job.org | Gratis |
| Generación de imágenes | USD 0,5 a 3 por mes |
| Anthropic API | No se usa |

### Claves y dónde van

| Variable | Cloudflare Pages | Entorno Claude Code |
|---|---|---|
| `NOTION_TOKEN` | Sí | Sí |
| `NOTION_DB_ID` | Sí | Sí |
| `NOTION_STYLE_GUIDE_ID` | No | Sí |
| `BREVO_API_KEY` | Sí | Sí |
| `ONESIGNAL_APP_ID` | Sí | No |
| `ONESIGNAL_API_KEY` | Sí | No |
| `CRON_SECRET` | Sí | No |
| `NOTIFY_ENABLED` (`true` SOLO en producción) | Sí | No |
| `ALERT_EMAIL` (opcional) | Sí | No |
| `CLOUDINARY_CLOUD_NAME` | No | Sí |
| `CLOUDINARY_UPLOAD_PRESET` | No | Sí |
| `GEMINI_API_KEY` (opcional, requiere facturación) | No | Sí |
| `CF_AI_TOKEN` (token con plantilla Workers AI) | No | Sí |

Dominios que el entorno de Claude Code debe poder alcanzar para correr el comando de
contenido: `api.notion.com`, `api.cloudinary.com`, `res.cloudinary.com`,
`api.brevo.com`, `generativelanguage.googleapis.com` (o el proveedor elegido) y la
búsqueda web.

---

## 5. Plan de migración por etapas

1. **Inventario y accesos.** Confirmar propiedad de Cloudflare, cron-job.org,
   Cloudinary, Brevo, OneSignal y DNS. Rotar claves. Compartir la integración de Notion
   con la base del blog y con la página de la guía de voz.
2. **Repo como fuente de verdad.** Documentación en el repo. Corregir: secreto del cron
   desde variable, proteger `/api/notify`, KV solo tras envío exitoso, publicación por
   fecha, borrar restos de Genspark, agregar `og-image.jpg`. Crear proyecto Pages de
   prueba conectado a GitHub, con URL `*.pages.dev`, mismas variables y KV separado.
   Cron apagado en el proyecto de prueba.
3. **Pruebas en la URL de prueba.** Blog, formularios, suscripción, contacto, push.
4. **Comando de contenido.** Reproducir pasos 2 a 6. Primera corrida a mano con un
   borrador de prueba (Publicar en falso).
5. **Automatizar.** Rutina semanal. Actualizar cron-job.org con el secreto nuevo.
6. **Cambio final.** Conectar el proyecto Pages de producción a GitHub (o mover el
   dominio personalizado al proyecto nuevo desde el panel). Sin DNS. Cancelar Genspark.

---

## 8. Guía: crear el proyecto de Cloudflare Pages conectado a GitHub

Se hace una sola vez, después de que el PR esté mergeado en `main`. El sitio actual
(proyecto `puesto-de-palta`) no se toca hasta la etapa final.

1. Entrá a https://dash.cloudflare.com → menú izquierdo **Workers & Pages** →
   botón **Create** → pestaña **Pages** → **Import an existing Git repository**
   (o "Connect to Git").
2. Elegí **GitHub**. Si te pide autorizar, aceptá e instalá la app de Cloudflare
   Pages dándole acceso al repo **tomascatalani/Distribuidora** (puede ser solo a ese
   repo). Volvés a Cloudflare y seleccionás el repo → **Begin setup**.
3. Completá:
   - **Project name:** `puesto-de-palta-web` (exactamente así; tiene que coincidir
     con `wrangler.jsonc`).
   - **Production branch:** `main`.
   - **Framework preset:** None.
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Abrí **Environment variables (advanced)** y agregá, para **Production** y también
   para **Preview** (hay un selector), estas seis como tipo Secret / encrypted:
   `NOTION_TOKEN`, `NOTION_DB_ID`, `BREVO_API_KEY`, `ONESIGNAL_APP_ID`,
   `ONESIGNAL_API_KEY`, `CRON_SECRET` (el que empieza con `4K0_`).
   **NO agregar `NOTIFY_ENABLED`** todavía: así el proyecto nuevo nunca manda avisos
   reales. Se agrega recién en la etapa final.
   Si el asistente no deja cargar variables antes del primer deploy, no importa: se
   cargan después en Settings → Variables and secrets y se vuelve a desplegar con
   **Retry deployment**.
5. **Save and Deploy.** Esperá 1 o 2 minutos. Tiene que terminar en verde y mostrar la
   URL `https://puesto-de-palta-web.pages.dev`.
6. El binding del KV `NOTIFIED_ARTICLES` lo toma solo de `wrangler.jsonc`. Verificá en
   Settings → Bindings que aparezca. Si no, agregalo a mano: KV namespace, nombre
   `NOTIFIED_ARTICLES`, namespace `NOTIFIED_ARTICLES` (el existente).
7. Avisale a Claude la URL. Claude corre las pruebas de la etapa 3 contra esa URL.

A partir de ahí, cada push a `main` despliega solo. Cada push a otra rama genera una
URL de vista previa (`<rama>.puesto-de-palta-web.pages.dev`) con las variables de
Preview.

### Etapa final (cuando la etapa 3 esté verde)

1. En el proyecto nuevo: Settings → Variables and secrets → agregar
   `NOTIFY_ENABLED` = `true` en **Production** → Retry deployment.
2. En el proyecto nuevo: **Custom domains** → **Set up a custom domain** →
   `puestodepalta.com`. Cloudflare avisa que el dominio está en otro proyecto; hay que
   sacarlo primero: proyecto viejo `puesto-de-palta` → Custom domains → `...` →
   Remove. Después agregarlo en el nuevo. Repetir con `www.puestodepalta.com` si
   Cloudflare no lo agrega solo. El corte dura segundos.
3. En cron-job.org: editar el job y cambiar la URL a
   `https://puestodepalta.com/api/cron?secret=<CRON_SECRET nuevo>`. Guardar. Ver en
   el historial que la siguiente corrida responda 200 con `"mode":"real"`.
4. Probar: `https://puestodepalta.com/api/cron?secret=<CRON_SECRET>&dry=1` tiene que
   listar las 15 notas como "ya notificada".
5. Cancelar Genspark. Desconectar la conexión "Genspark" de Notion. Opcional: borrar
   el proyecto viejo `puesto-de-palta` después de unos días.

---

## 9. Etapa 4: el comando de contenido (`/nota-semanal`)

Reemplaza el workflow de Genspark (sección 3). Vive en el repo:

| Archivo | Qué hace |
|---|---|
| `.claude/skills/nota-semanal/SKILL.md` | El comando. Claude lo sigue paso a paso: contexto → investigación (hasta 4 búsquedas web) → redacción → portada → borrador en Notion → mail → informe. Tiene la configuración editorial literal (áreas, lista negra, plan B, reglas de voz). |
| `scripts/contenido/lib.mjs` | Utilidades: variables de entorno (o `.dev.vars`), cliente de Notion, slug, fecha argentina. |
| `scripts/contenido/1-contexto.mjs` | Lee de Notion la guía de voz, todos los títulos y las URLs de fuentes de los últimos 5 artículos → `.contenido/contexto.json`. |
| `scripts/contenido/3-imagen.mjs` | Genera la portada con Cloudflare Workers AI (`@cf/leonardo/phoenix-1.0`, 1792x1024, prompt fotográfico + negative prompt) y la sube a Cloudinary con el preset unsigned, `public_id` = slug. Imprime la URL. |
| `scripts/contenido/4-notion-borrador.mjs` | Crea la página en Notion: Title, Slug, Fecha, Publicar en falso, Imagen; cuerpo en párrafos (negrita y cursiva soportadas) y fuentes al final. Avisa si el largo sale de 400-700. |
| `scripts/contenido/5-avisar.mjs` | Mail transaccional por Brevo a `ALERT_EMAIL` (tomascatalani@gmail.com) con título, slug, fecha, imagen y link directo a la página de Notion. |

La investigación (búsqueda web) y la redacción las hace Claude en la sesión, no un
script: así no hace falta API de Anthropic.

**Cómo se usa.** En una sesión de Claude Code sobre este repo: `/nota-semanal`, o
"generá la nota de la semana", o "escribí una nota sobre X" (modo manual). Los
scripts se corren desde la raíz con `NODE_USE_ENV_PROXY=1` (necesario en el entorno
web de Claude Code). Archivos intermedios en `.contenido/` (ignorado por git).

**Variables que necesita** (entorno de Claude Code): `NOTION_TOKEN`, `NOTION_DB_ID`,
`NOTION_STYLE_GUIDE_ID`, `BREVO_API_KEY`, `CF_AI_TOKEN`, `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_UPLOAD_PRESET`, opcional `ALERT_EMAIL` e `IMAGE_MODEL`.

**Límites conocidos.** Workers AI gratis: 10.000 neuronas/día ≈ 4 portadas. Brevo:
300 mails/día. Notion: 100 bloques por llamada (el script pagina).

---

## Anexo A. Guía de voz y estilo (copia de referencia; la fuente es la página de Notion)

### Identidad de la voz

El autor es Tomás Catalani Massouh. Argentino, rioplatense, 28 años. Su escritura es
cruda, honesta y profunda. No teme a la oscuridad ni a la contradicción. No busca
gustar. Busca resonar. La voz no es neutral. Tiene temperatura, tiene peso, tiene
historia detrás. Nunca suena a marketing. Nunca suena a nota de prensa. Nunca suena a
Wikipedia.

### Tono y postura

- Directo y sin adornos innecesarios.
- Curioso, no experto omnisciente. Investiga y comparte lo que le asombra.
- Sobrio. No exclama. No usa emojis en el cuerpo del texto.
- Nunca condescendiente. Habla de igual a igual.
- Deja espacio para que el lector piense. No cierra todo.
- No tiene llamados a la acción. No vende. Informa y provoca pensamiento.
- Cuando algo es raro, interesante o paradójico, lo dice así: "Esto es raro." "Acá hay algo."

### Estructura de cada artículo

1. Apertura concreta: una imagen, una anécdota pequeña, un dato extraño, una pregunta
   sin respuesta fácil. Nunca una definición. Nunca "En este artículo vamos a ver...".
2. Desarrollo que escala: de lo concreto hacia lo más amplio. Un hallazgo → su contexto
   histórico → su implicancia actual → lo que dice de nosotros.
3. Cierre abierto: no resuelve todo. Deja una idea flotando. A veces una pregunta
   retórica. A veces una imagen final que sintetiza sin explicar.
4. Sin subtítulos rígidos cuando el texto fluye. Puede usarlos si el artículo es más
   técnico o largo.
5. Extensión: entre 400 y 700 palabras. Nunca más de 900. Sensación de "2 carillas".

### Vocabulario y léxico

Usar naturalmente: palabras simples y directas; términos técnicos solo cuando agregan
exactitud real; argot rioplatense cuando surge solo, no forzado ("laburo", "piba",
"quilombo", "de yapa"); palabras con densidad simbólica cuando el tema lo pide
("ritual", "umbral", "presencia", "tiempo", "cuidado"). Evitar lenguaje neutro que no
dice nada.

### Ritmo de las oraciones

Alternar frases cortas que golpean con oraciones largas que se despliegan. Ejemplo:
"El carozo de palta pesa nada. Pero dentro hay un polímero que puede reemplazar al
plástico de petróleo. Lo estamos tirando a la basura desde hace décadas." Usar puntos
seguidos como herramienta rítmica. Las oraciones largas cargan el análisis. Las cortas
cargan la emoción o el impacto.

### Estructura narrativa (movimiento central)

Lo pequeño y concreto primero (un carozo, una planta, un número, un año) → lo más
amplio después (la cultura, la industria, el planeta, la historia) → lo que eso dice
sobre nosotros al final (implícito, nunca sermoneado).

### Lo que este blog no es

No es recetario. No es nota de prensa de empresa. No es artículo de salud genérico. No
es campaña de marketing de Puesto de Palta. No menciona a Puesto de Palta dentro del
artículo.

### Temática

Ciencia, industria, cultura, ecología, innovación, sociedad, siempre dentro del
universo de la palta. El artículo ideal toma UN ángulo específico y lo profundiza.

### Ejemplos de título

Bien: "El carozo que no es basura", "Por qué Perú tiene un problema con sus paltas",
"Antes de que la llamen superfood, ya era sagrada", "Lo que le pasa a un aguacate
cuando lo toca una mano que sabe", "El aceite que no te contaron".

Mal: "5 beneficios increíbles de la palta para tu salud", "Todo lo que necesitás saber
sobre el aguacate", "¡La palta es tendencia mundial!".

### Frases representativas del tono

- "Este espacio nace de una búsqueda que no es liviana ni decorativa."
- "No como consigna superficial, sino como acto radical."
- "De ese barro sale la luz que perdura, no luz de ilusión barata."
- "La palabra solo como letra muerta, cerrada y literal. El poder está en abrirla."
- "No era deseo cualquiera. Era deseo de límite. De tocar el borde."
- "Todo se entrelazaba en un alma que crecía al borde del desborde."

### Instrucción final

Antes de escribir, releer esta guía completa. El artículo debe poder confundirse con
algo que Tomás escribió un martes a las 11 de la noche, con mate, después de leer algo
que le voló la cabeza. No debe sonar a IA, ni a resumen, ni a nota escolar. Debe sonar
a una persona que encontró algo interesante y lo quiere compartir sin venderle nada a
nadie.

---

## 6. Estado actual y próximos pasos (actualizar en cada sesión)

### Hecho

- [x] Relevamiento completo del repo y del workflow de Genspark (sesión del 23/09/2026).
- [x] Este documento guardado en el repo (20/10/2026).
- [x] `CLAUDE.md` en la raíz para que toda sesión nueva lea este documento primero.
- [x] Red del entorno de Claude Code en **Full** (20/10/2026).
- [x] Claves verificadas en vivo el 20/10/2026: Notion, OneSignal y Cloudflare responden
  bien. Brevo responde pero bloquea por IP (ver checklist, punto F).
- [x] La integración "Puesto de Palta BLOG" ya tiene acceso a la guía de voz (verificado).
- [x] Brevo: rango de IP autorizado, 12/12 llamadas OK (20/10/2026).
- [x] Confirmaciones de DNS, custom domain, variables de Pages y cron-job.org (20/10/2026).
- [x] Imágenes: Cloudflare Workers AI con Phoenix 1.0, probado y subido a Cloudinary (20/10/2026).

### Datos verificados en vivo (20/10/2026)

- Base del blog en Notion: **26 páginas, 15 publicadas, 11 borradores**. La web muestra
  las mismas 15. Todas las portadas están en Cloudinary.
- Propiedades reales de la base: `Title` (title), `Slug` (rich_text), `Fecha` (date),
  `Publicar` (checkbox), `Imagen` (url), `Excerpt` (rich_text), y además
  **`Publicar PERSEA`** (checkbox) y **`Notificado PERSEA`** (checkbox). Estas dos
  últimas no las usa el código del sitio. Tomás pidió ignorarlas (ver punto G).
- Hay 6 borradores con `Fecha` futura (noviembre y diciembre de 2026) y 4 sin fecha.
  Parece que Tomás deja notas listas y las publica a mano cuando llega la fecha. Esto
  confirma el valor de la publicación automática por fecha (etapa 2).
- Varios slugs tienen tildes (`el-árbol-...`, `la-hipocresía-...`, `el-número-...`).
  Funcionan, pero la regla dice sin tildes. Una nota publicada ("Cuando hay demasiada
  palta") no tiene slug y usa el ID de página como URL. Corregir en Notion cuando se pueda.
- OneSignal: app "Puesto de Palta", **1 solo suscriptor push**. El canal que importa es
  el email.
- Cloudflare: cuenta `69cab80f6399b619326813da2ca872ef` ("Tomascatalani@gmail.com's
  Account"). El sitio responde con `server: cloudflare`.
- Brevo (verificado 20/10/2026 tras autorizar el rango `160.79.106.0/24`): plan
  **gratuito, 300 mails/día**. Lista 2 se llama "Your first list" y tiene **165
  contactos**. Remitentes activos: ID 1 "Puesto de Palta" e ID 2 "Puesto de Palta -
  Blog Paltero", ambos contacto@puestodepalta.com.

- [x] **Etapa 2 (código) hecha el 20/10/2026** en la rama
  `claude/intelligent-maxwell-99xw57`, commit `94a4d0d`. Probada en Node contra el
  Notion real: 15 notas visibles, slugs con tilde y nota sin slug OK, 404 OK, cron
  401/503/simulación OK, notify protegido. Nota: `wrangler pages dev` no funciona
  dentro del entorno de Claude Code (workerd no usa el proxy de red); probar con
  `node` importando `dist/_worker.js` (ver scratchpad de la sesión) o en Cloudflare.

- [x] PR #1 mergeado en `main` (20/10/2026, lo mergeó Claude con permiso de Tomás).
- [x] Proyecto **`puesto-de-palta-web`** creado en Cloudflare Pages conectado a GitHub
  (rama `main`, build `npm run build`, salida `dist`). URL:
  https://puesto-de-palta-web.pages.dev. Las variables habían quedado solo en
  Preview; Claude las cargó en Production por API con `CF_API_TOKEN` (que sí tiene
  permiso de Pages) y disparó un redeploy. KV `NOTIFIED_ARTICLES` vinculado en
  Production desde `wrangler.jsonc`.
- [x] **Etapa 3 (pruebas en la URL nueva) verde el 20/10/2026:** home, blog, favicons
  y worker de OneSignal 200; `/api/blog` devuelve las mismas 15 notas que el sitio
  actual; notas con tilde, nota sin slug y 404 OK; cron 401 sin secreto y con el
  secreto viejo; cron en simulación ve las 15 notas como "ya notificadas" (el KV es
  compartido, así que el corte no reenvía nada); `/api/notify` 401; formularios
  validan (400) sin enviar.
- Decisión de hora: **9:00 ahora; en diciembre de 2026 pasar a 19:00** (cambiar
  `PUBLISH_HOUR_ARG` en `src/lib/notion.ts`).

- [x] Tomás probó en la URL de prueba: bienvenida de Brevo y mail de contacto llegaron.
  El botón de push quedó en "Activando" en pages.dev, esperable: OneSignal solo acepta
  el dominio registrado (puestodepalta.com).
- [x] **ETAPA FINAL HECHA el 20/10/2026. puestodepalta.com ya corre en el proyecto
  nuevo `puesto-de-palta-web`, desplegado desde GitHub.**
  - `NOTIFY_ENABLED=true` cargado en Production **como Secret** (importante: las
    variables de texto plano del panel se borran en cada deploy porque
    `wrangler.jsonc` manda; las Secret se conservan).
  - Dominios `puestodepalta.com` y `www` movidos al proyecto nuevo (Active). Cloudflare
    actualizó solo los CNAME a `puesto-de-palta-web.pages.dev`. El proyecto viejo
    `puesto-de-palta` quedó sin dominios; se puede borrar después de unos días.
  - Cron en el dominio real: secreto viejo → 401; secreto nuevo → modo real, 15 notas
    ya notificadas, 0 enviadas, 0 fallidas.
  - Tomás cambió la URL del job en cron-job.org al secreto nuevo.
- Permiso de Tomás (20/10/2026): Claude puede subir cambios directo a `main`. Los
  cambios grandes se consultan antes. Cada push a `main` despliega el sitio real.

- [x] Push probado por Tomás en puestodepalta.com: funciona. cron-job.org con la URL
  nueva: 200 OK cada 5 minutos, `"mode":"real"`, todas "ya notificada".
- [x] **Etapa 4 preparada (20/10/2026):** scripts en `scripts/contenido/` y comando
  `/nota-semanal` en `.claude/skills/nota-semanal/SKILL.md` (ver sección 9). Probados
  contra cuentas reales: contexto de Notion (guía de voz + 26 títulos + fuentes),
  creación de borrador en Notion (archivado después), mail de aviso. La imagen se
  prueba cuando se libera la cuota diaria de Workers AI.

- [x] **Genspark cancelado el 20/10/2026** (la suscripción vence el 22/10/2026) y la
  conexión "Genspark" desconectada de Notion. Desde ese día no queda nada en Genspark.
- [x] Prueba de edición por chat (20/10/2026): rama `prueba-edicion` → vista previa
  `prueba-edicion.puesto-de-palta-web.pages.dev` → `main` → puestodepalta.com →
  revert. Un minuto por paso. (La rama remota no se pudo borrar desde la sesión: el
  acceso de Claude no permite borrar ramas; se borra a mano en GitHub si molesta.)
- [x] Primera corrida real de `/nota-semanal` (20/10/2026, en la misma sesión):
  investigación (4 búsquedas) y redacción OK. Nota "Trece pesos y un certificado"
  (619 palabras, con Excerpt). Portada pendiente por cuota de Workers AI; Tomás
  aprobó el texto.
- **Cuota de Workers AI:** NO se reinicia a las 00:00 UTC exactas. A las 00:01 UTC
  seguía agotada después de 4 imágenes generadas a las ~22:40 UTC del día anterior.
  Parece una ventana móvil de 24 h o un reinicio con retraso. Regla práctica: generar
  la portada a una hora fija (por ejemplo la rutina del lunes a las 9:00) y no hacer
  pruebas el mismo día. Si hace falta más margen, el plan Workers Paid de Cloudflare
  (USD 5/mes) saca el límite.

### Pendiente, en orden

1. **Cerrar la primera corrida:** portada de "Trece pesos y un certificado" (cuando la
   cuota lo permita), borrador en Notion y mail. Tomás le pone fecha y tilda Publicar.
   Verificar el ciclo completo: nota en la web, campaña en Brevo, push, KV.
2. **Etapa 5:** rutina programada (lunes 9:00 Argentina) en claude.ai/code → Routines,
   que corra `/nota-semanal` en este repo. Recién después de 2 o 3 corridas manuales OK.
3. Borrar el proyecto viejo `puesto-de-palta` en Cloudflare (opcional, después de unos días).
4. En diciembre de 2026: cambiar `PUBLISH_HOUR_ARG` a 19 en `src/lib/notion.ts`.
4. **Claude, etapa 4 (contenido):** comando de generación de notas que reproduce los
   pasos 2 a 6 de la sección 3. Primera corrida a mano con Publicar en falso.
5. **Claude, etapa 5:** Rutina semanal (lunes 9:00 Argentina) y actualización de
   cron-job.org con el secreto nuevo.
6. **Tomás:** conectar el proyecto Pages de producción a GitHub y cancelar Genspark.

### Decisiones tomadas

- La web se queda en Cloudflare Pages. No hay cambio de DNS.
- Primero se asegura la web (etapas 2 y 3, cortas y sin riesgo), después el
  contenido (etapa 4, la parte grande y la que realmente depende de Genspark).
- El contenido lo genera Claude Code con la suscripción Max. No se usa API de Anthropic.
- Las claves se usan solo desde variables de entorno. Nunca en el repo ni en este documento.
- Primera versión del comando de contenido: a mano. Programada recién después de
  revisar dos o tres borradores.

- **Proveedor de imágenes: Cloudflare Workers AI** (gratis), con Gemini como opción
  si Tomás activa facturación. Genspark usaba su herramienta nativa sin modelo fijo, así
  que no hay nada que replicar. El prompt se genera en cada corrida según el tema.
- **Integración de Notion:** la interna se llama **"Puesto de Palta BLOG"** y es la
  que usa la web (token `NOTION_TOKEN`). La conexión "Genspark" era la del workflow
  viejo y se puede desconectar cuando se cancele Genspark. La página de la guía de voz
  se llama **"ESTILO Y VOZ — TOMI"**. La base del blog se llama
  **"BLOG PUESTO DE PALTA / PERSEA"**.

### Decisiones abiertas

- Ninguna por ahora.

---

## 7. Checklist para Tomás antes de la próxima sesión

Todo esto se hace una sola vez. Los valores de las claves ya existen en las cuentas
(Notion, Brevo, OneSignal, Cloudflare) y en el panel de Cloudflare Pages.

### A. Variables en el entorno de Claude Code (obligatorio)

1. En claude.ai/code, con esta sesión abierta, hacé click en el nombre del entorno en
   la barra de título (arriba), y elegí **Edit**.
2. Buscá la sección **Environment variables**.
3. Agregá una por una, con estos nombres exactos y los valores que ya tenés:

   | Nombre | Valor |
   |---|---|
   | `NOTION_TOKEN` | el token de la integración de Notion (empieza con `ntn_`) |
   | `NOTION_DB_ID` | `3233fd35-c857-8076-8608-f97f0cbf9873` |
   | `NOTION_STYLE_GUIDE_ID` | `3243fd35c857805ea524c1aedcc9f022` |
   | `BREVO_API_KEY` | la API key de Brevo (empieza con `xkeysib-`) |
   | `ONESIGNAL_APP_ID` | `f79c1b7e-b2fc-4f3f-a7eb-fb0ba3dec26e` |
   | `ONESIGNAL_API_KEY` | la REST API key de OneSignal (empieza con `os_v2_`) |
   | `CF_API_TOKEN` | el token de API de Cloudflare (empieza con `cfut_`) |
   | `CLOUDINARY_CLOUD_NAME` | `dxlunrd1f` |
   | `CLOUDINARY_UPLOAD_PRESET` | `blog-puesto-de-palta` |
   | `CF_KV_NAMESPACE` | `c3392b7e9a07445eac9bb73d9ea24ac7` |
   | `GEMINI_API_KEY` | la clave creada en el paso D |

4. Guardá. Las sesiones nuevas las levantan solas; esta sesión no.

### B. Red del entorno (obligatorio)

1. En la misma pantalla de **Edit** del entorno, buscá **Network access**.
2. Elegí **Full**. (Hecho el 20/10/2026.)
3. Guardá.

### C. Compartir la guía de voz con la integración de Notion (obligatorio)

1. En Notion: Settings → **Connections** → pestaña **Connected** → al lado de
   **Puesto de Palta BLOG** apretá **Manage** → **Access** → agregá la página
   **ESTILO Y VOZ — TOMI** (la base "BLOG PUESTO DE PALTA / PERSEA" ya debería estar).
2. Camino alternativo: abrí la página "ESTILO Y VOZ — TOMI" → tres puntos arriba a la
   derecha → **Connections** → elegí **Puesto de Palta BLOG**.

### D. Proveedor de imágenes (resuelto el 20/10/2026)

**Decisión: Cloudflare Workers AI, modelo `@cf/leonardo/phoenix-1.0`**, 1792x1024
(16:9 nativo), gratis dentro de la cuenta. Probado con el token `CF_AI_TOKEN`
(plantilla "Workers AI"): los cuatro modelos funcionan; Phoenix dio la mejor calidad,
Lucid Origin es la segunda opción (más oscuro), Flux Schnell solo genera cuadrado,
SDXL es más flojo. Subida a Cloudinary con el preset unsigned verificada: quedó
`prueba-claude-borrar.jpg` en la raíz del cloud (borrarla a mano cuando se quiera).
Importante: el preset NO pone carpeta; las portadas caen en la raíz con el slug como
nombre, igual que hacía Genspark.

**Límite diario a tener en cuenta:** la capa gratuita de Workers AI son 10.000
neuronas por día (se reinicia a las 00:00 UTC). Cuatro imágenes de prueba a 1792x1024
la agotaron. Alcanza de sobra para una portada semanal, pero **no para probar muchas
variantes el mismo día**: en el comando de contenido, generar una sola imagen por
corrida y, si hay que regenerar, hacerlo al día siguiente o bajar a 1344x768.

**Feedback de Tomás (20/10/2026):** la primera prueba (palta abierta) le pareció
"de plástico o impresión 3D". Para la etapa 4 el prompt debe pedir foto documental,
luz natural de ventana, piel mate con imperfecciones, grano de película, lente 50mm
f2.8, y usar `negative_prompt` con "plastic, 3d render, cgi, glossy, oversaturated,
smooth, artificial". Preferir frutas enteras o escenas (tierra, madera, manos
trabajando) antes que cortes perfectos. Pendiente de probar cuando se reinicie la
cuota.

Historial de la decisión:

- Clave de Gemini creada y cargada como `GEMINI_API_KEY` (formato nuevo, empieza con
  `AQ.`). Es válida, pero **la cuota gratuita de la API para imágenes es cero**: todos
  los modelos de imagen devuelven `RESOURCE_EXHAUSTED` en la primera llamada. Para usarla
  hay que activar facturación en Google Cloud (tarjeta), ~USD 0,04 por imagen. La
  suscripción Google AI Pro de la app de Gemini (USD 20/mes) **no** aplica a la API.
- Cloudflare Workers AI (incluido en la cuenta, 10.000 neuronas/día). El token
  `CF_API_TOKEN` original no tiene permiso de Workers AI; se creó un segundo token con
  la plantilla **Workers AI**, cargado como `CF_AI_TOKEN`.

### E. Confirmaciones (hecho el 20/10/2026, con capturas)

1. **DNS en Cloudflare: sí.** 14 registros. `puestodepalta.com` y `www` son CNAME a
   `puesto-de-palta.pages.dev` (proxied). `www` redirige con 301 al dominio raíz. El
   mail del dominio está en Hostmar (registros `mail`, `mx1`, MX, SPF `spf.hostmar.com`)
   y Brevo tiene DKIM (`brevo1._domainkey`, `brevo2._domainkey`), DMARC y el TXT de
   verificación. **No tocar ninguno de esos registros.**
2. **Custom domain en Pages: sí.** `puestodepalta.com` Active con SSL. El proyecto
   **no está conectado a Git** (Build → Git repository → "Connect"): Genspark subía con
   `wrangler pages deploy` (direct upload). Variables cargadas en Pages: solo **5**:
   `BREVO_API_KEY`, `NOTION_DB_ID`, `NOTION_TOKEN`, `ONESIGNAL_API_KEY`,
   `ONESIGNAL_APP_ID` (todas como Secret). `CRON_SECRET`, `CF_API_TOKEN` y
   `CF_KV_NAMESPACE` NO existen en Pages, y el código tampoco las usa; Genspark las
   listó de más. `CRON_SECRET` se agrega en la etapa 2. Binding KV `NOTIFIED_ARTICLES`
   presente.
3. **cron-job.org: sí.** Job "Puesto de Palta — Notify notas", cada 5 minutos
   (`*/5 * * * *`, zona UTC), URL `https://puestodepalta.com/api/cron?secret=...`,
   habilitado, guarda respuestas en el historial.
4. `og-image.jpg` (la foto que muestran WhatsApp, Instagram o Google cuando alguien
   comparte el link del sitio): **resuelto.** Tomás eligió la imagen de Cloudinary
   `PALTA_PERU_METALES_PESADOS_ARTÍCULO_1_eeasg2` (JPEG 1376x768, palta abierta sobre
   tierra agrietada). En la etapa 2 la meta `og:image` de las tres plantillas pasa a:
   `https://res.cloudinary.com/dxlunrd1f/image/upload/c_fill,w_1200,h_630,q_auto,f_jpg/PALTA_PERU_METALES_PESADOS_ART%C3%8DCULO_1_eeasg2.jpg`
   (la tilde de ARTÍCULO va codificada como `%C3%8D`).

### F. Brevo: restricción por IP (hecho el 20/10/2026)

Se autorizó el rango `160.79.106.0/24` en https://app.brevo.com/security/authorised_ips
(las sesiones de Claude Code salen de IPs variables dentro de ese rango). Verificado:
12 de 12 llamadas aceptadas. Si en el futuro Brevo vuelve a rechazar por IP, revisar
que el rango siga cargado ahí.

### H. `CF_AI_TOKEN` en el entorno de Claude Code (hecho el 20/10/2026 según Tomás)

Se confirma en la próxima sesión nueva, igual que el resto de las variables.

### I. `CRON_SECRET` en Cloudflare Pages (hecho el 20/10/2026)

Cargado como Secret en el proyecto `puesto-de-palta`. Valor: el generado por Claude el
20/10/2026 (empieza con `4K0_`, está en el chat de esa fecha). **La URL de cron-job.org
NO se cambió todavía**: el código actual ignora la variable. Cambiarla recién cuando la
etapa 2 esté en producción, a
`https://puestodepalta.com/api/cron?secret=<CRON_SECRET>`.

### G. PERSEA (resuelto)

Tomás indicó el 20/10/2026 que PERSEA no se usa por ahora y no interesa para la
migración. Ignorar las columnas `Publicar PERSEA` y `Notificado PERSEA`: no leerlas,
no escribirlas, no borrarlas.
