import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useInventoryStore } from '../stores/inventoryStore'

function Model() {
  const { scene } = useGLTF('/carthago-c2-tourer-inventory/models/c2-tourer.glb')
  const modelRef = useRef<THREE.Group>(null)
  const selectedCompartmentId = useInventoryStore(
    (state) => state.selectedCompartmentId,
  )
  const compartments = useInventoryStore((state) => state.compartments)
  const selectCompartment = useInventoryStore(
    (state) => state.selectCompartment,
  )

  const compartmentMap = useMemo(() => {
    const map = new Map<string, string>()
    compartments
      .filter((c) => c.meshName)
      .forEach((c) => map.set(c.meshName, c.id))
    return map
  }, [compartments])

  // Clone scene so we can modify materials without affecting cached original
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const compId = compartmentMap.get(child.name)
        if (compId) {
          const isSelected = compId === selectedCompartmentId
          const mat = (child.material as THREE.MeshStandardMaterial).clone()
          mat.transparent = true
          mat.opacity = isSelected ? 0.75 : 0.35
          mat.emissive = isSelected
            ? new THREE.Color('#e07a5f')
            : new THREE.Color(0x000000)
          mat.emissiveIntensity = isSelected ? 0.4 : 0
          child.material = mat
        }
      }
    })
  }, [clonedScene, selectedCompartmentId, compartmentMap])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const object = event.object as THREE.Object3D
    let current: THREE.Object3D | null = object
    while (current) {
      const compId = compartmentMap.get(current.name)
      if (compId) {
        selectCompartment(compId)
        return
      }
      current = current.parent
    }
    selectCompartment(null)
  }

  return (
    <group
      ref={modelRef}
      onClick={handleClick}
      onPointerMissed={() => selectCompartment(null)}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 8]} intensity={1.2} castShadow />
      <directionalLight position={[-8, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#fff5e6" />
    </>
  )
}

export function CompartmentViewer() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-sky-50 to-sand dark:from-gray-900 dark:to-gray-800">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 5, 6]} fov={45} />
        <Lights />
        <Model />
        <OrbitControls
          target={[0, 1, 0]}
          enablePan={true}
          enableZoom={true}
          minDistance={3}
          maxDistance={20}
        />
        <gridHelper args={[20, 20, 0xcccccc, 0xe5e5e5]} position={[0, -0.01, 0]} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-white/80 px-3 py-2 text-xs text-gray-600 shadow backdrop-blur dark:bg-gray-900/80 dark:text-gray-300">
        🖱️ Drehen · Scrollen · Klick auf Fach
      </div>
    </div>
  )
}
