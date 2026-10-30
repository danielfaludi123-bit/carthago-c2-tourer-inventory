import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useInventoryStore } from '../stores/inventoryStore'
import { CarthagoModel } from './CarthagoModel'
import type { CompartmentSide } from '../types'

const DEFAULT_CAMERA_POSITION: [number, number, number] = [4, 5, 9]
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 1.4, 0]

const SIDE_ANGLES: Record<CompartmentSide, number> = {
  left: -Math.PI / 2,
  right: Math.PI / 2,
  rear: Math.PI,
  front: 0,
  roof: -Math.PI / 4,
}

function CameraController() {
  const selectedCompartmentId = useInventoryStore((state) => state.selectedCompartmentId)
  const compartments = useInventoryStore((state) => state.compartments)
  const controlsRef = useRef<any>(null)
  const [targetAzimuth, setTargetAzimuth] = useState<number | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (!selectedCompartmentId || hasInteracted) {
      setTargetAzimuth(null)
      return
    }
    const compartment = compartments.find((c) => c.id === selectedCompartmentId)
    if (!compartment) return
    setTargetAzimuth(SIDE_ANGLES[compartment.side])
  }, [selectedCompartmentId, compartments, hasInteracted])

  useFrame((_, delta) => {
    if (!controlsRef.current) return
    const controls = controlsRef.current

    if (targetAzimuth !== null && !hasInteracted) {
      const current = controls.getAzimuthalAngle()
      let diff = targetAzimuth - current
      while (diff > Math.PI) diff -= 2 * Math.PI
      while (diff < -Math.PI) diff += 2 * Math.PI
      const step = diff * (1 - Math.exp(-2.5 * delta))
      controls.setAzimuthalAngle(current + step)
      if (Math.abs(diff) < 0.02) {
        setTargetAzimuth(null)
      }
    }
  })

  const handleStart = () => {
    setHasInteracted(true)
    setTargetAzimuth(null)
  }

  return (
    <OrbitControls
      ref={controlsRef}
      target={DEFAULT_CAMERA_TARGET}
      enablePan={false}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.08}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={6}
      maxDistance={18}
      autoRotate={!hasInteracted}
      autoRotateSpeed={0.4}
      onStart={handleStart}
    />
  )
}

function CameraInitializer() {
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

function Lights() {
  return (
    <>
      <hemisphereLight intensity={0.9} color="#ffffff" groundColor="#8899aa" />
      <directionalLight position={[5, 8, 6]} intensity={0.9} />
      <directionalLight position={[-4, 5, -3]} intensity={0.4} />
    </>
  )
}

function Scene() {
  const { camera, scene } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const selectCompartment = useInventoryStore((state) => state.selectCompartment)
  const clearSelection = useInventoryStore((state) => state.clearSelection)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerStartRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!pointerStartRef.current) return
    const dx = e.nativeEvent.offsetX - pointerStartRef.current.x
    const dy = e.nativeEvent.offsetY - pointerStartRef.current.y
    pointerStartRef.current = null
    if (Math.sqrt(dx * dx + dy * dy) > 6) return

    raycaster.setFromCamera(e.pointer, camera)
    const hits = raycaster.intersectObjects(scene.children, true)
    for (const hit of hits) {
      const compId = hit.object.userData.compartmentId
      if (compId) {
        selectCompartment(compId)
        return
      }
    }
    clearSelection()
  }

  return (
    <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <CarthagoModel />
    </group>
  )
}

export function CompartmentViewer() {
  return (
    <div className="relative h-full w-full bg-[#e9edf1]">
      <Canvas frameloop="always" dpr={[1, 2]}>
        <CameraInitializer />
        <CameraController />
        <Lights />
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-xs text-stone-600 shadow backdrop-blur">
        🖱️ Ziehen = drehen · Klappe anklicken = öffnen
      </div>
    </div>
  )
}
