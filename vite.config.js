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
			devOptions: {
				enabled: true
			}
		})
	],
	root: 'www',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sync: resolve(__dirname, 'sync.html'),
        'new-old': resolve(__dirname, 'index-old.html')
      }
    }
  }
})


