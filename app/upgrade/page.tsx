"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, Zap, Shield, Flame, TrendingUp, BarChart3, Star, Crown } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function UpgradePage() {
  const { isPro, tier, upgradeToPro, downgradeToFree, isLoading: subLoading } = useSubscription()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/auth/signup?returnUrl=/upgrade")
      return
    }

    setIsProcessing(true)
    try {
      await upgradeToPro()
      toast.success("Welcome to Pro! You now have access to all features.")
      router.push("/upgrade/success")
    } catch (error) {
      toast.error("Failed to upgrade. Please try again.")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDowngrade = async () => {
    setIsProcessing(true)
    try {
      await downgradeToFree()
      toast.success("You've been downgraded to the Free plan.")
    } catch (error) {
      toast.error("Failed to downgrade. Please try again.")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Show current subscription if Pro
  if (isPro && !subLoading) {
    return (
      <div className="min-h-screen bg-background selection:bg-primary/30">
        <Navigation />
        <div className="flex items-center justify-center px-4 py-24 min-h-[calc(100vh-80px)] relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="mb-6 flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20"
                >
                  <Crown className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-4">
                You're a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Pro</span> Member
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Elite analytics and unlimited virality tools are at your fingertips.
              </p>
            </div>

            {/* Current Plan Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative border border-white/10 rounded-3xl p-8 bg-black/40 backdrop-blur-xl mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-xs text-primary font-bold tracking-widest uppercase mb-1">Current Plan</div>
                    <div className="text-3xl font-bold flex items-center gap-2">
                      <Flame className="w-6 h-6 text-primary" />
                      Go Viral Pro
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-xs font-bold">ACTIVE</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white/80">Pro Benefits Active:</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        Unlimited AI Analyzes
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        Full Hook Analysis (3s)
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4 mt-4 sm:mt-0">
                    <div className="h-full pt-4">
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-primary" />
                          </div>
                          Competitor Benchmarking
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-primary" />
                          </div>
                          Trending Audio Predictions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-2xl px-8 h-12" asChild>
                <Link href="/profile">Manage Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 h-12 border-white/10 hover:bg-white/5"
                onClick={handleDowngrade}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Switch to Free"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show pricing for free users
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navigation />
      <div className="relative px-4 py-24 min-h-[calc(100vh-80px)] flex flex-col items-center">
        {/* Decorative Background */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full -z-20" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl w-full text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            <Star className="w-3 h-3 fill-primary" /> Pricing Plans
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Predict your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">Virality</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Stop guessing. Use AI to analyze your content before you post and unlock the potential of every video.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mb-16"
        >
          {/* Free Plan */}
          <motion.div variants={item} className="group relative">
            <div className="relative border border-white/10 rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-xl h-full flex flex-col hover:border-white/20 transition-all duration-300">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-2">Creator Basic</h3>
                <p className="text-muted-foreground text-sm mb-6">Test the waters with basic AI insights.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  "3 AI Analyzes per month",
                  "Basic Virality Score",
                  "Caption Suggestions",
                  "Standard Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3 h-3 text-white/40" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5" disabled>
                Current Plan
              </Button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div variants={item} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-600 rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative border border-primary/30 rounded-[2.5rem] p-10 bg-black/60 backdrop-blur-xl h-full flex flex-col">
              <div className="absolute top-6 right-10">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase">
                  Most Popular
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Creator Pro <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
                </h3>
                <p className="text-white/60 text-sm mb-6">Master the algorithm with elite tools.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-primary">$19</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  { text: "Unlimited AI Analyzes", icon: Zap },
                  { text: "3s Hook Strength Analysis", icon: BarChart3 },
                  { text: "Competitor Benchmarking", icon: TrendingUp },
                  { text: "Trending Audio Predictions", icon: Flame },
                  { text: "Priority Cloud Processing", icon: Shield }
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <feature.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 group-hover:scale-[1.02] transition-transform"
                onClick={handleUpgrade}
                disabled={isProcessing || authLoading || subLoading}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> 
                    Processing
                  </span>
                ) : "Get Pro Access Now"}
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground/60 border-t border-white/5 pt-8 w-full max-w-lg"
        >
          <p>This is a demo for the 8x Social Contest. No real credit card required.</p>
          <p className="mt-1">Cancel anytime from your profile settings.</p>
        </motion.div>
      </div>
    </div>
  )
}
