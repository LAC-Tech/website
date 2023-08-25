import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		solidPlugin(),
	],
	build: {
		outDir: "../../www/sync"
	}
})
