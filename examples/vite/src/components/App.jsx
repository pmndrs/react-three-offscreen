import React, { useState, lazy } from 'react'
import { Canvas } from '@react-three/offscreen'

// This is the fallback component that will be rendered on the main thread
// This will happen on systems where OffscreenCanvas is not supported
const Scene = lazy(() => import('./Scene'))

export default function App() {
  const [worker] = useState(() => new Worker(new URL('./worker.jsx', import.meta.url), { type: 'module' }))
  return <Canvas camera={{ position: [0, 0, 10], fov: 25 }} worker={worker} fallback={<Scene />} />
}
