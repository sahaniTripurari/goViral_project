"use client"

import React, { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  MeshTransmissionMaterial,
  Environment,
  Text,
  ContactShadows
} from "@react-three/drei"
import * as THREE from "three"

/* ═══════════════════════════════════════════
   ULTRA 4K Glass Mirror Material
   ═══════════════════════════════════════════ */
const GLASS_PROPS = {
  ior: 2.14,
  thickness: 3.0, // Extra thick for heavy 3D slabs
  chromaticAberration: 0.5,
  roughness: 0.03, // Ultra smooth
  transmission: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  metalness: 0.15, // Slight metallic hint for mirror quality
  backside: true,
  samples: 12, 
  resolution: 1024,
  anisotropy: 1,
}

const PANE_DEPTH = 0.6 // Chunky 3D look
const GAP = 0.15

/* Helper: Create a robust rounded polygon shape */
function createRoundedPolygon(points: THREE.Vector2[], radius: number) {
  const shape = new THREE.Shape()
  const len = points.length

  for (let i = 0; i < len; i++) {
    const p1 = points[(i + len - 1) % len]
    const p2 = points[i]
    const p3 = points[(i + 1) % len]

    const v1 = new THREE.Vector2().subVectors(p1, p2).normalize()
    const v2 = new THREE.Vector2().subVectors(p3, p2).normalize()

    const d = radius // Fixed radius for smoothness

    const start = new THREE.Vector2().addScaledVector(v1, d).add(p2)
    const end = new THREE.Vector2().addScaledVector(v2, d).add(p2)

    if (i === 0) shape.moveTo(start.x, start.y)
    else shape.lineTo(start.x, start.y)

    shape.quadraticCurveTo(p2.x, p2.y, end.x, end.y)
  }

  return shape
}

/* ═══════════════════════════════════════════
   Glass Piece Component
   ═══════════════════════════════════════════ */
function GlassPiece({
  shape,
  index,
  mouse,
  label,
  labelPos,
  labelSize,
}: {
  shape: THREE.Shape
  index: number
  mouse: React.MutableRefObject<THREE.Vector2>
  label?: string
  labelPos?: [number, number, number]
  labelSize?: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return

    // Collective reaction: All pieces tilt together based on global mouse
    const targetRotX = -mouse.current.y * 0.35
    const targetRotY = mouse.current.x * 0.35
    
    // Per-piece subtle independent drift
    const offset = index * 0.3
    const driftX = Math.sin(state.clock.elapsedTime * 0.3 + offset) * 0.01
    const driftY = Math.cos(state.clock.elapsedTime * 0.3 + offset) * 0.01

    // Update rotation - all pieces follow the cursor area
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX + driftX, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY + driftY, 0.05)
    
    // Smooth 3D depth pop when hovered
    const targetZ = hovered ? 0.5 : 0
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.07)
  })

  return (
    <group 
      ref={groupRef}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: PANE_DEPTH,
              bevelEnabled: true,
              bevelThickness: 0.15, // Beveled for light catching
              bevelSize: 0.15,
              bevelSegments: 20, // Maximum smoothness
            },
          ]}
        />
        <MeshTransmissionMaterial 
          {...GLASS_PROPS} 
          color="#ffffff" 
          envMapIntensity={1.2} // Bright reflections for mirror look
        />
      </mesh>

      {label && labelPos && (
        <Text
          position={[labelPos[0], labelPos[1], PANE_DEPTH + 0.2]}
          fontSize={labelSize || 0.3}
          color="white"
          anchorX="left"
          anchorY="top"
          maxWidth={3.5}
          lineHeight={1.1}
          letterSpacing={-0.02}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.woff"
        >
          {label}
        </Text>
      )}
    </group>
  )
}

function Scene() {
  const mouse = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const W = 11, H = 6
  const HW = W / 2, HH = H / 2
  const G = GAP
  const R = 0.35 // Rounded corner radius

  const shards = useMemo(() => {
    const data = []

    // 0: Large Left Main
    const p0 = [
      new THREE.Vector2(-HW, HH),
      new THREE.Vector2(-1.0, HH),
      new THREE.Vector2(-1.5, -HH),
      new THREE.Vector2(-HW, -HH),
    ]
    data.push({
      shape: createRoundedPolygon(p0, R),
      label: "Go Viral\nwith AI.",
      labelPos: [-HW + 0.8, HH - 0.7, 0] as [number, number, number],
      labelSize: 0.85,
    })

    // 1: Top Center
    const p1 = [
      new THREE.Vector2(-1.0 + G, HH),
      new THREE.Vector2(2.8, HH),
      new THREE.Vector2(1.0, 0.5),
      new THREE.Vector2(-1.5 + G, 0.5),
    ]
    data.push({
      shape: createRoundedPolygon(p1, R),
      label: "Neural System",
      labelPos: [-0.3, HH - 0.6, 0] as [number, number, number],
      labelSize: 0.22,
    })

    // 2: Top Right
    const p2 = [
      new THREE.Vector2(2.8 + G, HH),
      new THREE.Vector2(HW, HH),
      new THREE.Vector2(HW, 1.0),
      new THREE.Vector2(1.0 + G, 0.5),
    ]
    data.push({
      shape: createRoundedPolygon(p2, R),
      label: "Engine v5",
      labelPos: [3.2, HH - 0.6, 0] as [number, number, number],
      labelSize: 0.22,
    })

    // 3: Center Piece
    const p3 = [
      new THREE.Vector2(-1.5 + G, 0.5 - G),
      new THREE.Vector2(1.0, 0.5 - G),
      new THREE.Vector2(2.4, -1.8),
      new THREE.Vector2(-1.0, -1.8),
    ]
    data.push({
      shape: createRoundedPolygon(p3, R),
      label: "Predictive",
      labelPos: [-1.0, -0.3, 0] as [number, number, number],
      labelSize: 0.22,
    })

    // 4: Mid Right
    const p4 = [
      new THREE.Vector2(1.0 + G, 0.5 - G),
      new THREE.Vector2(HW, 1.0 - G),
      new THREE.Vector2(HW, -HH),
      new THREE.Vector2(2.4 + G, -1.8),
    ]
    data.push({
      shape: createRoundedPolygon(p4, R),
      label: "Real-Time",
      labelPos: [2.8, -0.3, 0] as [number, number, number],
      labelSize: 0.22,
    })

    // 5: Bottom Strip
    const p5 = [
      new THREE.Vector2(-1.0 + G, -HH),
      new THREE.Vector2(-1.5, -1.8 - G),
      new THREE.Vector2(2.4, -1.8 - G),
      new THREE.Vector2(HW, -HH),
    ]
    data.push({
      shape: createRoundedPolygon(p5, R),
      label: "Algorithm Intelligence 2026",
      labelPos: [0.5, -2.5, 0] as [number, number, number],
      labelSize: 0.2,
    })

    return data
  }, [])

  return (
    <>
      <color attach="background" args={["#000000"]} />
      
      {/* Premium Studio Environment */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={2} />
      <pointLight position={[-15, 10, 20]} intensity={3} color="#A78BFA" />
      <pointLight position={[15, -10, 20]} intensity={2} color="#57FFA8" />

      <group position={[0, 0, 0]}>
        {shards.map((s, i) => (
          <GlassPiece
            key={i}
            index={i}
            shape={s.shape}
            mouse={mouse}
            label={s.label}
            labelPos={s.labelPos}
            labelSize={s.labelSize}
          />
        ))}
      </group>

      <Environment preset="studio" />
      <ContactShadows position={[0, -4.0, 0]} opacity={0.8} scale={30} blur={3.5} far={5} />
    </>
  )
}

export function GlassHero() {
  return (
    <div className="w-full aspect-[16/9] max-h-[850px] relative overflow-hidden rounded-[4rem] border border-white/[0.1] bg-black shadow-[0_60px_200px_rgba(0,0,0,1)]">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none p-16 flex flex-col justify-end">
        <div className="flex items-end justify-between w-full">
          <div className="space-y-10 pointer-events-auto">
            <div className="space-y-3">
              <h3 className="text-white text-6xl font-black tracking-tighter leading-none">PRISM_CORE_v6</h3>
              <p className="text-white/30 text-2xl max-w-lg font-medium leading-tight">
                Refraction-grade content intelligence engine.
              </p>
            </div>
            <div className="flex items-center gap-10">
              <button className="h-20 px-16 rounded-3xl text-xl font-bold bg-[#57FFA8] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_25px_80px_rgba(87,255,168,0.5)]">
                Initialize System
              </button>
              <button className="h-20 px-16 rounded-3xl text-xl font-bold border border-white/10 text-white hover:bg-white/5 transition-all">
                View Protocol
              </button>
            </div>
          </div>
          
          <div className="text-[16px] text-white/10 tracking-[1em] font-mono hidden lg:block vertical-text uppercase">
            4K_OPTICAL_MIRROR
          </div>
        </div>
      </div>
    </div>
  )
}
