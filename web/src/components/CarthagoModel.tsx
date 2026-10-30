import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useThree, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useInventoryStore } from '../stores/inventoryStore'

// Carthago c-tourer I 148 RB QB L comfort
// Coordinate system from reference HTML: front = +x, right side = +z, left side = -z, up = +y
const W = 2.3
const H = 1.15

const COLOR_BODY = 0xf4f5f6
const COLOR_GLASS = 0x222b35
const COLOR_DOOR = 0xb9c3cc
const COLOR_TIRE = 0x1a1a1a
const COLOR_RIM = 0x555b61
const COLOR_TAILLIGHT = 0xc0272d
const COLOR_GARAGE = 0xe8833a
const COLOR_STORAGE = 0x2a9d8f
const COLOR_HIGHLIGHT = 0x22c55e
const COLOR_HANDLE = 0x111111

function stdMaterial(color: number, roughness = 0.6) {
  return new THREE.MeshStandardMaterial({ color, roughness })
}

function createBodyShape() {
  const shape = new THREE.Shape()
  const points = [
    [-3.7, 0.45],
    [-3.7, 2.9],
    [-3.6, 3.0],
    [1.7, 3.0],
    [2.75, 2.95],
    [2.95, 2.4],
    [3.3, 1.3],
    [3.55, 1.1],
    [3.55, 0.5],
    [3.3, 0.4],
  ] as const
  points.forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  })
  return shape
}

function Box({
  size,
  position,
  material,
  name,
}: {
  size: [number, number, number]
  position: [number, number, number]
  material: THREE.Material
  name?: string
}) {
  return (
    <mesh name={name} position={position} material={material}>
      <boxGeometry args={size} />
    </mesh>
  )
}

function Wheel({ x, side }: { x: number; side: 1 | -1 }) {
  const wheelMat = useMemo(() => stdMaterial(COLOR_TIRE, 0.95), [])
  const rimMat = useMemo(() => stdMaterial(COLOR_RIM, 0.25), [])
  const z = side * 0.95
  return (
    <group position={[x, 0.38, z]}>
      <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.3, 28]} />
      </mesh>
      <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.31, 20]} />
      </mesh>
    </group>
  )
}

function Flap({
  name,
  compartmentId,
  x,
  yc,
  w,
  h,
  side,
  color,
}: {
  name: string
  compartmentId: string
  x: number
  yc: number
  w: number
  h: number
  side: 1 | -1
  color: number
}) {
  const pivotRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { invalidate } = useThree()
  const selectItem = useInventoryStore((state) => state.selectItem)
  const selectedItemId = useInventoryStore((state) => state.selectedItemId)
  const items = useInventoryStore((state) => state.items)
  const openFlaps = useInventoryStore((state) => state.openFlaps)
  const toggleFlap = useInventoryStore((state) => state.toggleFlap)

  const isSelected = useMemo(() => {
    if (!selectedItemId) return false
    const item = items.find((i) => i.id === selectedItemId)
    return item?.compartmentId === compartmentId
  }, [selectedItemId, items, compartmentId])

  const isOpen = openFlaps.includes(compartmentId)

  const baseMat = useMemo(() => stdMaterial(color), [color])
  const selectedMat = useMemo(() => {
    const mat = stdMaterial(COLOR_HIGHLIGHT, 0.4)
    mat.emissive = new THREE.Color(COLOR_HIGHLIGHT)
    mat.emissiveIntensity = 0.4
    return mat
  }, [])

  useFrame(() => {
    if (!pivotRef.current) return
    const goal = isOpen ? 0.65 : 0
    pivotRef.current.rotation.x += (-side * goal - pivotRef.current.rotation.x) * 0.12
    if (Math.abs(pivotRef.current.rotation.x + side * goal) > 0.001) {
      invalidate()
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    toggleFlap(compartmentId)
    const item = items.find((i) => i.compartmentId === compartmentId)
    if (item) {
      selectItem(item.id)
    }
  }

  return (
    <group position={[x, yc + h / 2, side * H]} ref={pivotRef}>
      <mesh
        ref={meshRef}
        name={name}
        position={[0, -h / 2, side * 0.015]}
        material={isSelected ? selectedMat : baseMat}
        onClick={handleClick}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <boxGeometry args={[w, h, 0.05]} />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(w, h, 0.05)]} />
          <lineBasicMaterial color={0x222222} />
        </lineSegments>
        <mesh position={[w / 2 - 0.1, 0, side * 0.04]} material={stdMaterial(COLOR_HANDLE)}>
          <boxGeometry args={[0.05, 0.1, 0.03]} />
        </mesh>
      </mesh>
    </group>
  )
}

export function CarthagoModel() {
  const groupRef = useRef<THREE.Group>(null)

  const bodyShape = useMemo(() => createBodyShape(), [])
  const bodyGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(bodyShape, { depth: W, bevelEnabled: false })
    geo.translate(0, 0, -H)
    return geo
  }, [bodyShape])

  const bodyMat = useMemo(() => stdMaterial(COLOR_BODY), [])
  const glassMat = useMemo(() => stdMaterial(COLOR_GLASS, 0.2), [])
  const doorMat = useMemo(() => stdMaterial(COLOR_DOOR), [])
  const taillightMat = useMemo(() => stdMaterial(COLOR_TAILLIGHT), [])
  const grayMat = useMemo(() => stdMaterial(0x888e94), [])

  const flaps = useMemo(
    () => [
      { id: 'garage-rechts', name: 'Garage rechts', x: -3.2, yc: 1.1, w: 1.0, h: 1.25, side: 1 as const, color: COLOR_GARAGE },
      { id: 'staufach-rechts-tuer', name: 'Staufach rechts neben der Tür', x: 1.0, yc: 0.95, w: 0.55, h: 0.5, side: 1 as const, color: COLOR_STORAGE },
      { id: 'staufach-rechts-unten', name: 'Staufach unten links neben der Tür', x: -0.6, yc: 0.7, w: 0.58, h: 0.24, side: 1 as const, color: COLOR_STORAGE },
      { id: 'garage-links', name: 'Garage links', x: -3.2, yc: 1.1, w: 1.0, h: 1.25, side: -1 as const, color: COLOR_GARAGE },
      { id: 'staufach-links-tuer', name: 'Staufach links (hinter Fahrertür)', x: -0.45, yc: 0.95, w: 0.5, h: 0.65, side: -1 as const, color: COLOR_STORAGE },
    ],
    [],
  )

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh geometry={bodyGeo} material={bodyMat} />

      {/* Windshield */}
      <mesh
        position={[3.125 + 0.011, 1.85 + 0.004, 0]}
        rotation={[0, 0, Math.atan2(-1.1, 0.35)]}
        material={glassMat}
      >
        <planeGeometry args={[1.15, 2.0]} />
      </mesh>

      {/* Wheels */}
      <Wheel x={2.6} side={1} />
      <Wheel x={2.6} side={-1} />
      <Wheel x={-1.55} side={1} />
      <Wheel x={-1.55} side={-1} />

      {/* Windows + taillights */}
      {[1, -1].map((s) => (
        <group key={s}>
          <Box size={[1.3, 0.85, 0.02]} position={[2.2, 2.0, s * (H + 0.005)]} material={glassMat} />
          <Box size={[1.3, 0.6, 0.02]} position={[-1.9, 2.2, s * (H + 0.005)]} material={glassMat} />
          <Box size={[0.7, 0.5, 0.02]} position={[-0.7, 2.2, s * (H + 0.005)]} material={glassMat} />
          <Box size={[0.12, 0.45, 0.05]} position={[-3.7, 0.95, s * 0.9]} material={taillightMat} />
        </group>
      ))}
      <Box size={[0.06, 0.25, 1.6]} position={[-3.72, 2.8, 0]} material={grayMat} />

      {/* Doors (not storage) */}
      <Box size={[0.72, 2.05, 0.03]} position={[0.35, 1.72, H + 0.005]} material={doorMat} />
      <Box size={[0.72, 2.05, 0.03]} position={[0.35, 1.72, -H - 0.005]} material={doorMat} />

      {/* Storage flaps */}
      {flaps.map((f) => (
        <Flap key={f.id} {...f} compartmentId={f.id} />
      ))}
    </group>
  )
}
