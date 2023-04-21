import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center, ContactShadows, Environment, CameraControls } from '@react-three/drei'

function Model() {
  const mesh = useRef()
  const { nodes, materials } = useGLTF('/pmndrs.glb')
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const color = hovered ? 'hotpink' : 'orange'
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta / 2
    mesh.current.rotation.y += delta / 2
  })
  return (
    <Center ref={mesh}>
      <mesh
        geometry={nodes.cube.geometry}
        material={materials.base}
        material-color={color}
        scale={active ? 0.3 : 0.25}
        onClick={(e) => (e.stopPropagation(), setActive(!active))}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
      />
    </Center>
  )
}

export default function App() {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 5]} />
      <Model />
      <ContactShadows color={color} position={[0, -1.5, 0]} blur={3} opacity={0.75} />
      <Environment preset="city" />
      <CameraControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </>
  )
}
