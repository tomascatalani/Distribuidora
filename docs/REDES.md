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
  cada red (un post a Instagram, Facebook y TikTok cuenta 3). Cuenta por mes calendario:
  se reinicia el día 1, sin importar cuándo se creó la cuenta (noviembre de 2026: 3
  usadas, con el carrusel del 5/11). Lo que Tomás o Pipi publican directo desde
  Instagram, bajando las imágenes de un borrador, no cuenta; después hay que borrar el
  borrador para que no salga dos veces.
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
- **Comentarios y mensajes privados:** Metricool da la cantidad de comentarios por post,
  no el texto ni quién comentó. Los mensajes privados de la cuenta tampoco llegan a
  Claude: si Tomás quiere que lea algo, lo pega en el chat o manda una captura.

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
  que está en sus subcarpetas (pedido de Tomás). Lo suelto es lo que está disponible; lo
  que ya salió lo pasan a las subcarpetas YA USADAS (fotos) y YA USADOS (videos). Desde
  el 10/11/2026, la carpeta "Material para usar" junta lo disponible (ver sección 4).

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
  tabla "La competencia en números" de la pestaña "B · Información semanal" (hasta el
  7/11 se llamaba Análisis) con fecha y 2 o 3 observaciones, deja el resumen en esta
  sección y le avisa a Tomás en pocas líneas.
  - **9/11/2026** (la primera; competidores del 10/10 al 8/11 y la semana del 2 al
    8/11). Seguidores: @paltasagrada 57.346 (-17 desde el 5/11), @lapalteria10 55.679
    (+128), @labellapalta 8.790 (-14), @frutiverdu 6.924 (-2). La Paltería: 10 Reels y
    1 post en 30 días, con 112 likes y 7 comentarios de promedio; en la semana, un solo
    post (avisa que cambió su WhatsApp) y ningún Reel desde el 31/10. Lo que más le
    funcionó: dos videos de humor sobre el negocio (215 y 212 interacciones) y uno de
    cómo saber si una palta está madura (144); el de "si llegamos a 100 comentarios
    regalamos remeras" juntó 22 comentarios pero menos likes. Palta Sagrada: ninguna
    publicación en el feed en 30 días, según Metricool. La Bella Palta: 3 posts para
    empresas, de 1 a 5 likes. Frutiverdu: 1 Reel.
  - Propios, misma revisión: 12.481 seguidores el 7/11; del 2 al 7/11 entraron unos
    500 (la semana anterior, 1.663). Alcance de la cuenta: de 2.800 a 6.000 por día del
    4 al 7/11, contra 10.000 a 15.000 del 31/10 al 3/11. 6 Reels y el carrusel del 5/11
    (396): el sándwich del 3/11, receta de otra cuenta, 10.681 personas, 108 guardados
    y 61 compartidos; los propios, unas 300; el de la nota, 347 orgánico (y 1.420 con
    anuncio). Solo uno salió entre las 19 y las 21 h. Ese día se corrigió la hora de
    los Reels (ver Horario, en el diagnóstico).
  - Cómo se leyó: IGCO (7 y 30 días), IGCR para los Reels de los competidores (IGCP
    trae solo sus posts), IGEV por día, IGRE e IGPO.
- [x] **Calendario de diciembre 2026 a febrero 2027** (pedido y hecho el 5/11/2026;
  versiones 4 y 5 el 7/11/2026; la 5 está más abajo, en su propio punto).
  - Planilla "Calendario de contenidos PdP — dic 2026 a feb 2027" en Mi unidad de
    Tomás, sin compartir todavía (el link está en la pestaña Calendario del Plan de
    redes). 13 semanas, del 29/11 al 28/2. Mantiene lo que Pipi tenía en su Agenda hasta
    el 1/1/2027, salvo lo que se cambió el 7/11 por los números (en amarillo); desde el
    4/1 son propuestas.
  - **Versión 4** (7/11/2026). Tomás pidió la planilla "más prolijo y estético" y que
    diciembre se reestructure si las conclusiones del análisis lo piden. Tiene tres
    pestañas:
    - Calendario: Fecha (como 29/11), Día, Hora, Formato, Pieza, Quién, Estado,
      Material, Música, Notas y "Qué cambió (7/11)". Encabezado negro y una banda verde
      por semana (número, fechas, tema y la nota de la semana). El formato tiene un
      color por tipo y el Estado, lista desplegable y color. Las dos primeras columnas
      y el encabezado quedan fijos al moverse, y hay filtro.
    - Qué cambió: cada cambio de diciembre con el antes, el ahora y el número que lo
      justifica, y las reglas para todo el calendario.
    - Cómo leerla: los colores de formato y estado, el amarillo, la semana tipo con
      horas y la guía de música.
  - Diseño: los colores del sitio (verde `#4a7c59` en las bandas, negro en el
    encabezado), Libre Baskerville en títulos y bandas, Open Sans en el resto. Lo que
    cambió va en amarillo (`#FFF1C7`); si cambió el formato, el chip lleva borde
    amarillo. Formatos: Reel verde claro, Receta verde oliva, Carrusel celeste, Post
    lila, Historia durazno, Nota del blog beige, Revisión gris. Estados: Planificado por
    Pipi, Idea, A definir, Hay que grabar, Guion listo, Grabado, Borrador en Notion,
    Borrador en Metricool, Publicado.
  - Cómo se arma: un script de Python (`v4.py`, con openpyxl) escribe un xlsx que se
    sube al Drive y se convierte en planilla de Google. Está en la carpeta privada del
    proyecto, `redes/calendario/`, con el CSV de la versión 3 que usa de base y las
    fuentes. El alto de cada fila se calcula con las medidas de Open Sans y queda fijo,
    porque Sheets no siempre agranda solas las filas con texto largo al importar un
    xlsx. El conector de Drive no edita el contenido de una planilla: para cambiarla se
    sube de nuevo y la anterior va a la papelera, solo si nadie la editó (mirar la fecha
    de modificación). **Una vez que Tomás o Pipi empiecen a editarla, no recrearla:** se
    perderían sus cambios. Desde ahí, los cambios se proponen en el chat o en el Plan de
    redes.
  - Qué cambió en diciembre, con los números del diagnóstico sin lo pago:
    - Las efemérides que no son de la palta pasan de post a historia: Día del Médico
      (3/12), Solidaridad Humana (20/12) y Meditación o Básquet (21/12). Llegan a 494
      personas de mediana, contra 783 de un Reel típico.
    - El Día Mundial del Suelo (5/12) pasa de post a Reel con los productores
      etiquetados, como el del Día del agricultor (900).
    - Recetas propias, grabadas por Tom y Pipi: palta rellena (9/12) y huevos rellenos
      con palta (16/12). Las de otras cuentas siguen los sábados (1.141 de mediana,
      contra 597 de lo propio).
    - Una reacción de Tom el lunes 21/12 (las reacciones: 1.895 de mediana).
    - Los Reels de las notas (30/11, 14/12 y 28/12) arrancan con el dato más fuerte y
      se comparten en historia con el link a la nota, sin "Comentá X y te paso más
      info" (2 comentarios de mediana).
    - Dos piezas nuevas de Claude: la historia con el link a la nota del 29/11 y el dato
      de las 47 variedades como post del jueves 3/12; la historia de ese día pasó a las
      21 h.
    - Apreciación paltera (11/12) sigue como carrusel, con la nota de hacerla en video
      si el del 13/11 anda bien (carruseles 447, Reels 783).
    - Para todo el calendario: Reels de 19 a 21 h (corregido el 9/11; los de las 19 h,
      1.010; los de las 15 h, 746), posts a las 20 h; letras especiales solo en la
      primera línea, del 30/11 al 13/12, para comparar; no subir Reels de prueba (unos
      110 de alcance); revisión de diciembre el 4/1.
    - Enero y febrero: los Reels de las notas también arrancan con el dato más fuerte,
      cada nota tiene el domingo su historia con el link, y "Resumen" pasó a
      "Revisión".
  - Versiones anteriores: la 1 y la 2 el 5/11 (CSV; la 2 cambió "CM" por "Pipi") y la 3
    el 6/11, con lo que contestó Tomás: este verano no hay mango y por ahora no hay
    colaboraciones (quizás algún intento o propuesta). La semana 8 (18/1) pasó de "Palta
    y mango" a "La palta del sushi" (carrusel 19/1, receta propuesta de poke o rolls
    20/1, Reel 22/1 con tomas nuevas). Los miércoles de colaboración (27/1 y 24/2)
    volvieron a ser recetas, con nota de que ahí puede ir un intento. El carrusel del
    8/12 lleva los días de entrega, y hay avisos de Pipi el 22/12 y el 30/12. Columna
    "Música" con la canción sugerida para cada pieza de Claude y cada Reel con guion
    (ver sección 7).
  - Semana tipo del verano: lunes Reel de la nota o Tom especialista (19 a 21 h);
    martes carrusel (Claude, 20 h); miércoles receta propia o de otra cuenta (Pipi);
    jueves dato en post (20 h) e historia con encuesta (21 h), de Claude; viernes Reel
    de reacción o con voz en off; sábado receta de otra cuenta, con créditos; domingo
    nota del blog, una semana por medio, con su historia con el link (19 h), o
    efeméride.
  - Temas por semana: 1 La palta que nadie cultivó; 2 Las Fiestas en su punto; 3 La
    cuna del Hass; 4 Navidad con calor; 5 El árbol que necesita pareja y cierre del año;
    6 El punto exacto; 7 nota del 10/1; 8 La palta del sushi; 9 nota del 24/1; 10 Lo que
    tirás de una palta; 11 nota del 7/2, Carnaval, ciencia y San Valentín; 12 Apurarla o
    frenarla; 13 nota del 21/2.
  - Pestaña "Calendario" del Plan de redes (así quedó hasta el 7/11; desde ahí los
    guiones, los temas y los borradores están en la pestaña Creación, y la música y el
    material del Drive en "A · Información fija"): cómo se armó, qué cambió en diciembre
    (7/11), 7 tareas de Reels con guion en off, el material de Drive y la canción de
    cada una (23/12 La semana más larga del año, a grabar del 21 al 23/12; 6/1 tostada
    con huevo poché; 8/1 Lo que dice la cáscara; 22/1 La palta del sushi, a grabar
    antes; 29/1 Así le mostramos un cajón a un cliente; 5/2 Lo que tirás también es
    palta; 19/2 Domingo de tostadas), temas de Tom especialista (4/1, 18/1, 1/2 y 15/2),
    la guía de música, el inventario del Drive y lo que falta.
  - Cuenta del plan gratis: en diciembre las piezas de Claude son 9 posts y 5
    historias (la historia del 29/11 cuenta en noviembre). Si los 9 posts salieran
    desde Metricool a Instagram y Facebook serían 18 de las 20 del mes, y las historias
    sumarían 5 más; publicados a mano desde Instagram no cuentan.
  - Falta de Tomás: mostrarle la planilla a Pipi (lo que cambió de lo suyo está en
    amarillo, con el motivo); decidir con Pipi si graban las recetas propias del 9/12 y
    el 16/12 (si no, van de otras cuentas); grabar el Reel del 23/12 (entre el 21 y el
    23/12) y las tomas del sushi (antes del 22/1).
  - Las notas del 10/1 y el 24/1 ya tienen sus guiones, carruseles e historias (lote de
    enero y febrero, más abajo). Las del 7/2 y el 21/2 se escriben en enero, con
    noticias frescas (ver "Tareas programadas").
- [x] **Lote de diciembre 2026 armado** (OK de Tomás el 6/11/2026, hecho el mismo día).
  - 15 borradores en Metricool (9 posts a Instagram y Facebook, 6 historias solo a
    Instagram), todos con `draft: true` y `autoPublish: false`: no salen solos. Tomás
    pidió que queden así porque la mayoría se va a bajar para ponerle música y subir a
    mano. Hora de Buenos Aires: posts 20:00 (mejor horario según Metricool), 31/12
    12:00; historias 19:00 (las del link a una nota) o 21:00 (las del dato).
  - El 7/11, con la versión 4 del calendario, se sumaron 2: la historia con el link a la
    nota del 29/11 y el dato de las 47 variedades del 3/12. La historia del 3/12 pasó de
    las 12:00 a las 21:00 (en Metricool cambió su id; el uuid sigue igual).
  - Metricool guarda una copia idéntica de cada imagen (comprobado byte por byte con
    SHA-256, en el lote 1 y en las portadas de diciembre): bajarla de Metricool no
    pierde calidad.
  - Imágenes: 50 JPG (calidad 95, sin submuestreo de color) en Cloudinary, carpeta
    `puesto-de-palta/redes/diciembre-2026/<pieza>/`. En la carpeta del proyecto de Claude,
    `redes/diciembre-2026/`: una carpeta por pieza con sus imágenes y un
    `texto-y-notas.txt` (texto del post, canción y qué agregar en Instagram), un
    `LEEME.txt` y `diciembre-2026-todo.zip`.
  - Las notas para Instagram (canción, encuestas, stickers de link) no van en Metricool:
    su herramienta no tiene campo de notas y el texto del post se publicaría. Están en
    cada `texto-y-notas.txt` y en la tabla "Borradores de diciembre" de la pestaña
    Creación del Plan de redes.
  - Dependen de notas del blog que hoy son borrador en Notion: la historia del 29/11, el
    carrusel del 1/12 y el dato y la historia del 3/12 (nota del 29/11); el carrusel del
    15/12 y la historia del 13/12 (nota del 13/12); el carrusel del 29/12 y la historia
    del 27/12 (nota del 27/12), y cinco números del 31/12. Si alguna no sale, esa pieza
    se corre o se cambia. El título de la nota del 27/12 está escrito "como" sin tilde en
    Notion.
  - En las fotos de la palta en la mano se lee la etiqueta de la fruta (Propal, Chile):
    dato e historia del 10/12, historia del 27/12 y carrusel del 29/12. En el Plan de
    redes se le ofreció a Tomás cambiar esas fotos si prefiere.
  - Cómo se armó y cómo repetirlo para enero: `scripts/redes/README.md`.

  | Fecha y hora | Pieza | Imágenes | Canción | Metricool id | uuid |
  |---|---|---|---|---|---|
  | 29/11 19:00 | Historia con link a la nota "La palta que nadie cultivó a propósito" | 1 | Mañanas en el Depósito | 419966108 | -7470821315535549619 |
  | 1/12 20:00 | Carrusel "La palta que nadie cultivó a propósito" | 6 | Divina Cosecha | 418423323 | 6321353025592444006 |
  | 3/12 20:00 | Dato "47 variedades sin registrar" | 1 | Mercado al Alba | 419966136 | -6755557745045714443 |
  | 3/12 21:00 | Historia: 47 variedades, encuesta "¿Lo sabías?" | 1 | Mercado al Alba | 419966143 | 8636534181909447004 |
  | 8/12 20:00 | Carrusel "Pedila en su punto para las Fiestas" | 6 | La Bella Entrega | 418423481 | 82243734738191373 |
  | 10/12 20:00 | Dato "1926" | 1 | Divina Cosecha | 418423736 | 1721036335684208114 |
  | 10/12 21:00 | Historia: quiz México, Perú, California o Chile | 1 | Divina Cosecha | 418423749 | -4381109930861377144 |
  | 13/12 19:00 | Historia con link a la nota "La cuna del Hass" | 1 | Mañanas en el Depósito | 418423754 | -7017967506302349566 |
  | 15/12 20:00 | Carrusel "La cuna del Hass ya no puede competir" | 7 | Mañanas en el Depósito | 418423764 | -4116599204473190990 |
  | 17/12 20:00 | Dato 6.000 y 3.000 | 1 | Mercado al Alba | 418423954 | -5001664418404873072 |
  | 17/12 21:00 | Historia: encuesta "¿Te importa de dónde viene tu palta?" | 1 | Mercado al Alba | 418423966 | -3404494949529334329 |
  | 22/12 20:00 | Carrusel "El punto exacto 1" | 6 | Ansiada Maduración | 418423977 | 7006424499319817805 |
  | 27/12 19:00 | Historia con link a la nota "El árbol" | 1 | Mañanas en el Depósito | 418424241 | -8493676837517834410 |
  | 29/12 20:00 | Carrusel "La flor de la palta abre dos veces" | 6 | Mañanas en el Depósito | 418424248 | -5204818510854143634 |
  | 31/12 12:00 | Carrusel "2026 en la palta, en 8 números" | 10 | Divina Cosecha | 418424260 | 1273242145772421938 |
- [x] **Diagnóstico de publicaciones** (6/11/2026), en "Los números de la cuenta" de la
  pestaña "B · Información semanal" del Plan de redes (antes "Tus números", en
  Análisis). Metricool trajo Instagram del 11/7 al 5/11/2026: 96 Reels y 4 carruseles
  (el plan gratis no da más historia). Resumen:
  - 12.314 seguidores el 4/11; del 31/10 al 4/11, +872 y -12. Alcance de la cuenta:
    6.000 a 15.000 cuentas por día.
  - Un Reel típico llega a 744 personas (mediana, sin las 11 pruebas). El hummus del
    21/10 llegó a 101.796: el 51% del alcance de los cuatro meses. Unos 5 Reels por
    semana.
  - Por tipo (mediana de alcance; guardados y compartidos cada 1.000): recetas y videos
    de otras cuentas 1.282 (27), reacciones de Tom 1.895 (10, solo 3), notas del blog
    621 (8; el "Comentá X" junta 2 comentarios de mediana), propios 573 (12),
    efemérides 471 (14), carruseles 447 (11).
  - Horario (corregido el 9/11/2026): la mayoría sale a las 19 h de Argentina (mediana
    800) o a las 15 h (600). Mejor momento según Metricool (seguidores conectados): 19
    a 21 h, pico 20 h. Se recomienda 19 a 21 h (el 6/11 había quedado 20 a 22 h).
    Las horas de cada publicación en los números de Metricool (IGRE02, IGPO02) vienen
    en UTC, 3 horas más que en Argentina: lo confirmó el carrusel del 5/11, que salió a
    las 20:32 (el planificador, `getScheduledPosts`, lo da así en hora argentina y a
    las 23:32 si se le pide UTC) y en los números figura a las 23:33.
    `getBestTimeToPostByNetwork` sí respeta la zona que se le pasa. Ningún Reel cambia
    de día al pasarlo a hora argentina, así que lo de los días queda igual.
  - Letras especiales: casi todos los textos las usan; no se puede medir el efecto. Se
    recomendó primera línea especial y el resto en letra común, y probar dos semanas.
  - Facebook: 73 seguidores, Reels con 216 reproducciones de mediana. TikTok: Metricool
    sin datos todavía. Historias: Metricool las guarda desde el 5/11, sin alcance aún.
  - Cómo se leyó: `getAnalyticsDataByMetrics` con IGRE (Reels), IGPO (posts), IGEV
    (cuenta), FBRE y FBEV, más `getBestTimeToPostByNetwork`. Las 11 "pruebas" son Reels
    con texto corto en letra común y unas 110 personas de alcance.
  - Audio para Pipi (6/11/2026, pedido de Tomás): el diagnóstico contado en 2 minutos y
    medio, con voz sintética. MP3 y guion en la carpeta del proyecto
    `redes/audio-analisis/`. Cómo se hace: `scripts/redes/README.md`, sección Audio.
    El 9/11 se regrabó con la hora corregida (Reels de 19 a 21 h) y una frase que la
    voz decía mal; el del 6/11 quedó en `anteriores/`. La carpeta del proyecto le
    reescribe la etiqueta ID3 al MP3 (pesa unos 6 KB más), pero el audio es el mismo.
  - **Lo pago, separado** (7/11; Tomás, 6/11: "hay publicaciones con plata inyectada").
    Los datos por Reel de Metricool (alcance, vistas, likes, guardados, compartidos)
    son solo orgánicos; los seguidores (IGEV) cuentan todos. Tomás conectó su cuenta de
    anuncios de Meta en Metricool el 6/11 (`facebookAdsData` en `getBrandSettings`) y a
    la mañana siguiente ya estaban las campañas desde fines de agosto; de antes no hay
    datos. Cómo se leyó: campañas FACA03 (inicio), 05 (nombre: "Publicación de
    Instagram: " más el comienzo del texto, que se cruza con el texto del Reel), 07
    (objetivo), 12 (alcance), 13 (gasto) y 156/157 (resultados); gasto por día FAEV04.
    Los anuncios por pieza (FADE, con `boostId`) y los campos pagos de IGRE (14, 16 a
    20) vinieron vacíos.
    - Resultado: sin los 12 Reels que tuvieron plata hasta el 4/11, las conclusiones
      no cambian (mediana 783; recetas de otras cuentas 1.141 contra propios 597;
      efemérides últimas; 19 h mejor que 15 h). El crecimiento del 31/10 al 4/11 y el
      hummus fueron orgánicos: no hubo anuncios del 24/10 al 4/11, y al hummus se le
      puso plata recién el 5/11.
    - Los montos, la tabla de campañas y sus resultados (visitas al perfil, clics a
      las notas, mensajes) están en "La plata en anuncios", en la pestaña "B ·
      Información semanal". No se copian acá porque el repo es público.
    - El audio para Pipi no cambia: todos sus números son orgánicos y se mantienen.
- [x] **Documento principal: "Plan de redes — Puesto de Palta"**
  (https://claude.ai/artifact/2uUFoTooRGhhWfVuKPpnSP). Reemplaza al primero,
  "Competencia en redes y guiones". Desde el 7/11/2026 tiene cinco pestañas (ver
  "Plan de redes reordenado", más abajo).
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
  **Medido el 9/11/2026** (3 días y medio después, sin anuncios): llegó a 396 personas,
  con 823 vistas, 19 me gusta, 1 guardado, 1 compartido, 0 comentarios y 0 seguidores
  nuevos. Un poco menos que la mediana de los carruseles (447) y la mitad que la de los
  Reels (744); guardados y compartidos, 5 cada 1.000 personas contra 11 de los
  carruseles. Anotado en "Los números de la cuenta" (pestaña B) y en Creación. Cómo se
  leyó: IGPO del 5/11 al 9/11 (14 alcance, 28 vistas, 13 me gusta, 15 guardados, 27
  compartidos, 8 comentarios, 29 seguidores); para ver si tuvo plata, las campañas
  desde el 5/11 (FACA03 y 05): solo el hummus y "Comentá PLANTA".
- [x] Rutina semanal de publicaciones: la semana tipo está en la pestaña "A ·
  Información fija" del Plan de redes y en la planilla (pestaña Cómo leerla).

- [x] **Lote de enero y febrero 2027 armado** (pedido por Tomás el 7/11/2026, hecho el
  mismo día).
  - 24 borradores en Metricool (15 posts a Instagram y Facebook, 9 historias solo a
    Instagram), con `draft: true` y `autoPublish: false`, igual que diciembre. Enero: 8
    posts y 6 historias; febrero: 7 posts y 3 historias.
  - Imágenes en Cloudinary, carpeta `puesto-de-palta/redes/enero-febrero-2027/<pieza>/`.
    En la carpeta del proyecto, `redes/enero-febrero-2027/`: una carpeta por pieza con
    sus imágenes y su `texto-y-notas.txt`, `LEEME.txt`, el zip, `metricool.tsv` (ids) y
    `fotos.tsv` (qué foto del Drive se usó en cada pieza, con su id, que no va al repo).
  - Scripts: `scripts/redes/enero_febrero_2027.py` (HTML de cada pieza) y
    `scripts/redes/piezas_enero_febrero_2027.py` (textos, horas, canciones y pedidos a
    Metricool). `subir.py` y `entregar.py` ahora reciben el nombre del lote. Cómo se usa:
    `scripts/redes/README.md`.
  - Cambios contra el calendario: el dato del 21/1 pasó de "400 gramos por persona"
    (viejo, no cerraba con las 33.770 toneladas del 14/1) a la palta que resiste 8 grados
    bajo cero (nota "La palta que resiste el hielo"); el jueves 11/2 va un carrusel de
    investigadoras (Día de la Mujer y la Niña en la Ciencia) en lugar del dato;
    San Valentín (14/2) lo arma Claude, a las 12:00.
  - Faltan, a propósito, las piezas de las notas del 7/2 y el 21/2 (historia, carruseles
    del 9/2 y el 23/2, guiones del 8/2 y el 22/2): se arman en enero con cada nota.
  - Los guiones de los Reels del 11/1 y el 25/1 (notas de Tucumán y Trece pesos) están en
    la pestaña Creación del Plan de redes, con los demás.

  | Fecha y hora | Pieza | Imágenes | Canción | Metricool id | uuid |
  |---|---|---|---|---|---|
  | 5/1 20:00 | Carrusel: El punto exacto 2: cómo saber si está lista sin lastimarla | 6 | Ansiada Maduración | 420014741 | -634943425460417823 |
  | 7/1 20:00 | Post (dato): La palta no madura en el árbol | 1 | Divina Cosecha | 420014971 | -342275286291624984 |
  | 7/1 21:00 | Historia: Curiosidad: la palta no madura en el árbol | 1 | Divina Cosecha | 420014979 | -6009099323051390410 |
  | 10/1 19:00 | Historia: Nota nueva: El tercer intento de Tucumán con la palta | 1 | Mañanas en el Depósito | 420014986 | 8082961545663105310 |
  | 12/1 20:00 | Carrusel: El tercer intento de Tucumán con la palta | 6 | Divina Cosecha | 420015295 | -461361780837888634 |
  | 14/1 20:00 | Post (dato): De 8.100 a 33.770 toneladas | 1 | Interminables Logísticas | 420015301 | 8873021945914148905 |
  | 14/1 21:00 | Historia: Encuesta: ¿comés más palta que antes? | 1 | Interminables Logísticas | 420015309 | 3446942762671229130 |
  | 19/1 20:00 | Carrusel: La palta del sushi: lista y firme a la vez | 6 | La Bella Entrega | 420015603 | 7171192677586520347 |
  | 21/1 20:00 | Post (dato): −8 grados: la palta que resiste el hielo | 1 | Mercado al Alba | 420015613 | -8338500932427428918 |
  | 21/1 21:00 | Historia: Pregunta: ¿cuánto frío aguanta un palto? | 1 | Mercado al Alba | 420015625 | -4792565007787995280 |
  | 24/1 19:00 | Historia: Nota nueva: Trece pesos y un certificado | 1 | Mañanas en el Depósito | 420015637 | 1432739590929272574 |
  | 26/1 20:00 | Carrusel: Trece pesos y un certificado | 7 | Mañanas en el Depósito | 420016069 | -6286087750422673486 |
  | 28/1 20:00 | Post (dato): 30 días en el mar | 1 | Interminables Logísticas | 420016076 | 7742324505825657256 |
  | 28/1 21:00 | Historia: Pregunta: ¿cuánto tarda de Chile a Europa? | 1 | Interminables Logísticas | 420016084 | -3027262539540577986 |
  | 2/2 20:00 | Carrusel: Lo que tirás también es palta | 6 | Temida Facturación | 420016102 | 5677400121914640295 |
  | 4/2 20:00 | Post (dato): El carozo es el 16% de la palta | 1 | Mercado al Alba | 420016452 | 408128523092772226 |
  | 4/2 21:00 | Historia: Encuesta: ¿qué hacés con el carozo? | 1 | Mercado al Alba | 420016473 | 1398838500849895052 |
  | 11/2 20:00 | Carrusel: Investigadoras y palta (Día de la Mujer y la Niña en la Ciencia) | 6 | Mañanas en el Depósito | 420016484 | -3360744350778309297 |
  | 14/2 12:00 | Post: San Valentín: el palto también necesita pareja | 1 | Ansiada Maduración | 420016493 | 7520442844959100026 |
  | 16/2 20:00 | Carrusel: El punto exacto 3: apurarla o frenarla | 6 | Ansiada Maduración | 420016914 | 6923167392989529007 |
  | 18/2 20:00 | Post (dato): 0,72 euros: menos que un café | 1 | Temida Facturación | 420016924 | 5463754828842224505 |
  | 18/2 21:00 | Historia: Curiosidad: 0,72 euros | 1 | Temida Facturación | 420016947 | 6462862635016799388 |
  | 25/2 20:00 | Post (dato): Kenia frenó sus exportaciones de palta | 1 | Interminables Logísticas | 420016962 | 7823914362492174384 |
  | 25/2 21:00 | Historia: Pregunta: ¿por qué frenó Kenia? | 1 | Interminables Logísticas | 420016972 | 633022090592208450 |
- [x] **Notas del blog con fecha** (7/11/2026, con OK de Tomás en la tarjeta de decisión):
  "El tercer intento de Tucumán con la palta" el 10/1/2027 y "Trece pesos y un
  certificado" el 24/1/2027. Arreglos en Notion: en Trece pesos, "En febrero de este año"
  pasó a "En febrero de 2026" (la nota sale en 2027); a Tucumán se le escribió el
  Excerpt. Quedan con fecha todas las notas sin publicar: 9/11, 15/11, 19/11, 29/11,
  13/12, 27/12, 10/1 y 24/1. Ninguna tenía Publicar tildado; Tomás tildó la del 9/11, que
  salió (el aviso fue el 10/11, ver `docs/MIGRACION.md`). Al 10/11, la del domingo 15/11 y
  las siguientes siguen sin tildar (se le avisó). "El carozo que no es basura" (marzo, nunca
  salió, repite otras dos) se mandó a la papelera de Notion el 11/11, con OK de Tomás en la
  tarjeta de decisión.
- [x] **Calendario versión 5 y carpetas por día en el Drive** (7/11/2026). Tomás pidió
  ver en rojo lo que falta, que al subir un archivo terminado con un nombre fijo la
  planilla cambie de color y anote el archivo, y una carpeta por día con copias
  renombradas del material, sin tocar las carpetas originales.
  - Planilla nueva con el mismo nombre (el id está en `redes/drive-ids.md`). La versión 4
    quedó en Mi unidad: el pedido para mandarla a la papelera fue rechazado por permisos
    esta vez, así que la borra Tomás.
  - Estados: rojo lo que falta (Idea, A definir, Planificado por Pipi, Hay que grabar,
    Guion listo), verde claro lo hecho sin publicar (Grabado, Listo para subir, Borrador
    en Notion, Borrador en Metricool) y verde fuerte Publicado. La celda de la fecha toma
    el mismo color. Enero y febrero al día con el lote armado.
  - Columnas nuevas: Carpeta (link "Abrir carpeta"), Archivo final y un ID oculto por
    fila. Pestañas ocultas: Carpetas (la carpeta madre en B1, el id de "Redes por día" en
    B2 y una fila por carpeta con su id en la columna D) y Material (lo que se copia a
    cada carpeta: imágenes de Claude por URL, archivos del Drive y textos).
  - Script de Apps Script: `scripts/redes/apps-script/calendario.gs` (sin ids: los lee de
    la planilla). Tomás lo pega una sola vez desde Extensiones > Apps Script y corre
    "Puesto de Palta > Instalar". Arma REDES PUESTO DE PALTA > Redes por día > un mes >
    una carpeta por publicación ("2027-01-08 vie · Reel · Lo que dice la cáscara"), copia
    el material con nombre (unos 1 GB, casi todo video) y cada hora busca archivos cuyo
    nombre empiece con FINAL: anota el nombre con link en Archivo final y, si el estado
    era de los rojos o Grabado, lo pasa a "Listo para subir". Trabaja de a tandas de 4,5
    minutos (el límite de Google es 6) y sigue en la hora siguiente.
  - Probado con una planilla y un Drive simulados en Node (`prueba/` en
    `redes/calendario/` de la carpeta del proyecto: `node mock_test.js <ruta del .gs>`).
  - Se arma con `v5.py` en `redes/calendario/` de la carpeta del proyecto (lee
    `actual.csv` y `datos.json`, que tiene ids del Drive y no va al repo). **Una vez
    instalado el script, la planilla no se recrea nunca**: se perderían el script y los
    links. Los cambios se hacen a mano en la planilla (el conector de Drive no edita su
    contenido), y Claude le dice a Tomás qué cambiar.
  - 9/11: `v5.py` pasó los Reels a 19 a 21 h (ver Horario, en el diagnóstico). La
    planilla tal como se subió el 7/11 quedó en `redes/calendario/anteriores/`. Al 10/11
    la planilla de Drive seguía con 20 a 22 h (Tomás la editó el 9/11, pero no eso): desde
    el 10/11 lo corrige el script una sola vez, al instalarse (`arreglarHoras_`, con
    Buscar y reemplazar en todas las pestañas). Si Tomás ya lo cambió a mano, no toca nada.
- [x] **Plan de redes reordenado** (7/11/2026, pedido de Tomás para que a Pipi no lo
  maree tanta información). Pestañas, en orden: Guía (cómo trabajar con el plan y la
  planilla, colores, carpetas y FINAL, cómo instalar el script, cómo compartir con Pipi,
  qué falta por persona y cómo seguimos); "A · Información fija" (el lugar de Puesto de
  Palta, las cinco líneas, la semana tipo, quién hace qué, qué hace Claude, tono, música,
  cómo medimos y el material del Drive); "B · Información semanal" (ex Análisis: qué
  cambia en el plan, la competencia, el mapa, los números de la cuenta y lo pago; se
  actualiza los lunes); Creación (por fecha, con un índice por tipo: notas del blog,
  borradores de cada mes, guiones de Reels, temas de Tom especialista y guiones de
  reserva); Calendario (link a la planilla, cómo se armó y qué cambió en diciembre y en
  enero y febrero).
- [x] **Material ya usado y Material para usar** (10/11/2026). Tomás preguntó por "una
  carpeta con todo lo usado en drive y una carpeta con todo lo que está para usar". Lo
  arma el mismo script de la planilla (`ordenarMaterial_` en `calendario.gs`):
  - En REDES PUESTO DE PALTA, "Material ya usado" y "Material para usar", cada una con
    Fotos y Videos, llenas de **accesos directos** a los originales (no copias: no ocupan
    lugar ni tocan IMAGEN Y VIDEO).
  - Ya usado: lo que está en YA USADAS y YA USADOS (el sistema que ya usaban Tomás y
    Pipi), lo que usa el calendario (los archivos "drive" de la pestaña Material y la
    lista "Usado en el calendario (lo actualiza Claude).csv") y las otras copias con el
    mismo nombre (en el Drive hay fotos subidas dos veces). Para usar: el resto de las
    fotos y videos sueltos de IMAGEN y VIDEO. Las otras subcarpetas (Familia Palta,
    Recursos varios, Posibles futuros reels, Reacciones crudas, RECURSOS VIDEO) no entran.
  - La lista CSV está en el Drive, dentro de Material ya usado (ids en
    `redes/drive-ids.md`): Archivo, Id y Dónde se usa. Tiene las fotos de los carruseles,
    posts e historias de diciembre a febrero (que no están en la pestaña Material), los
    archivos de los Reels y recetas, y DSC_0896 (ya salió en enero de 2026). La arma
    `redes/calendario/lista_usado.py` (carpeta del proyecto) con `datos.json`, los
    `fotos.tsv` de cada lote (el de diciembre se armó el 10/11 con los nombres de
    `diciembre_2026.py`) y el listado público de IMAGEN y VIDEO. **Con cada lote nuevo:**
    dejar su `fotos.tsv`, correr el script y subir el CSV con el mismo nombre (el
    conector de Drive no cambia el contenido de un archivo: se sube uno nuevo y el
    script de la planilla usa el más nuevo).
  - Se repasa una vez por día (o con "Armar las carpetas ahora"): si un original pasa a
    YA USADAS o lo empieza a usar el calendario, su acceso directo se muda; lo nuevo
    aparece en para usar; lo borrado se saca. Si no encuentra IMAGEN o VIDEO, no saca
    nada y lo avisa.
  - Con el Drive del 10/11: 154 en ya usado (112 fotos y 42 videos) y 917 para usar (869
    fotos y 48 videos). Son unos 1.070 accesos directos: el primer armado lleva varias
    vueltas de una hora, después de las carpetas de cada día.
  - Probado con el Drive simulado (`prueba/mock_test.js`, versión 2: 46 chequeos) y con
    una simulación hecha con el listado real de IMAGEN y VIDEO.
- [x] **Tareas programadas** de redes (todas vuelven a este hilo): revisión semanal de la
  competencia (lunes 8:53); medir el carrusel del 5/11 (9/11, 8:45, hecho); balance de
  diciembre (4/1/2027, 10:17: carruseles contra 450, recetas propias contra las de otras
  cuentas, prueba de letras); escribir la nota del 7/2 y sus piezas (19/1/2027, 10:17);
  escribir la nota del 21/2 y sus piezas (2/2/2027, 10:17). Horas de Buenos Aires.

## 5. Contexto que dio Tomás (5/11/2026)

- Tiene un CM que maneja las redes y están bastante activas. Este trabajo es para
  sumarle contenido, no para reemplazarlo. **El CM es hombre y se llama Pipi**: desde
  el 5/11/2026 se lo nombra así en todo (planilla, Plan de redes, mensajes).
- Estilo de la cuenta: los textos de los posts van con letras especiales (caracteres
  Unicode en negrita cursiva, como "𝑯𝒖𝒃𝒐 𝒖𝒏 𝒕𝒊𝒆𝒎𝒑𝒐"); los hashtags, en letra común.
  Para plantear en el diagnóstico: Instagram no las toma como palabras en la búsqueda y
  los lectores de pantalla las leen mal.
- Tomás tiene un álbum de música hecho con IA para Puesto de Palta y usa esas
  canciones en Instagram (ver sección 7).
- **Entregas:** de lunes a sábado, feriados incluidos. No hay entregas los domingos, el
  25/12 ni el 1/1 (dato del 6/11/2026). Zonas: no las pasó; en las piezas, "consultá
  por WhatsApp".
- **Este verano (2026-2027) no hay mango**, por ahora. **Colaboraciones con clientes:**
  no darlas por hechas; a lo sumo algún intento o propuesta.
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
  y un certificado" y "El tercer intento de Tucumán" no repiten nada y quedan. El 11/11,
  con OK de Tomás, también se mandó a la papelera "El carozo que no es basura" (15/3,
  nunca publicada), que contaba lo mismo que "El naranja que nadie miraba" y "El carozo
  que tiñe".
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
  los archivos sueltos de VIDEO e IMAGEN (sección 3). Subcarpetas (10/11/2026): en IMAGEN,
  YA USADAS (41 fotos que ya salieron), Familia Palta (imágenes y videos hechos con IA) y
  Recursos varios (overlays); en VIDEO, YA USADOS (1 video), Posibles futuros reels (1
  video crudo), Reacciones marzo abril mayo 2026 crudas y RECURSOS VIDEO. Al lado de
  IMAGEN Y VIDEO, el script de la planilla arma "Redes por día", "Material ya usado" y
  "Material para usar" (sección 4).
- **Cómo se leen desde el entorno de Claude** (las carpetas son públicas con enlace; los
  ids se sacan del link que pase Tomás o con la búsqueda del conector de Drive):
  - Listado de una carpeta: `https://drive.google.com/embeddedfolderview?id=<carpeta>`
  - Miniatura: `https://drive.google.com/thumbnail?id=<archivo>&sz=w220`
  - Descarga: `https://drive.usercontent.google.com/download?id=<archivo>&export=download&confirm=t`
  - Planilla entera: `https://docs.google.com/spreadsheets/d/<id>/export?format=xlsx`
    (el conector de Drive solo devuelve unas filas de muestra).
  - Audio de videos: ffmpeg a 16 kHz mono y faster-whisper (modelo small), pasándole el
    audio ya leído con numpy; abrir el archivo directo falla por la versión de PyAV.
- **Inventario:** 85 videos sueltos (unos 16 minutos en total) y 948 imágenes. Al
  10/11/2026, contando lo que no es foto ni video: 965 archivos sueltos en IMAGEN y 92
  en VIDEO.

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

## 7. Música de Puesto de Palta (6/11/2026)

Álbum **"El ritual de la palta"**, del artista **PUESTO DE PALTA**, hecho con IA por
Tomás. Está en Spotify, Deezer (álbum 946500401), Apple Music e Instagram, y es la
música que ya usan en la cuenta. Las canciones son instrumentales. Lo de abajo sale de
escuchar la muestra de 30 segundos de cada una (tempo, energía, cuánta percusión).

| Canción | Duración | Cómo suena | Para qué |
|---|---|---|---|
| Divina Cosecha | 2:27 | Alegre y festiva, con cortes que vuelven a arrancar | Origen, cosecha, cierre del año, de la planta a la mesa |
| Interminables Logísticas | 2:56 | La más rítmica: batería y bajo marcados, como un motor | Pedidos, cajones, viajes de la palta, montajes rápidos |
| Mercado al Alba | 1:38 | Fluida y luminosa, con poca percusión; la más corta | Mañanas, mercado, desayunos, datos livianos |
| Mañanas en el Depósito | 3:11 | La más tranquila, un poco melancólica | Detrás de escena tranquilo, historias y notas del blog con voz |
| Ansiada Maduración | 3:00 | Lenta, casi sin percusión, con acordes largos | El punto de la palta (es la de la serie "El punto exacto"), cámara lenta, San Valentín |
| La Bella Entrega | 3:28 | Alegre y saltarina, la de más ritmo para arriba | Entregas, pedidos de las Fiestas, recetas, la semana del sushi |
| Temida Facturación | 2:48 | Brillante y juguetona | Humor, reacciones, precios y datos con giro |

- Con voz en off, Mañanas en el Depósito y Ansiada Maduración dejan más lugar a la
  voz; con las otras, bajar el volumen.
- Claude no hace Reels. En los carruseles y posts, la música la pone Tomás o Pipi al
  publicar desde Instagram (Metricool no les pone música). En un Reel subido por
  Metricool se puede elegir la canción por nombre (`audioConfiguration`), pero arranca
  desde el segundo 0; el tramo se elige solo en Instagram.
- La planilla del calendario tiene una columna "Música" con la sugerida por pieza.
