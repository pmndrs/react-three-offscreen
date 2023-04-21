import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center, ContactShadows, Environment, CameraControls } from '@react-three/drei'

function Model() {
  const mesh = useRef()
  const { nodes, materials } = useGLTF('/pmndrs.glb')
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta
    mesh.current.rotation.y += delta
  })
  return (
    <>
      <Center ref={mesh}>
        <mesh
          geometry={nodes.cube.geometry}
          material={materials.base}
          scale={active ? 0.3 : 0.25}
          onClick={(e) => (e.stopPropagation(), setActive(!active))}
          onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
          onPointerOut={(e) => setHover(false)}
          material-color={hovered ? 'hotpink' : 'orange'}
        />
      </Center>
      <ContactShadows color={hovered ? 'hotpink' : 'orange'} position={[0, -1.5, 0]} blur={3} opacity={0.75} />
    </>
  )
}

function Cube(props) {
  const mesh = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta
    mesh.current.rotation.y += delta
  })
  return (
    <>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.25 : 1}
        onClick={(e) => (e.stopPropagation(), setActive(!active))}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
      <ContactShadows color={hovered ? 'hotpink' : 'orange'} position={[0, -1.5, 0]} blur={3} opacity={0.75} />
    </>
  )
}

export default function App() {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model />
      <Environment preset="city" />
      <CameraControls />
    </>
  )
}
