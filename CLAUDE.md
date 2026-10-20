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
npm install      # dependencias
npm run build    # compila a dist/
npm run preview  # wrangler pages dev dist (local)
```
