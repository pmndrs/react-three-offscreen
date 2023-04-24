import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // https://github.com/vitejs/vite-plugin-react/issues/151
  // https://stackoverflow.com/questions/73815639/how-to-use-jsx-in-a-web-worker-with-vite
  plugins: [react({ fastRefresh: false })],
  worker: {
    plugins: [react({ fastRefresh: false })],
  },
})
