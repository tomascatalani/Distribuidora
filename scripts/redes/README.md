# Piezas para redes: carruseles, datos e historias

Con esto se armaron el lote 1 (5/11/2026), el lote de diciembre 2026 (6/11) y el de
enero y febrero 2027 (7/11). Es el mismo
diseño que el sitio: Libre Baskerville para los títulos, Open Sans para el texto, y los
colores verde `#4a7c59`, crema `#faf8f4` y negro `#0a0a0a`. Posts de 1080x1350 e
historias de 1080x1920.

Las reglas de redes (borradores siempre, nada se publica sin OK de Tomás, qué datos se
pueden usar) están en `docs/REDES.md`.

## Pasos

Todo se hace en una carpeta de trabajo fuera del repo (por ejemplo, el scratchpad).

1. **Fotos.** Elegirlas entre las que no se usaron (la carpeta "Material para usar" del
   Drive las junta, si el script de la planilla está instalado) y bajarlas a
   `<trabajo>/fotos_full/` (cómo se leen las carpetas: `docs/REDES.md`, sección 6).
2. **Fuentes y logo.** `python3 -I scripts/redes/preparar.py <trabajo>`
3. **HTML de cada pieza.** `python3 -I scripts/redes/diciembre_2026.py <trabajo>`
   (enero y febrero: `enero_febrero_2027.py`). Recorta las fotos y escribe un HTML por
   pieza en `<trabajo>/build/`. Para un lote nuevo, copiar el último y cambiar `CROPS`
   (fotos y encuadre) y `P` (las piezas). En el de enero y febrero, cada recorte puede
   llevar un quinto valor, el brillo: una gamma mayor que 1 (1,25 a 1,35) aclara las
   sombras de las fotos oscuras sin quemar las luces. También suma el formato `band`
   (1080x820, la foto de las historias con texto abajo) y la clase `foto arriba`, que
   pone el texto arriba y deja ver la foto abajo. En el Drive hay nombres repetidos, así
   que cada foto se baja como `n<orden>_<nombre>`; qué foto es cada una (con su id) está
   en la carpeta del proyecto, `redes/<lote>/fotos.tsv`, nunca en el repo.
4. **Dibujar.** `node scripts/redes/render.cjs <trabajo>/build/<pieza>.html <trabajo>/png/<pieza> 1080 1350`
   (historias: `1080 1920`). Usa el Chromium que trae Playwright. Es `.cjs` porque el
   `package.json` del repo pide módulos ES. Todas juntas:
   `for f in <trabajo>/build/*.html; do p=$(basename "$f" .html); case $p in *historia) h=1920;; *) h=1350;; esac; node scripts/redes/render.cjs "$f" <trabajo>/png/$p 1080 $h; done`
   (con los scripts del repo, el lote de diciembre sale igual píxel por píxel).
5. **Revisar.** `python3 -I scripts/redes/preview.py <trabajo>/png <trabajo>/previews`
   arma una hoja por pieza para mirar todo junto.
6. **JPG finales.** `python3 -I scripts/redes/finalizar.py <trabajo>`: calidad 95 y sin
   submuestreo de color, para que el texto quede nítido.
7. **Subir a Cloudinary.** `python3 -I scripts/redes/subir.py <trabajo> <lote>` (por
   ejemplo `enero-febrero-2027`; sin lote usa `diciembre-2026`). Usa el preset sin firma
   y lee `CLOUDINARY_CLOUD_NAME` y `CLOUDINARY_UPLOAD_PRESET` del entorno. Deja las URLs
   en `<trabajo>/urls.json`.
8. **Textos y pedido a Metricool.** `python3 -I scripts/redes/piezas_diciembre_2026.py <trabajo>`
   (enero y febrero: `piezas_enero_febrero_2027.py`)
   tiene el texto, la hora, la canción y las notas de cada pieza, y arma en
   `<trabajo>/payloads/` lo que se le pasa a `createScheduledPost`: siempre con
   `draft: true` y `autoPublish: false`.
9. **Entregar.** `python3 -I scripts/redes/entregar.py <trabajo> /mnt/project-files/redes/<lote>/ <lote> "<título>"`
   copia las imágenes con un `texto-y-notas.txt` por pieza y arma un zip (sin lote ni
   título, arma el de diciembre 2026).
10. **Carpeta del día.** Si la planilla del calendario ya tiene instalado el script, las
   piezas nuevas se suben también a la carpeta de su día en el Drive (REDES PUESTO DE
   PALTA > CALENDARIO Y PLANILLAS > Redes por día). El id de cada carpeta está en la pestaña oculta Carpetas de la
   planilla, columna D (o en el listado público de Redes por día, por nombre). Subirlas
   con un nombre que empiece con FINAL: así entran solas en Material ya usado > Piezas
   terminadas y la planilla anota el archivo final (las que vienen de la pestaña Material
   ya entran sin eso).
11. **Lo usado.** Dejar en `redes/<lote>/fotos.tsv` (carpeta del proyecto) qué foto del
   Drive va en cada pieza, correr `python3 -I lista_usado.py` en `redes/calendario/` y
   subir el CSV que arma al Drive, en REDES PUESTO DE PALTA > MATERIAL (FOTOS Y VIDEOS) >
   Material ya usado, con el mismo nombre ("Usado en el calendario (lo actualiza Claude).csv"). El script de la
   planilla usa el más nuevo y, al otro día, pasa esas fotos de "Material para usar" a
   "Material ya usado". La lista suma también las copias iguales con otro nombre de lo que
   ya se usó (`redes/calendario/iguales.tsv`, revisado a ojo). Las piezas terminadas de la
   planilla (las imágenes de Claude y los FINAL de cada carpeta) entran solas en Material
   ya usado > Piezas terminadas.

Metricool guarda una copia idéntica (byte por byte) de cada imagen que se le pasa, así
que bajarla de Metricool no pierde calidad.

## Audio con voz (por ejemplo, un resumen para Pipi)

Con esto se armó el audio del diagnóstico de Instagram (6/11/2026). Voz sintética de
Piper (`es_AR-daniela-high`, mujer, acento argentino), revisada frase por frase con
Whisper. La primera vez baja el modelo de Whisper (1,6 GB).

1. **Instalar**, en un entorno aparte: `pip install piper-tts faster-whisper num2words`
   (y `ffmpeg`). Bajar `es_AR-daniela-high.onnx` y `.onnx.json` de
   `huggingface.co/rhasspy/piper-voices` (carpeta `es/es_AR/daniela/high`).
2. **Escribir el guion** en un `.txt`, en tono de charla, con un párrafo por tema y una
   línea en blanco entre párrafos. Unas 500 palabras son 2 minutos y medio.
   - La voz no dice bien "Reel": usar "video" (el script igual lo cambia solo).
   - Números delante de palabras femeninas, en letras: "setecientas cincuenta personas".
   - Evitar palabras que se confunden: "rubro" sonaba a "burro" y "golazo" a "bolazo".
     Mejor "el campo" y "la rompió".
3. **Grabar.** `python3 -I scripts/redes/audio.py guion.txt salida.mp3 es_AR-daniela-high.onnx`.
   Tarda unos 10 minutos. Al final lista las frases que se siguen oyendo mal: cambiarles
   las palabras y volver a correrlo, que solo regraba esas.

## Calendario y carpetas por día (Apps Script)

`apps-script/calendario.gs` va pegado en la planilla del calendario (Extensiones > Apps
Script) y se instala una sola vez con el menú "Puesto de Palta > Instalar". No tiene ids:
los lee de las pestañas ocultas Carpetas y Material de la planilla, que arma el
generador del calendario (`v5.py`, en la carpeta privada del proyecto,
`redes/calendario/`).

- **Armar carpetas** (`armarCarpetas`): crea Redes por día > un mes > una carpeta por
  publicación (Redes por día se creó en la carpeta madre; desde el 12/11/2026 está en
  REDES PUESTO DE PALTA > CALENDARIO Y PLANILLAS), pone el link en la columna Carpeta y copia el
  material de la pestaña Material: archivos del Drive (`makeCopy`, con nombre nuevo),
  imágenes de Claude (las baja de su URL) y textos. Lo que ya está no se vuelve a copiar;
  si algo falla, queda anotado y se reintenta en la vuelta siguiente.
- **Material ya usado y para usar** (`ordenarMaterial_`, desde el 10/11/2026): en la
  carpeta madre (desde el 12/11/2026 se llama MATERIAL (FOTOS Y VIDEOS) y está dentro de
  REDES PUESTO DE PALTA) arma esas dos carpetas, cada una con Fotos y Videos, con accesos
  directos (`createShortcut`) a las fotos y videos de IMAGEN Y VIDEO > IMAGEN y VIDEO. Ya
  usado: lo de las subcarpetas YA USADAS / YA USADOS, los archivos "drive" de la pestaña
  Material, lo de la lista "Usado en el calendario (lo actualiza Claude).csv" (por id o
  por nombre; la busca en todo el Drive y usa la más nueva) y las otras copias con el
  mismo nombre. Para usar: el resto de los sueltos. Encuentra las carpetas por nombre.
  Se repasa una vez por día (o con el botón): muda los accesos directos que cambiaron de
  lado y saca los de originales borrados, salvo que falte IMAGEN o VIDEO. Arranca solo
  si a la vuelta le quedan más de 90 segundos, después de las carpetas de cada día.
- **Piezas terminadas** (`piezasTerminadas_`, desde el 11/11/2026): dentro de Material ya
  usado, accesos directos a las piezas de Claude (las filas "url" de la pestaña Material, por
  el link de la columna Hecho) y a los archivos FINAL de las carpetas de cada día. Así ahí
  está todo lo usado. Se arma en el mismo repaso diario.
- **Nunca dos vueltas a la vez** (`conCandado_`, desde el 11/11/2026): la vuelta de cada
  hora, el menú e Instalar usan el candado del script (`LockService`). Si otra está
  trabajando, la de cada hora no hace nada y el menú avisa que hay que esperar. Además, la
  de cada hora borra los avisos de cada hora repetidos.
- **Limpieza de repetidos** (`limpiarRepetidos_`): el 11/11/2026 la instalación corrió dos
  veces a la vez (se tocó Instalar de nuevo mientras trabajaba) y dejó un mes repetido,
  carpetas de publicación repetidas y copias repetidas. Se queda con la carpeta anotada en
  la columna D de Carpetas (y con el mes que tiene más anotadas), le pasa lo que había en
  las repetidas (también lo que no armó el script) y manda las repetidas a la papelera. En
  cada carpeta deja una sola copia de cada archivo del material: la del link de Hecho, o la
  más vieja (y corrige Hecho). Un archivo con el mismo nombre y otro tamaño (una versión que
  alguien editó) no se toca. Los links de la columna Carpeta del calendario se corrigen si
  apuntan a otra carpeta. Si Material ya usado, Material para usar o sus carpetas quedan
  repetidas, las junta (`unica_`) y saca los accesos directos repetidos. Lo repasa una vez
  por día y con cada toque del menú. Al instalar: tocar Instalar una sola vez y esperar el
  cartel (puede tardar 5 minutos).
- **Buscar finales** (`buscarFinales`): busca archivos cuyo nombre empiece con FINAL,
  mira en qué carpeta de publicación están, escribe el nombre con link en Archivo final
  y pasa el estado a "Listo para subir" si estaba en uno de los rojos o en Grabado. No
  toca lo publicado.
- **Una sola vez, al instalar** (`arreglarHoras_`): cambia "20 a 22 h" por "19 a 21 h" (y
  la frase del horario de Qué cambió) en toda la planilla. Queda anotado en las
  propiedades del documento para no repetirlo.
- Corre cada hora (`cadaHora`) y en tandas de 4,5 minutos, porque Google corta a los 6.
- Saltea lo que está en la papelera (carpetas y archivos), por si `getFiles` lo devuelve.
- **Probarlo sin Google:** en la carpeta del proyecto, `redes/calendario/prueba/`, hay
  una planilla y un Drive simulados: `node mock_test.js scripts/redes/apps-script/calendario.gs`
  (desde la raíz del repo, con la ruta completa de `mock_test.js`).
- **Mover o renombrar carpetas:** la carpeta madre y Redes por día se pueden mover o
  renombrar, porque el script las busca por id (celdas B1 y B2 de la pestaña Carpetas).
  Lo que está dentro de la madre no: IMAGEN Y VIDEO (con IMAGEN y VIDEO), Material ya
  usado y Material para usar se buscan por nombre, y si faltan los dos Material, los
  crea vacíos. La prueba simulada tiene ese caso (el 16).
- **La planilla no se recrea** una vez instalado el script: se perderían el script y los
  links de las carpetas.
