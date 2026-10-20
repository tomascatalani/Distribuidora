# puestodepalta.com

Web y blog de Puesto de Palta. Hono + TypeScript, desplegado en Cloudflare Pages.
El contenido del blog vive en Notion; los emails en Brevo; las imágenes en Cloudinary.

**Toda la documentación está en [`docs/MIGRACION.md`](docs/MIGRACION.md)**: arquitectura,
servicios, variables, workflow de contenido, plan y estado actual.

## Correr en la computadora

```
npm install
cp .dev.vars.example .dev.vars   # y completar las claves
npm run build
npm run preview                   # abre http://localhost:8788
```

## Despliegue

Cada push a la rama principal despliega solo en Cloudflare Pages (proyecto conectado
a GitHub). No hace falta correr nada a mano.
