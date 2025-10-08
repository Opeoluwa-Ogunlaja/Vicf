import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), VitePWA({
      pwaAssets: {},
      registerType: 'autoUpdate',
      strategies: "generateSW",
      workbox: {
        importScripts: ['/src/service-worker.js'],
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true
      },
      srcDir: "src",
      filename: "service-worker.js",
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      injectRegister: null,
      manifest: {
        "name": "Vicf App",
        "short_name": "Vicf",
        "start_url": ".",
        "display": "standalone",
        "background_color": "#ffffff",
        "description": 'Contact Management for Individuals & Teams',
        "theme_color": "#4d4dff"
      }
    })],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    target: 'esnext'
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    fs: {
      strict: false
    }
  },
  base: '/'
})
