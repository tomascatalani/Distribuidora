# Puesto de Palta — contexto para Claude Code

Este repo es la web y el blog de **puestodepalta.com**, antes administrados desde
Genspark y en migración a Claude Code. El dueño es Tomás Catalani (no programador).

## Leer primero

**Antes de hacer cualquier cosa, leé `docs/MIGRACION.md` completo.** Tiene la
arquitectura, los servicios externos, la configuración literal del workflow de
contenido, el plan por etapas, el estado actual y la checklist pendiente. Es la
fuente de verdad del proyecto. Actualizá su sección 6 al final de cada sesión.

## Reglas de trabajo

- Hablar con Tomás en **español simple**, sin jerga. Explicar qué se hace y por qué.
- **Nunca** escribir claves, tokens ni contraseñas en el repo ni en los documentos.
  Se leen solo de variables de entorno (ver `docs/MIGRACION.md`, sección 4).
- Pedir OK a Tomás antes de cambios que afecten el sitio en producción. Las
  correcciones en la rama de trabajo y la documentación no necesitan OK.
- No tocar el proyecto de Cloudflare Pages de producción hasta que la URL de prueba
  esté verificada.
- No mandar notificaciones reales (Brevo, OneSignal) en pruebas. Usar Publicar en
  falso y KV separado.

## Stack en una línea

Hono + TypeScript + Vite, desplegado en Cloudflare Pages. Contenido en Notion.
Emails en Brevo. Push en OneSignal. Imágenes en Cloudinary. Cron externo en cron-job.org.

## Comandos

```
npm install        # dependencias
npm run typecheck  # chequeo de tipos
npm run build      # compila a dist/
npm run preview    # wrangler pages dev dist (local; NO funciona en el entorno web de Claude Code)
```

Para probar el Worker en el entorno web: importar `dist/_worker.js` desde Node con un
KV en memoria (ver `docs/MIGRACION.md`, sección 6).

## Contenido del blog

`/nota-semanal` (`.claude/skills/nota-semanal/SKILL.md`) genera una nota nueva y la
deja como borrador en Notion. Scripts en `scripts/contenido/`. Nunca tildar Publicar
desde el código: eso lo decide Tomás.

## Despliegue

Cada push a `main` despliega puestodepalta.com (Cloudflare Pages, proyecto
`puesto-de-palta-web`). Tomás autorizó pushes directos a `main` para cambios chicos y
documentación; para cambios visuales usar una rama y mostrarle la URL de vista previa
`<rama>.puesto-de-palta-web.pages.dev` antes de mergear.
