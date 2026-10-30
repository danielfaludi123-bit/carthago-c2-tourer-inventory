import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
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
  const selectedItemId = useInventoryStore((state) => state.selectedItemId)
  const items = useInventoryStore((state) => state.items)
  const compartments = useInventoryStore((state) => state.compartments)
  const controlsRef = useRef<any>(null)
  const [targetAzimuth, setTargetAzimuth] = useState<number | null>(null)

  useEffect(() => {
    if (!selectedItemId) {
      setTargetAzimuth(null)
      return
    }
    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return
    const compartment = compartments.find((c) => c.id === item.compartmentId)
    if (!compartment) return
    setTargetAzimuth(SIDE_ANGLES[compartment.side])
  }, [selectedItemId, items, compartments])

  useFrame((_, delta) => {
    if (!controlsRef.current || targetAzimuth === null) return
    const controls = controlsRef.current
    const current = controls.getAzimuthalAngle()
    let diff = targetAzimuth - current
    while (diff > Math.PI) diff -= 2 * Math.PI
    while (diff < -Math.PI) diff += 2 * Math.PI
    const step = diff * (1 - Math.exp(-2.5 * delta))
    controls.autoRotate = false
    controls.setAzimuthalAngle(current + step)
  })

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
      autoRotate
      autoRotateSpeed={0.4}
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
  const selectItem = useInventoryStore((state) => state.selectItem)

  const handleBackgroundClick = () => {
    selectItem(null)
  }

  return (
    <group onPointerMissed={handleBackgroundClick}>
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
