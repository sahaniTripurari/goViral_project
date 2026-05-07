"use client"

import React, { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  MeshTransmissionMaterial,
  Environment,
  Text,
  Float,
  ContactShadows
} from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

/* ═══════════════════════════════════════════
   ULTRA 4K Glass Mirror Material
   Matched to whitespace.com/glass-hero
   ═══════════════════════════════════════════ */
const GLASS_PROPS = {
  ior: 2.4, // High refraction
  thickness: 3.5, // Ultra thick slabs
  chromaticAberration: 0.8, // Visible dispersion/rainbows
  roughness: 0.02, // Crystal clear
  transmission: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  metalness: 0.1,
  backside: true,
  samples: 16, // High quality
  resolution: 1024,
  anisotropy: 1,
}

const PANE_DEPTH = 0.8
const GAP = 0.2
const R = 0.4 // Rounded corner radius

function createRoundedPolygon(points: THREE.Vector2[], radius: number) {
  const shape = new THREE.Shape()
  const len = points.length

  for (let i = 0; i < len; i++) {
    const p1 = points[(i + len - 1) % len]
    const p2 = points[i]
    const p3 = points[(i + 1) % len]

    const v1 = new THREE.Vector2().subVectors(p1, p2).normalize()
    const v2 = new THREE.Vector2().subVectors(p3, p2).normalize()

    const d = radius

    const start = new THREE.Vector2().addScaledVector(v1, d).add(p2)
    const end = new THREE.Vector2().addScaledVector(v2, d).add(p2)

    if (i === 0) shape.moveTo(start.x, start.y)
    else shape.lineTo(start.x, start.y)

    shape.quadraticCurveTo(p2.x, p2.y, end.x, end.y)
  }

  return shape
}

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

    const targetRotX = -mouse.current.y * 0.25
    const targetRotY = mouse.current.x * 0.25
    
    const offset = index * 0.4
    const driftX = Math.sin(state.clock.elapsedTime * 0.4 + offset) * 0.015
    const driftY = Math.cos(state.clock.elapsedTime * 0.4 + offset) * 0.015

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX + driftX, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY + driftY, 0.05)
    
    const targetZ = hovered ? 0.6 : 0
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
              bevelThickness: 0.15,
              bevelSize: 0.15,
              bevelSegments: 20,
            },
          ]}
        />
        <MeshTransmissionMaterial 
          {...GLASS_PROPS} 
          color="#ffffff" 
          envMapIntensity={1.8}
        />
      </mesh>

      {label && labelPos && (
        <Text
          position={[labelPos[0], labelPos[1], PANE_DEPTH + 0.15]}
          fontSize={labelSize || 0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          lineHeight={1.1}
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

  const W = 14, H = 6
  const HW = W / 2, HH = H / 2
  const G = GAP

  const shards = useMemo(() => {
    const data = []

    // Piece 1: Left Angled
    const p1 = [
      new THREE.Vector2(-HW, HH),
      new THREE.Vector2(-HW + 5, HH),
      new THREE.Vector2(-HW + 3.5, -HH),
      new THREE.Vector2(-HW, -HH),
    ]
    data.push({
      shape: createRoundedPolygon(p1, R),
      label: "AI ANALYSIS",
      labelPos: [-HW + 2.5, 0.5, 0] as [number, number, number],
      labelSize: 0.35,
    })

    // Piece 2: Center Top
    const p2 = [
      new THREE.Vector2(-HW + 5 + G, HH),
      new THREE.Vector2(2.5, HH),
      new THREE.Vector2(1.5, 0),
      new THREE.Vector2(-HW + 4.5 + G, 0),
    ]
    data.push({
      shape: createRoundedPolygon(p2, R),
      label: "PREDICTIVE",
      labelPos: [-1.5, HH - 1.2, 0] as [number, number, number],
      labelSize: 0.25,
    })

    // Piece 3: Center Bottom
    const p3 = [
      new THREE.Vector2(-HW + 3.5 + G, -G),
      new THREE.Vector2(1.5 - G, -G),
      new THREE.Vector2(2.5 - G, -HH),
      new THREE.Vector2(-HW + 3.5 + G, -HH),
    ]
    data.push({
      shape: createRoundedPolygon(p3, R),
      label: "RETENTION",
      labelPos: [-1.0, -HH + 1.2, 0] as [number, number, number],
      labelSize: 0.25,
    })

    // Piece 4: Right Large
    const p4 = [
      new THREE.Vector2(2.5 + G, HH),
      new THREE.Vector2(HW, HH),
      new THREE.Vector2(HW, -HH),
      new THREE.Vector2(2.5 + G, -HH),
    ]
    data.push({
      shape: createRoundedPolygon(p4, R),
      label: "VIRALITY\nENGINE",
      labelPos: [HW - 2, 0, 0] as [number, number, number],
      labelSize: 0.45,
    })

    return data
  }, [])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} />
      <pointLight position={[-15, 10, 20]} intensity={4} color="#A78BFA" />
      <pointLight position={[15, -10, 20]} intensity={3} color="#57FFA8" />
      <pointLight position={[0, 0, 15]} intensity={2} color="#FFFFFF" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
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
      </Float>

      <Environment preset="studio" />
      <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={40} blur={3} far={5} />
    </>
  )
}

export function FooterGlass() {
  return (
    <div className="w-full aspect-[21/9] min-h-[500px] relative overflow-hidden rounded-[4rem] border border-white/[0.08] bg-[#050505] shadow-[0_40px_150px_rgba(0,0,0,0.8)] mt-32 group">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 2]}
      >
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>

      {/* UI Overlay - CTA Style */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center text-center p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-xl">
            <Sparkles className="w-4 h-4" />
            Limited Beta Access
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none max-w-3xl">
            Ready to <span className="text-primary">Scale</span> <br /> 
            Beyond the Limits?
          </h2>

          <div className="flex items-center justify-center gap-6 pt-4 pointer-events-auto">
            <button className="h-16 px-12 rounded-2xl text-lg font-bold bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-3">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-16 px-10 rounded-2xl text-lg font-bold border border-white/10 text-white hover:bg-white/5 backdrop-blur-md transition-all">
              View Roadmap
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/20 to-transparent opacity-50 pointer-events-none" />
      
      {/* Side Label */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono tracking-[1em] text-white/10 uppercase hidden xl:block">
        Refraction_Module_v2
      </div>
    </div>
  )
}
