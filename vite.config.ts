import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/emotion-healer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '心晴小屋 - 情绪陪伴',
        short_name: '心晴小屋',
        description: '记录情绪，释放压力，小动物陪伴你度过每一天',
        theme_color: '#fdf6ed',
        background_color: '#fdf6ed',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/emotion-healer/',
        icons: [
          { src: '/emotion-healer/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/emotion-healer/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/emotion-healer/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
