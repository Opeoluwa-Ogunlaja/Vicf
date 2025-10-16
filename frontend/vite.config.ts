import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    VitePWA({
      pwaAssets: {
        disabled: false,
        config: true
      },
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectManifest: {
        rollupFormat: 'es'
      },
      injectRegister: 'auto',
      includeAssets: ['fonts/*.woff2'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        clientsClaim: true,
        cleanupOutdatedCaches: true,
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
        enabled: true,
        suppressWarnings: false,
        navigateFallback: 'index.html',
        type: 'module'
      },
      manifest: {
        name: 'Vicf App',
        short_name: 'Vicf',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        description: 'Contact Management for Individuals & Teams',
        theme_color: '#4d4dff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
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
