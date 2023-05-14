import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		solidPlugin(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
			},
			devOptions: {
				enabled: true
			},
			manifest: {
				"name": "Lewis Campbell Technologies",
				"icons": [
					{
						"src": "img/icon/icon192.png",
						"type": "image/png",
						"sizes": "192x192",
						"purpose": "any maskable"
					},
					{
						"src": "img/icon/icon144.png",
						"type": "image/png",
						"sizes": "144x144"
					},
					{
						"src": "img/icon/icon512.png",
						"type": "image/png",
						"sizes": "512x512"
					}
				],
				"start_url": "/",
				"background_color": "hsl(200, 100%, 20%)",
				"display": "minimal-ui",
				"theme_color": "#000"
			}
		})
	],
	root: 'www',
  build: {
    rollupOptions: {
      input: {
        main: 'www/index.html',
        sync: 'www/sync.html',
        old: 'www/index-old.html',
        old2: 'www/index-old.html'
      }
    }
  }
})

