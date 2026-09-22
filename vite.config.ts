import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { writeFileSync, copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Plugin to inject static files and fix _routes.json after build
function staticFilesPlugin() {
  return {
    name: 'static-files-and-routes',
    closeBundle() {
      // Fix _routes.json to exclude static files from Worker routing
      const routesPath = resolve(__dirname, 'dist/_routes.json')
      const routes = {
        version: 1,
        include: ['/*'],
        exclude: [
          '/fonts/*',
          '/images/*',
          '/static/*',
          '/OneSignalSDKWorker.js',
          '/favicon.svg',
          '/favicon.ico',
          '/favicon-512.png',
          '/og-image.jpg',
          '/icon-512.png'
        ]
      }
      writeFileSync(routesPath, JSON.stringify(routes))
      console.log('✓ _routes.json patched with static file exclusions')

      // Copy OneSignalSDKWorker.js to dist root
      const workerSrc = resolve(__dirname, 'public/OneSignalSDKWorker.js')
      const workerDst = resolve(__dirname, 'dist/OneSignalSDKWorker.js')
      if (existsSync(workerSrc)) {
        copyFileSync(workerSrc, workerDst)
        console.log('✓ OneSignalSDKWorker.js copied to dist/')
      }

      // Copy favicon.svg to dist root
      const faviconSrc = resolve(__dirname, 'public/favicon.svg')
      const faviconDst = resolve(__dirname, 'dist/favicon.svg')
      if (existsSync(faviconSrc)) {
        copyFileSync(faviconSrc, faviconDst)
        console.log('✓ favicon.svg copied to dist/')
      }

      // Copy favicon.ico to dist root
      const faviconIcoSrc = resolve(__dirname, 'public/favicon.ico')
      const faviconIcoDst = resolve(__dirname, 'dist/favicon.ico')
      if (existsSync(faviconIcoSrc)) {
        copyFileSync(faviconIcoSrc, faviconIcoDst)
        console.log('✓ favicon.ico copied to dist/')
      }

      // Copy favicon-512.png to dist root
      const favicon512Src = resolve(__dirname, 'public/favicon-512.png')
      const favicon512Dst = resolve(__dirname, 'dist/favicon-512.png')
      if (existsSync(favicon512Src)) {
        copyFileSync(favicon512Src, favicon512Dst)
        console.log('✓ favicon-512.png copied to dist/')
      }
    }
  }
}

export default defineConfig({
  plugins: [
    build({
      entry: 'src/index.tsx',
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    staticFilesPlugin()
  ],
  build: {
    outDir: 'dist'
  }
})
