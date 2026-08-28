import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    // Use happy-dom so Vue components can render in a browser-like environment
    environment: 'happy-dom',
    globals: true,
  },
})
