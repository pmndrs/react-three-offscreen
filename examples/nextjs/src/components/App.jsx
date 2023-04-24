"use client"

import React, { lazy } from 'react'
import { Canvas } from '@react-three/offscreen'

// This is the fallback component that will be rendered on the main thread
// This will happen on systems where OffscreenCanvas is not supported
const Scene = lazy(() => import('@/components/Scene'))

// This is the worker thread that will render the scene
const worker = new Worker(new URL('@/components/worker.jsx', import.meta.url), { type: 'module' })

export default function App() {  
  return <Canvas camera={{ position: [0, 0, 10], fov: 25 }} worker={worker} fallback={<Scene />} />
}
