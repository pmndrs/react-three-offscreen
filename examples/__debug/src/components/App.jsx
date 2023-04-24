import React from 'react'
import { Canvas } from '@react-three/offscreen'

const worker = new Worker(new URL('./worker.jsx', import.meta.url), { type: 'module' })

export default function App() {  
  return <Canvas camera={{ position: [0, 0, 10], fov: 25 }} dpr={[1, 2]} worker={worker} />
}
