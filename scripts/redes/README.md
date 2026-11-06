# Piezas para redes: carruseles, datos e historias

Con esto se armaron el lote 1 (5/11/2026) y el lote de diciembre 2026. Es el mismo
diseño que el sitio: Libre Baskerville para los títulos, Open Sans para el texto, y los
colores verde `#4a7c59`, crema `#faf8f4` y negro `#0a0a0a`. Posts de 1080x1350 e
historias de 1080x1920.

Las reglas de redes (borradores siempre, nada se publica sin OK de Tomás, qué datos se
pueden usar) están en `docs/REDES.md`.

## Pasos

Todo se hace en una carpeta de trabajo fuera del repo (por ejemplo, el scratchpad).

1. **Fotos.** Bajar del Drive las fotos elegidas a `<trabajo>/fotos_full/` (cómo se
   leen las carpetas: `docs/REDES.md`, sección 6).
2. **Fuentes y logo.** `python3 -I scripts/redes/preparar.py <trabajo>`
3. **HTML de cada pieza.** `python3 -I scripts/redes/diciembre_2026.py <trabajo>`.
   Recorta las fotos y escribe un HTML por pieza en `<trabajo>/build/`. Para un lote
   nuevo, copiar el archivo y cambiar `CROPS` (fotos y encuadre) y `P` (las piezas).
4. **Dibujar.** `node scripts/redes/render.cjs <trabajo>/build/<pieza>.html <trabajo>/png/<pieza> 1080 1350`
   (historias: `1080 1920`). Usa el Chromium que trae Playwright. Es `.cjs` porque el
   `package.json` del repo pide módulos ES. Todas juntas:
   `for f in <trabajo>/build/*.html; do p=$(basename "$f" .html); case $p in *historia) h=1920;; *) h=1350;; esac; node scripts/redes/render.cjs "$f" <trabajo>/png/$p 1080 $h; done`
   (con los scripts del repo, el lote de diciembre sale igual píxel por píxel).
5. **Revisar.** `python3 -I scripts/redes/preview.py <trabajo>/png <trabajo>/previews`
   arma una hoja por pieza para mirar todo junto.
6. **JPG finales.** `python3 -I scripts/redes/finalizar.py <trabajo>`: calidad 95 y sin
   submuestreo de color, para que el texto quede nítido.
7. **Subir a Cloudinary.** `python3 -I scripts/redes/subir.py <trabajo>`. Usa el preset
   sin firma y lee `CLOUDINARY_CLOUD_NAME` y `CLOUDINARY_UPLOAD_PRESET` del entorno.
   Deja las URLs en `<trabajo>/urls.json`.
8. **Textos y pedido a Metricool.** `python3 -I scripts/redes/piezas_diciembre_2026.py <trabajo>`
   tiene el texto, la hora, la canción y las notas de cada pieza, y arma en
   `<trabajo>/payloads/` lo que se le pasa a `createScheduledPost`: siempre con
   `draft: true` y `autoPublish: false`.
9. **Entregar.** `python3 -I scripts/redes/entregar.py <trabajo> /mnt/project-files/redes/<lote>/`
   copia las imágenes con un `texto-y-notas.txt` por pieza y arma un zip.

Metricool guarda una copia idéntica (byte por byte) de cada imagen que se le pasa, así
que bajarla de Metricool no pierde calidad.
