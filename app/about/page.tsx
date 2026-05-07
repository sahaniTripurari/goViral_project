"use client"

import { Navigation } from "@/components/navigation"
import { motion } from "framer-motion"
import { Sparkles, Users, Globe, Target, Flame } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -z-10" />
      
      <main className="container mx-auto px-6 py-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-16"
        >
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Mission</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              We're building the infrastructure for the next generation of digital storytellers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[3rem] glass-card space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">The Vision</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                To democratize viral growth by providing creators with the same neural analysis tools used by elite marketing agencies.
              </p>
            </div>

            <div className="p-10 rounded-[3rem] glass-card space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold">The Community</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Join over 12,000 creators who are already using Go Viral to dominate their niche and grow their audience exponentially.
              </p>
            </div>
          </div>

          <div className="p-12 rounded-[4rem] glass-card text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent -z-10" />
            <Flame className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Driven by Innovation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Founded in San Francisco by a team of AI researchers and social media veterans, we are committed to staying ahead of every algorithm update.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
