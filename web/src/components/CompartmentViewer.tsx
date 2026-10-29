import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useInventoryStore } from '../stores/inventoryStore'

const DEFAULT_CAMERA_POSITION: [number, number, number] = [2.0, 9.5, 7.0]
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0, 0.6]

function CameraAnimator() {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId)
  const compartments = useInventoryStore((state) => state.compartments)
  const items = useInventoryStore((state) => state.items)

  const currentTargetRef = useRef(new THREE.Vector3(...DEFAULT_CAMERA_TARGET))

  const [targetPos, setTargetPos] = useState<[number, number, number]>(DEFAULT_CAMERA_POSITION)
  const [lookAt, setLookAt] = useState<[number, number, number]>(DEFAULT_CAMERA_TARGET)

  useEffect(() => {
    if (!selectedItemId) {
      setTargetPos(DEFAULT_CAMERA_POSITION)
      setLookAt(DEFAULT_CAMERA_TARGET)
      return
    }

    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return

    const compartment = compartments.find((c) => c.id === item.compartmentId)
    if (!compartment) return

    setTargetPos(compartment.cameraPosition)
    setLookAt(compartment.cameraTarget)
  }, [selectedItemId, items, compartments])

  useFrame((state, delta) => {
    const camera = state.camera
    const targetPosition = new THREE.Vector3(...targetPos)
    const targetLookAt = new THREE.Vector3(...lookAt)

    // Smoothly interpolate camera position (slower for nicer animation)
    camera.position.lerp(targetPosition, 1 - Math.exp(-2.2 * delta))

    // Smoothly interpolate lookAt target
    currentTargetRef.current.lerp(targetLookAt, 1 - Math.exp(-2.2 * delta))
    camera.lookAt(currentTargetRef.current)
  })

  return (
    <PerspectiveCamera
      makeDefault
      position={DEFAULT_CAMERA_POSITION}
      fov={45}
      near={0.1}
      far={100}
    />
  )
}

function Model() {
  const { scene } = useGLTF('/carthago-c2-tourer-inventory/models/c2-tourer.glb')
  const selectedItemId = useInventoryStore((state) => state.selectedItemId)
  const compartments = useInventoryStore((state) => state.compartments)
  const items = useInventoryStore((state) => state.items)
  const selectItem = useInventoryStore((state) => state.selectItem)

  const compartmentMap = useMemo(() => {
    const map = new Map<string, string>()
    compartments.filter((c) => c.meshName).forEach((c) => map.set(c.meshName, c.id))
    return map
  }, [compartments])

  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    let selectedCompartmentId: string | null = null
    if (selectedItemId) {
      const item = items.find((i) => i.id === selectedItemId)
      if (item) {
        selectedCompartmentId = item.compartmentId
      }
    }

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const compId = compartmentMap.get(child.name)
        if (compId) {
          const isSelected = compId === selectedCompartmentId
          const mat = (child.material as THREE.MeshStandardMaterial).clone()
          mat.transparent = true
          mat.opacity = isSelected ? 0.95 : 0.7
          mat.emissive = isSelected ? new THREE.Color('#e07a5f') : new THREE.Color(0x000000)
          mat.emissiveIntensity = isSelected ? 0.5 : 0
          child.material = mat
        }
      }
    })
  }, [clonedScene, selectedItemId, items, compartmentMap])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const object = event.object as THREE.Object3D
    let current: THREE.Object3D | null = object
    while (current) {
      const compId = compartmentMap.get(current.name)
      if (compId) {
        const item = items.find((i) => i.compartmentId === compId)
        if (item) {
          selectItem(item.id)
        }
        return
      }
      current = current.parent
    }
  }

  return (
    <group onClick={handleClick} onPointerMissed={() => selectItem(null)}>
      <primitive object={clonedScene} />
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 12, 8]} intensity={1.4} />
      <directionalLight position={[-8, 6, -5]} intensity={0.5} />
      <pointLight position={[0, 4, 2]} intensity={0.6} color="#fff5e6" />
    </>
  )
}

export function CompartmentViewer() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#e8f4fc] to-[#f5efe6]">
      <Canvas>
        <CameraAnimator />
        <Lights />
        <Model />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-xs text-stone-600 shadow backdrop-blur">
        🖱️ Klick auf Listeneintrag → Kamera fliegt zum Fach
      </div>
    </div>
  )
}
