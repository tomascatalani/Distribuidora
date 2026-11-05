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
- **Plan gratis de Metricool** (ayuda oficial, leída el 5/11/2026: "Principales
  diferencias entre el plan Free y planes de pago"): 20 publicaciones por mes, contadas
  cuando salen (los borradores y lo programado no cuentan hasta publicarse) y una vez por
  cada red (un post a Instagram, Facebook y TikTok cuenta 3). Se reinicia el día 1.
  Además: 1 marca, 1 perfil por red, 30 días de historial en Analítica, 5 competidores
  fijos, sin Google Drive ni flujo de aprobación. El plan pago más barato (Starter) sale
  desde unos 20 dólares por mes, sin límite de publicaciones.
- **Música desde Metricool:** desde el 18/5/2026 se puede programar un Reel (o Trial
  Reel) con audio de la biblioteca de Meta (canciones habilitadas para apps externas y
  sonidos originales). En la herramienta de Claude es `instagramData.audioConfiguration`
  con `audioId` (acepta el nombre de la canción). Requiere Instagram conectado a través
  de Facebook, que es como está. Carruseles, posts e historias **no** llevan música desde
  Metricool: o se publica con `autoPublish: false` (a la hora de salir llega un aviso a
  la app de Metricool y se termina a mano en Instagram, con música), o se agrega después
  en Instagram con Editar (Instagram lo está habilitando de a poco).
- **Comentarios:** Metricool da la cantidad por post, no el texto ni quién comentó.

## 3. Reglas de trabajo en redes

- Los posts que arma Claude van a Metricool siempre como borrador (`draft: true`).
  Programar en firme o publicar lo hace Tomás.

- **Nada se publica sin el OK de Tomás.** Claude deja borradores o publicaciones
  programadas para revisar; publicar o programar en firme lo decide Tomás.
- Misma voz que el blog (ver Anexo A de `docs/MIGRACION.md`).
- Cada nota nueva del blog puede tener su post para Instagram y Facebook.
- **Este repo es público:** no poner acá links ni ids de archivos o carpetas de Drive,
  ni mails de nadie. Los ids están en la carpeta privada del proyecto de Claude
  (`redes/drive-ids.md`) y todo se encuentra por nombre con la búsqueda del conector de
  Drive.
- La Agenda de contenidos de Pipi (el CM) es de su cuenta: Claude solo la lee, nunca la
  edita. Lo nuevo va en la planilla de Tomás.
- Del Drive se usan solo los archivos sueltos de las carpetas VIDEO e IMAGEN, nunca lo
  que está en sus subcarpetas (pedido de Tomás).

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
- [x] Competidores cargados en Metricool por Tomás (5/11/2026). Al 5/11 23:05 UTC
  aparecen 4: @paltasagrada 57.363 seguidores, @lapalteria10 55.551 (11 Reels y 1 post
  en 30 días), @labellapalta 8.804 (5 posts, ~3 likes), @frutiverdu 6.926 (2 Reels).
- [x] **Revisión semanal de la competencia** programada (5/11/2026): tarea "Revisión
  semanal de la competencia en redes", todos los lunes 8:53 hora de Buenos Aires
  (primera: 9/11/2026). Mira Metricool (competidores y números propios), actualiza la
  tabla "La competencia en números" de la pestaña Análisis con fecha y 2 o 3
  observaciones, deja el resumen en esta sección y le avisa a Tomás en pocas líneas.
- [x] **Calendario de diciembre 2026 a febrero 2027** (pedido y hecho el 5/11/2026).
  - Planilla "Calendario de contenidos PdP — dic 2026 a feb 2027" en Mi unidad de
    Tomás, sin compartir todavía (el link está en la pestaña Calendario del Plan de
    redes). Columnas: Semana, Fecha, Día, Formato, Pieza, Quién, Material, Estado,
    Notas. 13 semanas, del 30/11 al 28/2, cada una con una fila "SEMANA n / TEMA". Las
    fechas van como 2026-12-01 para que Sheets no las lea al revés. Mantiene todo lo
    que Pipi tenía en su Agenda hasta el 1/1/2027; desde el 4/1 son propuestas.
  - El conector de Drive no edita el contenido de una planilla: para cambiarla se crea
    de nuevo (CSV como texto, tipo `text/csv`) y la anterior va a la papelera. Así se
    hizo el 5/11 para cambiar "CM" por "Pipi"; la copia de trabajo del CSV no queda en
    el repo.
  - Semana tipo del verano: lunes Reel de la nota o Tom especialista; martes carrusel
    (Claude); miércoles receta (Pipi); jueves dato en post e historia con encuesta
    (Claude); viernes Reel de reacción o con voz en off; sábado receta; domingo nota del
    blog o efeméride.
  - Temas por semana: 1 La palta que nadie cultivó; 2 Las Fiestas en su punto; 3 La
    cuna del Hass; 4 Navidad con calor; 5 El árbol que necesita pareja y cierre del año;
    6 El punto exacto; 7 nota del 10/1; 8 Palta y mango; 9 nota del 24/1; 10 Lo que
    tirás de una palta; 11 nota del 7/2, Carnaval, ciencia y San Valentín; 12 Apurarla o
    frenarla; 13 nota del 21/2.
  - Pestaña "Calendario" del Plan de redes: cómo se armó, 7 tareas de Reels con guion en
    off y el material de Drive de cada una (23/12 La semana más larga del año, a grabar
    del 21 al 23/12; 6/1 tostada con huevo poché; 8/1 Lo que dice la cáscara; 22/1
    Palta y mango; 29/1 Así le mostramos un cajón a un cliente; 5/2 Lo que tirás también
    es palta; 19/2 Domingo de tostadas), temas de Tom especialista (4/1, 18/1, 1/2 y
    15/2), el inventario del Drive y lo que falta.
  - Cuenta del plan gratis: en diciembre las piezas de Claude son 8 posts y 3
    historias. Los 8 posts a Instagram y Facebook ya son 16 de las 20 del mes.
  - Falta de Tomás: hasta qué día se puede pedir para Navidad y Año Nuevo, y zonas y
    días de reparto (carrusel del 8/12); si hay mango este verano; con qué clientes
    hacer las colaboraciones de enero y febrero; mostrarle la planilla a Pipi; OK para
    cargar el lote de diciembre como borradores en Metricool.
  - Cuando existan las notas del 10/1, 24/1, 7/2 y 21/2: escribir sus guiones y
    carruseles.
- [ ] Diagnóstico de las últimas publicaciones (esperando que Metricool cargue).
- [x] **Documento principal: "Plan de redes — Puesto de Palta"**
  (https://claude.ai/artifact/2uUFoTooRGhhWfVuKPpnSP), con tres pestañas: Análisis,
  Acción y Creación. Reemplaza al primero, "Competencia en redes y guiones".
- [x] Lote 1 creado (5/11/2026): carrusel de 6 imágenes "La palta dejó de tener
  temporada" (nota Supply sin fin) + texto del post, en la carpeta del proyecto
  `redes/lote-1-temporada/`. Hecho en HTML con las fotos de la galería de Cloudinary y
  las fuentes del sitio, renderizado con Chromium a 1080x1350. Con OK de Tomás
  (5/11/2026) quedó como **borrador** en Metricool (post 418326829, uuid
  6454583438595015730) para Instagram y Facebook, sábado 7/11/2026 20:00 ART. Imágenes
  en Cloudinary, carpeta `puesto-de-palta/redes/lote-1-temporada/` (preset sin firma).
  Para Instagram se pasan como JPG con `f_jpg,q_92` en la URL, porque Instagram no
  acepta PNG. **Tomás lo publicó antes, el 5/11/2026 a las 20:32 ART**, en Instagram
  (https://www.instagram.com/p/DfYOHabIYvJ/), Facebook y TikTok (en Metricool quedó con
  id 418355575, mismo uuid). Le cambió el texto a letras especiales (ver sección 5).
  Medir su rendimiento 2 o 3 días después.
- [ ] Rutina semanal de publicaciones (propuesta en la pestaña Acción).

## 5. Contexto que dio Tomás (5/11/2026)

- Tiene un CM que maneja las redes y están bastante activas. Este trabajo es para
  sumarle contenido, no para reemplazarlo. **El CM es hombre y se llama Pipi**: desde
  el 5/11/2026 se lo nombra así en todo (planilla, Plan de redes, mensajes).
- Estilo de la cuenta: los textos de los posts van con letras especiales (caracteres
  Unicode en negrita cursiva, como "𝑯𝒖𝒃𝒐 𝒖𝒏 𝒕𝒊𝒆𝒎𝒑𝒐"); los hashtags, en letra común.
  Para plantear en el diagnóstico: Instagram no las toma como palabras en la búsqueda y
  los lectores de pantalla las leen mal.
- Tomás tiene un álbum de música hecho con IA para Puesto de Palta, en Spotify, y usa
  esas canciones en Instagram. Quedó en pasar el link o el nombre del artista para
  buscarlas en la biblioteca de audio de Metricool cuando se suba un Reel.
- Las notas del blog salen cada dos semanas y las genera `/nota-semanal`. Desde redes
  se convierten en posts.
- Quiere guiones para grabar él mismo en off.
- Competencia que nombró: Palta Sagrada (@paltasagrada, mayorista en Vicente López),
  La Bella Palta (@labellapalta, distribuidora mayorista), La Paltería
  (**@lapalteria10**, distribuidora de paltas en Castelar, unos 55.000 seguidores según Tomás: el
  competidor más directo; ojo, @lapalteria_ es otro negocio) y las distribuidoras de
  fruta fresca en general.
- Notas del blog en Notion al 5/11/2026: 16 publicadas (de marzo a "Supply sin fin",
  1/11) y 10 borradores. Con fecha: 9/11 "La fruta que también clasificó al mundial",
  15/11 "La hipocresía no es necesariamente intencional", 19/11 "Lo que dice aceite de
  palta en la etiqueta probablemente no lo es", 29/11 "La palta que nadie cultivó a
  propósito", 13/12 "La cuna del Hass ya no puede competir", 27/12 "El árbol que no
  sabemos cómo va a actuar". Sin fecha: "Trece pesos y un certificado", "El tercer
  intento de Tucumán con la palta", "Cuando la industria del aceite de palta finalmente
  se mira al espejo", "Una flor, dos sexos, cuarenta y dos millones de años". Sin
  publicar desde marzo: "El carozo que no es basura". Temas repetidos: aceite (19/11 y
  la sin fecha) y polinización (27/12 y "Una flor, dos sexos"). Para el calendario se
  supone una nota nueva cada dos semanas: 13/12, 27/12, 10/1, 24/1, 7/2, 21/2.
- 5/11/2026, por pedido de Tomás: "Cuando la industria del aceite de palta finalmente
  se mira al espejo" y "Una flor, dos sexos, cuarenta y dos millones de años" se
  mandaron a la papelera de Notion (API: `archived: true`; se recuperan durante 30
  días), porque repetían las del 19/11 y el 27/12. Regla de Tomás: si una nota sin
  fecha trata casi el mismo tema que una con fecha o publicada, se borra. "Trece pesos
  y un certificado" y "El tercer intento de Tucumán" no repiten nada y quedan. Pendiente
  que Tomás diga si también se borra "El carozo que no es basura" (15/3, nunca
  publicada), que cuenta lo mismo que "El naranja que nadie miraba" y "El carozo que
  tiñe".
- Para guiones y carruseles: usar datos de notas publicadas o que salen antes que la
  pieza. Las dos notas del carozo no coinciden en qué institución hizo el estudio, así
  que no se la nombra hasta confirmarlo.
- Lección: Instagram no se puede mirar sin iniciar sesión desde el entorno de Claude, y
  la búsqueda web no siempre encuentra la cuenta por el nombre. Pedirle a Tomás el
  usuario exacto de cada cuenta antes de analizarla.

## 6. Material en Google Drive (relevado el 5/11/2026)

Tomás conectó Google Drive el 5/11/2026. Por ser este repo público, acá van solo
nombres (ver sección 3).

- **Agenda de Pipi:** planilla "Agenda Contenidos PdP". Es de la cuenta de Pipi y
  Claude solo la puede leer. Plan hasta el 1/1/2027: lunes Reel del blog o Tom
  especialista; miércoles y sábado recetas; viernes Reel o reacción; efemérides. Sus
  reglas: cada semana gira alrededor del video del lunes; un tema no se repite antes de
  4 meses; naranja es efeméride; amarillo es una tarea que necesita a Tomás. Historias:
  3 o 4 por día, con "Curiosidad" los jueves. Ideas que se guardó: carrusel "cómo saber
  si la palta está a punto" y, para San Valentín, la palta partida como corazón.
- **Carpetas:** REDES PUESTO DE PALTA > IMAGEN Y VIDEO > VIDEO e IMAGEN. Solo se usan
  los archivos sueltos de VIDEO e IMAGEN (sección 3).
- **Cómo se leen desde el entorno de Claude** (las carpetas son públicas con enlace; los
  ids se sacan del link que pase Tomás o con la búsqueda del conector de Drive):
  - Listado de una carpeta: `https://drive.google.com/embeddedfolderview?id=<carpeta>`
  - Miniatura: `https://drive.google.com/thumbnail?id=<archivo>&sz=w220`
  - Descarga: `https://drive.usercontent.google.com/download?id=<archivo>&export=download&confirm=t`
  - Planilla entera: `https://docs.google.com/spreadsheets/d/<id>/export?format=xlsx`
    (el conector de Drive solo devuelve unas filas de muestra).
  - Audio de videos: ffmpeg a 16 kHz mono y faster-whisper (modelo small), pasándole el
    audio ya leído con numpy; abrir el archivo directo falla por la versión de PyAV.
- **Inventario:** 85 videos sueltos (unos 16 minutos en total) y 948 imágenes.

| Qué hay | Archivos | Para qué sirve |
|---|---|---|
| Videos de cajones que Tomás le muestra a clientes, con su explicación | 141950 a 142056, 355114, A64DF45A y copias más chicas | Reels de detrás del puesto. El audio tiene nombres de clientes: van con voz en off |
| Videos del mercado, con pallets de cajones | Video de WhatsApp del 27/7/2025 y D531DE03 | Arranque de un Reel |
| Receta de tostada con huevo poché, desde arriba | IMG_0011 a IMG_0033 | Receta del 6/1 |
| Desayuno en la mesa, con mate | IMG_0059 a IMG_0092 | Reel del 19/2 |
| Video del smoothie | IMG_0094 a IMG_0097 | Puede que ya haya salido en enero de 2026 |
| Paltas y mangos en el pasto, con cámara (horizontales) | DSC_0933 a DSC_0962 y DSC_0883 | Reels del 8/1 y del 22/1 |
| Palta y nueces pecán, tostadas con palta y nueces | DSC_0751 a DSC_0882 | Carruseles y receta del 17/2 |
| Bodegones: canasta, pasto, bowl de barro, fondo blanco | DSC_0665 a DSC_0760 | Fondos de carruseles (DSC_0684 a DSC_0690 se pueden recortar) |
| Palta en la mano entre jazmines, palta cortada con luz cálida | DSC_0576 a DSC_0614 | Portadas de carruseles |
| Plato con guacamole, fideos, zanahoria y remolacha | DSC_0615 a DSC_0637 | Una receta |
| Mango y palta en cajones con la tarjeta de Puesto de Palta | DSC_0895 a DSC_1012 | Semana del 18/1 (DSC_0896 ya salió en enero de 2026) |
| Desayuno con huevo poché y smoothie en el jardín (fotos) | IMG_0034 a IMG_0143 | Recetas |
| Estudio: paltas con aceite de oliva, limones, soja y palillos | DFB_2892 a DFB_3108 | Posts de producto |
| Una nena comiendo una tostada con palta | DSC_0470 a DSC_0532 | Apreciación paltera |
| Cajones, depósito, el auto cargado y entregas | Fotos con nombre de número e IMG_6563 a IMG_6591 | Carrusel del 8/12 |
| Piezas diseñadas viejas (recetas, días de entrega, combos, lista de precios) | ultimas, CONTENIDO, recetas, dias y otras | Solo referencia: la lista de precios está vieja |
