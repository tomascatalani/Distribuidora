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
| Brevo | Emails | Lista ID 2 (196 suscriptores al 23/09/2026). Remitente ID 2 "Blog Paltero" / "Puesto de Palta Blog", contacto@puestodepalta.com. Plan gratuito: 300 mails/día. |
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

### Problemas detectados en el código actual

1. **Secreto del cron escrito en el código** (`src/index.tsx`, línea 39). El código
   ignora la variable `CRON_SECRET`. Para rotar el secreto hay que cambiar el código.
2. **`/api/notify` sin protección.** Cualquiera que conozca la URL puede mandar una
   campaña a todos los suscriptores.
3. **KV se marca antes de confirmar el envío.** Si Brevo u OneSignal fallan, la nota
   queda como "notificada" y el mail nunca sale (pasó el 22/09/2026 por límite de
   créditos SMTP). Solución manual: borrar la clave del KV y llamar `/api/notify`.
4. **ID de Notion duplicado y distinto** en `src/routes/blog.ts` línea 21
   (`3233fd35c85780bf8f1efd29cbdde59e`). No se usa en la práctica.
5. **`og-image.jpg` no existe** en el repo aunque la home lo referencia.
6. **No hay publicación por fecha.** "Programar" hoy es solo tildar Publicar a mano.
7. Sin límite de intentos ni anti-spam en formularios.

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

- **Web:** sigue en Cloudflare Pages, pero conectada a GitHub. Cada push a `main`
  despliega solo. Sin cambio de DNS.
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
| Brevo | Gratis hasta 300 mails/día (196 suscriptores hoy) |
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
| `CLOUDINARY_CLOUD_NAME` | No | Sí |
| `CLOUDINARY_UPLOAD_PRESET` | No | Sí |
| `GEMINI_API_KEY` | No | Sí |

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
- Brevo: la API key es válida pero la cuenta tiene **restricción por IP autorizada**.
  Las llamadas desde Claude Code salen de IPs variables (rango 160.79.106.x) y son
  rechazadas. Desde Cloudflare funcionan porque esas IPs ya estaban autorizadas (o la
  restricción se agregó después). Ver punto F.

### Pendiente, en orden

1. **Tomás:** completar la checklist de la sección 7 (variables, red, Notion, proveedor de imagen).
2. **Claude, etapa 2 (web):** correcciones de código listadas en la sección 1
   ("Problemas detectados"), limpieza de restos de Genspark, guía para conectar
   Cloudflare Pages a GitHub con un proyecto de prueba.
3. **Claude, etapa 3 (pruebas):** verificar blog, formularios y notificaciones en la
   URL de prueba `*.pages.dev`.
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

- **Proveedor de imágenes: Google Gemini.** Genspark usaba su herramienta nativa
  `image_generation` sin modelo fijo y sin registro de corridas, así que no hay nada
  que replicar. El prompt se genera en cada corrida según el tema. Clave en el
  entorno de Claude Code como `GEMINI_API_KEY`. Si el estilo no convence, se cambia de
  proveedor sin tocar el resto.
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

### D. Clave de Google Gemini para las imágenes (obligatorio para la etapa 4)

1. Entrá a aistudio.google.com con tu cuenta de Google.
2. **Get API key** → **Create API key** → copiá la clave.
3. En Edit del entorno de Claude Code, agregá la línea `GEMINI_API_KEY=<clave>` al
   bloque de Environment variables y guardá.

### E. Confirmaciones (solo mirar y avisar)

1. Cloudflare → tu dominio → pestaña **DNS**: ¿los registros de puestodepalta.com
   están ahí? (sí / no)
2. Cloudflare → **Workers & Pages** → proyecto `puesto-de-palta` → pestaña
   **Custom domains**: ¿figura puestodepalta.com? (sí / no)
3. cron-job.org: ¿podés entrar y ver el job que llama a `/api/cron`? (sí / no)
4. ¿Tenés el archivo `og-image.jpg` o una foto para usar como previsualización en
   redes? Si sí, subila a la sesión.

### F. Brevo: sacar la restricción por IP (obligatorio para la etapa 4)

1. Entrá a https://app.brevo.com/security/authorised_ips
2. Desactivá la restricción de IPs autorizadas (o, si preferís mantenerla, agregá el
   rango `160.79.106.0/24`, que es desde donde salen las sesiones de Claude Code).
3. Guardá. Sin esto, Claude no puede mandar el mail de "borrador listo" ni leer la
   lista de suscriptores.

### G. PERSEA (resuelto)

Tomás indicó el 20/10/2026 que PERSEA no se usa por ahora y no interesa para la
migración. Ignorar las columnas `Publicar PERSEA` y `Notificado PERSEA`: no leerlas,
no escribirlas, no borrarlas.
