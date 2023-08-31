import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid';
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		solidPlugin(),
		viteSingleFile()
	],
	build: {
		outDir: "../../www",
		rollupOptions: {
      input: "sync.html"
    }
	}
})
