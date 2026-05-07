"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

// ===== SCROLL REVEAL VARIANTS =====

type ScrollStyle = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "zoom-in" 
  | "zoom-out"
  | "rotate-in" 
  | "flip-x" 
  | "flip-y" 
  | "slide-rotate"
  | "bounce-in"
  | "blur-in"
  | "swing-in"
  | "drop-in"

interface ScrollRevealProps {
  children: ReactNode
  style?: ScrollStyle
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const variants: Record<ScrollStyle, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1 },
  },
  "zoom-out": {
    hidden: { opacity: 0, scale: 1.3 },
    visible: { opacity: 1, scale: 1 },
  },
  "rotate-in": {
    hidden: { opacity: 0, rotate: -15, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  "flip-x": {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
  },
  "flip-y": {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 },
  },
  "slide-rotate": {
    hidden: { opacity: 0, x: -60, rotate: -10 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  "bounce-in": {
    hidden: { opacity: 0, scale: 0.3, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: 20 },
    visible: { opacity: 1, filter: 0 },
  },
  "swing-in": {
    hidden: { opacity: 0, rotateZ: 20, x: 40 },
    visible: { opacity: 1, rotateZ: 0, x: 0 },
  },
  "drop-in": {
    hidden: { opacity: 0, y: -100, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
}

export function ScrollReveal({ 
  children, 
  style = "fade-up", 
  delay = 0, 
  duration = 0.7,
  className = "",
  once = true 
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-80px" })

  const v = variants[style]

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={isInView ? v.visible : v.hidden}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...(style === "bounce-in" ? { type: "spring", bounce: 0.4 } : {}),
      }}
      className={className}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

// ===== PARALLAX SCROLL =====

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// ===== STAGGER CONTAINER =====

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({ children, staggerDelay = 0.1, className = "" }: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ===== ANIMATED COUNTER =====

interface CountUpProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({ end, suffix = "", duration = 2, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView ? `${end}${suffix}` : `0${suffix}`}
    </motion.span>
  )
}

// ===== MAGNETIC BUTTON =====

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className = "", strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * strength
    const y = (e.clientY - top - height / 2) * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// ===== TEXT REVEAL CHARACTER BY CHARACTER =====

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.3,
            delay: delay + i * 0.03,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}
