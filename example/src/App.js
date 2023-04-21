import React from 'react'
import { Canvas } from '@react-three/offscreen'

// This is the fallback component that will be rendered on the main thread
// This will happen on systems where OffscreenCanvas is not supported
const Scene = React.lazy(() => import('./worker/Scene'))

export default function App() {
  const [worker] = React.useState(() => new Worker(new URL('./worker/index.js', import.meta.url)))
  return <Canvas camera={{ position: [0, 0, 20], fov: 25 }} worker={worker} fallback={<Scene />} />
}
