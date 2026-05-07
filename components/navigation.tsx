"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, X, Flame, History as HistoryIcon, Zap, LayoutDashboard, Home } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const { isPro } = useSubscription()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-[100] w-full glass-nav">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none">GO VIRAL</span>
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] leading-none mt-1">AI ENGINE</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-bold tracking-wide transition-colors flex items-center gap-2 ${
                pathname === "/" ? "text-primary" : "text-white/60 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>

            <Link
              href="/analyze"
              className={`text-sm font-bold tracking-wide transition-colors flex items-center gap-2 ${
                pathname === "/analyze" ? "text-primary" : "text-white/60 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" /> Analyze
            </Link>
            
            {user && (
              <Link
                href="/history"
                className={`text-sm font-bold tracking-wide transition-colors flex items-center gap-2 ${
                  pathname === "/history" ? "text-primary" : "text-white/60 hover:text-white"
                }`}
              >
                <HistoryIcon className="w-4 h-4" /> History
              </Link>
            )}

            <Link
              href="/blog"
              className={`text-sm font-bold tracking-wide transition-colors ${
                pathname === "/blog" ? "text-primary" : "text-white/60 hover:text-white"
              }`}
            >
              Blog
            </Link>
          </div>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    pathname === "/profile" ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                  title="Profile Settings"
                >
                  <User className="w-5 h-5" />
                </Link>
                {!isPro && (
                  <Link href="/upgrade">
                    <Button size="sm" className="rounded-xl font-bold px-5 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                      Get Pro
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/upgrade" className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Button size="sm" className="rounded-xl font-bold px-6" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/60"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <Link
                href="/"
                className="text-lg font-bold flex items-center gap-3 text-white/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 text-primary" /> Home
              </Link>
              <Link
                href="/analyze"
                className="text-lg font-bold flex items-center gap-3 text-white/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="w-5 h-5 text-primary" /> Analyze Content
              </Link>
              {user && (
                <Link
                  href="/history"
                  className="text-lg font-bold flex items-center gap-3 text-white/80"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HistoryIcon className="w-5 h-5 text-primary" /> My History
                </Link>
              )}
              <Link
                href="/blog"
                className="text-lg font-bold flex items-center gap-3 text-white/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="w-5 h-5 text-primary" /> Blog
              </Link>
              <Link
                href="/profile"
                className="text-lg font-bold flex items-center gap-3 text-white/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 text-primary" /> Profile Settings
              </Link>
              <div className="pt-4 border-t border-white/5">
                {!user ? (
                  <Button className="w-full h-12 rounded-xl font-bold" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/auth/login">Sign In Now</Link>
                  </Button>
                ) : !isPro && (
                  <Button className="w-full h-12 rounded-xl font-bold bg-primary" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/upgrade">Upgrade to Pro</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
