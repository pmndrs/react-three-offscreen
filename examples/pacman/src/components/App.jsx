import React, { lazy } from 'react'
import { Canvas } from '@react-three/offscreen'

const Scene = lazy(() => import('./Scene'))

const worker = new Worker(new URL('./worker.jsx', import.meta.url), { type: 'module' })

export default function App() {
  return (
    <Canvas
      eventPrefix="client"
      eventSource={document.getElementById('root')}
      camera={{ position: [-50, -25, 150], fov: 15 }}
      worker={worker}
      fallback={<Scene />}
    />
  )
}
