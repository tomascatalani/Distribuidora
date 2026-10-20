---
name: nota-semanal
description: Genera una nota nueva para el blog de Puesto de Palta — investiga un tema fresco sobre la palta, la escribe con la voz de Tomás, crea la portada, la sube a Cloudinary, la carga como borrador en Notion y le avisa a Tomás por mail. Usar cuando Tomás pida "generá la nota de la semana", "escribí una nota sobre X", o cuando lo dispare la rutina de los lunes.
---

# Nota semanal del blog paltero

Reemplaza el workflow que corría en Genspark. La configuración literal original está
en `docs/MIGRACION.md`, sección 3 y Anexo A. Este archivo es autosuficiente: seguilo
de arriba a abajo. Las partes mecánicas son scripts; la investigación y la redacción
las hacés vos.

**Siempre corré los scripts desde la raíz del repo, con el proxy de red de Node:**

```
export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt
```

(Fuera del entorno de Claude Code en la web esas dos variables son inofensivas.)

Variables necesarias en el entorno: `NOTION_TOKEN`, `NOTION_DB_ID`,
`NOTION_STYLE_GUIDE_ID`, `BREVO_API_KEY`, `CF_AI_TOKEN`, `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_UPLOAD_PRESET`. Si falta alguna, el script lo dice y se corta: avisale a
Tomás cuál falta y dónde cargarla (menú del entorno → Edit → Environment variables).

Los archivos intermedios van en `.contenido/` (ignorado por git).

## Modo

- **Automático** (sin tema dado): hacer los 7 pasos.
- **Manual** ("escribí una nota sobre X"): saltear la búsqueda de tema del paso 2,
  pero igual investigar fuentes reales sobre X y respetar lista negra y repetición.

## Paso 1 — Contexto

```
node scripts/contenido/1-contexto.mjs
```

Leé `.contenido/contexto.json` completo. Contiene:
- `guiaDeVoz`: la guía de voz y estilo, en vivo desde Notion. **Releela entera antes de escribir.**
- `titulos`: todos los títulos de la base (publicados y borradores). Son temas ya cubiertos.
- `fuentesRecientes`: URLs usadas en los últimos 5 artículos. No repetirlas.

## Paso 2 — Investigación (máximo 4 búsquedas web)

Buscá con la herramienta de búsqueda web, **como máximo 4 búsquedas**, directas y precisas.

**Antigüedad:** fuentes de menos de 90 días. Priorizar los últimos 30; si no hay material
original, ampliar a 31-90 días; nunca más de 90.

**Áreas temáticas, en orden de prioridad:**
1. **Crecimiento nacional (PRIORIDAD):** expansión del cultivo de palta en Argentina,
   nuevas hectáreas, inversiones en aceite de palta y derivados a nivel país, marcas
   argentinas de aceite de palta, exportaciones nacionales, políticas agrícolas locales,
   emprendimientos argentinos con palta.
2. **Ciencia e innovación:** bioplásticos del carozo, aceites, compuestos bioactivos, estudios clínicos.
3. **Ecología:** cultivos que destruyen ecosistemas, metales pesados en Perú, uso del agua, monocultivos.
4. **Industria y economía:** producción mundial, nuevos mercados, exportaciones, cambios en la cadena de valor.
5. **Derivados:** productos derivados, beneficios, innovaciones, usos, cultura.
6. **Historia y cultura:** palta en culturas precolombinas, nombres y significados, gastronomía histórica.
7. **Tendencias globales:** consumo per cápita por país, platos nuevos, usos cosméticos, palta y mascotas.
8. **Investigación de frontera:** nuevos usos industriales, veterinaria, polvo de palta, colorantes naturales.

**Línea editorial pro-palta:** el fruto NUNCA queda mal parado. Temas crudos sobre la
cadena (narcotráfico, agua, deforestación, explotación, intermediarios, logística):
permitidos. Ángulos anti-fruto ("la palta no es sana", "engorda", "es un lujo
innecesario"): prohibidos. Si un dato negativo del fruto aparece, se contextualiza
("tiene grasa, pero es grasa monoinsaturada").

**Lista negra (prioridad absoluta, se descartan aunque haya fuentes nuevas):**
- Carozo/semilla de palta como colorante o tinte
- Aguacates resistentes al frío en Florida / Universidad de Florida / José Chaparro
- Conservación de palta en el mar / transporte marítimo prolongado
- China como productor y no solo comprador de palta
- Lo que la comunidad tira al agua puede salvar el agua
- **Más todos los `titulos` de `contexto.json`**, comparando tema central (semántico,
  no solo literal). Mismo tópico = descarte.

**Plan B** (solo si no hay nada fresco, original o sorprendente en 90 días):
1. *Recetas extrañas con palta:* atípicas o contraintuitivas con palta como
   ingrediente central. No guacamole ni tostadas. Postres, fermentados, bebidas,
   cocina molecular, platos de países lejanos. Contarla como historia: origen, quién la
   inventó, por qué funciona. Es una crónica sobre una receta rara, no un recetario.
2. *Datos nutricionales con profundidad:* no "la palta tiene vitamina E". Sí contexto
   científico real, comparaciones inesperadas, estudios específicos (composición
   lipídica, fitoesteroles, perfil por variedad Hass vs Fuerte vs Bacon). Citar papers
   reales con precisión.

Guardá el resultado en `.contenido/investigacion.json`:

```json
{
  "tema_seleccionado": { "tema": "", "justificacion": "", "es_evergreen": false },
  "fuentes": [ { "titulo_fuente": "", "url": "", "fecha_publicacion": "YYYY-MM-DD", "resumen_hallazgo": "" } ],
  "temas_descartados": [ { "tema": "", "motivo": "" } ]
}
```

## Paso 3 — Redacción

Escribí el artículo en español rioplatense siguiendo la `guiaDeVoz` al pie de la letra.

**Estructura obligatoria**
- **Título:** breve, sin clickbait, sin signos de exclamación, sin números de lista
  ("5 cosas…"). Que genere curiosidad desde la sobriedad. Ejemplos del tono correcto:
  "El carozo que no es basura", "Por qué Perú tiene un problema con sus paltas",
  "Antes de que la llamen superfood, ya era sagrada".
- **Apertura:** una imagen concreta, un dato extraño, una anécdota o una pregunta sin
  respuesta fácil. NUNCA una definición. NUNCA "En este artículo vamos a ver…".
- **Desarrollo:** de lo particular hacia lo amplio: el dato → su contexto → su implicancia.
- **Cierre:** abierto. No resuelve todo. Una imagen, una pregunta retórica o una idea flotando.

**Tono:** directo, sin adornos vacíos. Curioso, no experto omnisciente. Sobrio: sin
emojis, sin exclamaciones, sin hipérboles. No mencionar a Puesto de Palta. Sin llamado
a la acción ni lenguaje de marketing. Argot rioplatense solo cuando surge solo.

**Extensión:** 400 a 700 palabras. Nunca más de 900. Alternar oraciones cortas
(impacto) con largas (análisis).

**Prueba final:** debe poder confundirse con algo que Tomás escribió un martes a las 11
de la noche, con mate, después de leer algo que le voló la cabeza. No debe sonar a IA,
ni a resumen, ni a nota escolar.

**Slug:** título en minúsculas, sin tildes, palabras separadas por guiones
("El carozo que no es basura" → `el-carozo-que-no-es-basura`). Sin tildes ni eñes.

Guardá `.contenido/articulo.json`:

```json
{
  "titulo": "",
  "slug": "",
  "contenido_markdown": "Párrafos separados por una línea en blanco. Se permite **negrita** y *cursiva*. Sin títulos ni listas.",
  "fuentes_usadas": [ { "titulo": "", "url": "", "fecha": "YYYY-MM-DD" } ]
}
```

## Paso 4 — Portada

Escribí un prompt **en inglés**, adaptado al tema, que lo evoque de forma visual y no
literal. Fotografía editorial, artesanal, sobria. Paleta: verde palta `#3D8B27`, negro
`#0a0a0a`, blanco, madera `#8B6914`, crema `#faf8f4`. Sin texto, sin logos, sin
personas ni manos. Preferir frutas enteras, escenas (tierra, madera, huerta, mercado,
luz de ventana) antes que cortes perfectos: a Tomás los cortes le parecieron "de
plástico". El script agrega solo el estilo fotográfico y el negative prompt.

```
node scripts/contenido/3-imagen.mjs <slug> "<prompt en inglés>"
```

Imprime la URL pública de Cloudinary. Agregala a `.contenido/articulo.json` como
`"imagen_url"`. Mirá la imagen generada (`.contenido/<slug>.jpg`) y, si Tomás está en
la sesión, mostrásela. **Cuota: la capa gratuita permite unas 4 imágenes por día.**
Regenerar como máximo 2 veces; si se agota, avisar y seguir con la URL que haya.

## Paso 5 — Borrador en Notion

```
node scripts/contenido/4-notion-borrador.mjs .contenido/articulo.json
```

Crea la página con Title, Slug, Fecha (hoy), Publicar **destildado** e Imagen; cuerpo
solo párrafos y las fuentes al final. Avisa si el largo está fuera de regla. Guarda en
el mismo JSON `notion_url`, `notion_page_id`, `palabras`.

## Paso 6 — Aviso a Tomás

```
node scripts/contenido/5-avisar.mjs .contenido/articulo.json
```

## Paso 7 — Informe en el chat

Contale a Tomás, en español simple: el título, el tema y por qué se eligió, los temas
descartados y el motivo, el link de Notion, la portada, y recordale que la nota sale
cuando tilde **Publicar** (si le pone fecha futura, sale ese día a las 9:00 y el aviso
a suscriptores va solo). Nunca tildes Publicar vos.
