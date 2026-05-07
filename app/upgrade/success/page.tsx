"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, ArrowRight, Flame, BarChart3, TrendingUp, Zap } from "lucide-react"
import { useEffect } from "react"
import confetti from "@/lib/confetti"
import { motion } from "framer-motion"

export default function UpgradeSuccessPage() {
  useEffect(() => {
    // Trigger confetti on mount
    confetti()
  }, [])

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navigation />
      <div className="relative flex items-center justify-center px-4 py-24 min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Success Icon */}
          <div className="mb-10 flex justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              className="relative"
            >
              <div className="w-28 h-28 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-primary" />
              </div>
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/40 border-4 border-background"
              >
                <Flame className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
              </motion.div>
            </motion.div>
          </div>

          {/* Header */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold tracking-tight mb-4"
          >
            You're <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Elite</span> Now!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground font-light mb-12"
          >
            Welcome to Go Viral Pro. The algorithm just became your best friend.
          </motion.p>

          {/* Features unlocked */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mb-10 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-primary" />
            </div>
            
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary fill-primary/20" />
              Elite Arsenal Unlocked:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { text: "Unlimited AI Analyzes", icon: CheckCircle },
                { text: "3s Hook Breakdown", icon: BarChart3 },
                { text: "Competitor Intel", icon: TrendingUp },
                { text: "Viral Audio Predictions", icon: Flame }
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <feat.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-white/80">{feat.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="h-14 px-10 rounded-2xl font-bold group" asChild>
              <Link href="/analyze" className="flex items-center gap-2">
                Start Analyzing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/10 hover:bg-white/5 font-bold" asChild>
              <Link href="/profile">View Account</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
