"use client"

import type React from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Flame, Sparkles, Mail, Lock, ArrowRight, UserPlus } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [returnUrl, setReturnUrl] = useState<string | null>(null)
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setReturnUrl(params.get('returnUrl'))
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const destination = returnUrl || "/"
      router.push(destination)
    }
  }, [user, authLoading, returnUrl, router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error

      // Redirect to returnUrl if provided, otherwise to home
      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push("/")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="relative group">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-primary/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl">
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
                >
                  <UserPlus className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                <p className="text-muted-foreground font-light text-sm">Join thousands of viral creators today</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary placeholder:text-white/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Create Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary placeholder:text-white/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repeat-password" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        id="repeat-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary placeholder:text-white/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-bold text-base shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-all mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Start Your Journey
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href={returnUrl ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth/login"}
                      className="text-primary font-bold hover:underline underline-offset-4"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" /> Powered by Go Viral AI
          </div>
        </motion.div>
      </div>
    </div>
  )
}
