import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid';

// Reloading CSS files
function CustomHmr() {
  return {
    name: 'custom-hmr',
    enforce: 'post',
    // HMR
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.css')) {
        console.log('reloading css file...');

        server.ws.send({
          type: 'full-reload',          
          path: '*'
        });
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solidPlugin(), CustomHmr()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sync: resolve(__dirname, 'sync.html')
      }
    }
  }
})
