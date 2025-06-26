import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import { fileURLToPath } from 'url'
import pkg from './package.json'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueDatePicker',
      formats: ['es', 'umd'],
      fileName: 'vue-datepicker'
    },
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
})
