import * as THREE from 'three'
import { useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Sky, Environment, Cloud, OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { easing } from 'maath'

export default function App() {
  return (
    <>
      <hemisphereLight intensity={0.45} />
      <spotLight angle={0.4} penumbra={1} position={[20, 30, 2.5]} />
      <directionalLight color="red" position={[-10, -10, 0]} intensity={1.5} />
      <Cloud scale={1.5} position={[20, 0, 0]} />
      <Cloud scale={1} position={[-20, 10, 0]} />
      <Environment preset="city" />
      <Sky />
      <Physics timeStep="vary" colliders={false}>
        <group position={[6, 3, 0]}>
          <Track position={[-3, 0, 10.5]} rotation={[0, -0.4, 0]} />
          <Sphere position={[-12, 13, 0]} />
          <Sphere position={[-9, 13, 0]} />
          <Sphere position={[-6, 13, 0]} />
          <Pacman />
        </group>
      </Physics>
      <OrbitControls />
    </>
  )
}

function Track(props) {
  const { nodes } = useGLTF('/ball-trip.optimized.glb')
  return (
    <RigidBody colliders="trimesh" type="fixed">
      <mesh geometry={nodes.Cylinder.geometry} {...props} dispose={null}>
        <meshPhysicalMaterial color="lightblue" transmission={1} thickness={1} roughness={0.3} />
      </mesh>
      <Cylinder position={[-0.85, 4, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[1.5, 1.75, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[1.15, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[2, 3, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[1.25, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[-1, 7, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[-1.5, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[1.75, 8, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Box position={[-3, 11, 0]} rotation={[0, 0, -0.5]} />
      <Box position={[-8.6, 12.3, 0]} length={8} rotation={[0, 0, -0.1]} />
    </RigidBody>
  )
}

function Pacman() {
  const ref = useRef()
  const [vec] = useState(() => new THREE.Vector3())
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    easing.damp3(vec, state.pointer, 0.2, delta)
    easing.damp3(state.camera.position, [state.pointer.x * 25 + -50, state.pointer.y * 25 + -25, 160], 0.2, delta)
    state.camera.lookAt(0, 0, 0)
    ref.current.setNextKinematicTranslation({ x: -2, y: -8 + Math.sin(t * 10) / 2, z: 0 })
  })
  return (
    <>
      <RigidBody
        ref={ref}
        type="kinematicPosition"
        colliders="trimesh"
        onCollisionEnter={(e) => {
          e.rigidBody.setTranslation({ x: 0, y: 20, z: 0 })
          e.rigidBody.setLinvel({ x: 0, y: 0, z: 0 })
          e.rigidBody.setAngvel({ x: 0, y: 0, z: 0 })
        }}
      >
        <mesh rotation={[-Math.PI / 2, Math.PI, 0]}>
          <sphereGeometry args={[10, 24, 24, 0, Math.PI * 1.3]} />
          <meshStandardMaterial color="#ffc060" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-5, 0, 8.5]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="black" roughness={0.75} />
        </mesh>
      </RigidBody>
    </>
  )
}

const Box = ({ length = 4, ...props }) => (
  <mesh {...props}>
    <boxGeometry args={[length, 0.4, 4]} />
    <meshStandardMaterial color="white" />
  </mesh>
)

function Sphere({ position }) {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.setLinvel({ x: 0, y: 10, z: 0 })
  }, [])
  return (
    <RigidBody position={position} ref={ref} colliders="ball" restitution={0.7}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  )
}

const Cylinder = (props) => (
  <mesh {...props}>
    <cylinderGeometry args={[0.25, 0.25, 4]} />
    <meshStandardMaterial />
  </mesh>
)
