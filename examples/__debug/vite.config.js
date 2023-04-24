import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log(__dirname, path.resolve(__dirname, '/node_modules/three'))

export default defineConfig({
  // https://github.com/vitejs/vite-plugin-react/issues/151
  // https://stackoverflow.com/questions/73815639/how-to-use-jsx-in-a-web-worker-with-vite
  plugins: [react({ fastRefresh: false })],
  worker: {
    plugins: [react({ fastRefresh: false })],
  },
  resolve: {
    alias: {
      '@react-three/offscreen': '../../../../src',
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@react-three/fiber': path.resolve(__dirname, './node_modules/@react-three/fiber'),
      three: path.resolve(__dirname, './node_modules/three'),
    },
  },
})
