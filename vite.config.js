import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/web/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'gioi-thieu.html'),
        services: resolve(__dirname, 'dich-vu.html'),
        contact: resolve(__dirname, 'lien-he.html')
      }
    }
  }
})
