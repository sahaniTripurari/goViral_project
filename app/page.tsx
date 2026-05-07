"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Check, Sparkles, TrendingUp, BarChart3, Hash, PlayCircle, 
  Zap, ShieldCheck, Globe, Users, ArrowRight, Star, 
  Mail, MessageSquare, Heart, Instagram, Twitter, Youtube, Flame
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import dynamic from "next/dynamic"
import { ScrollReveal, StaggerContainer, StaggerItem, Parallax, Magnetic, TextReveal } from "@/components/scroll-animations"

const GlassHero = dynamic(() => import("@/components/glass-hero").then(mod => mod.GlassHero), {
  ssr: false,
  loading: () => <div className="max-w-6xl mx-auto rounded-[4rem] min-h-[600px] skeleton" />
})

const FooterGlass = dynamic(() => import("@/components/footer-glass").then(mod => mod.FooterGlass), {
  ssr: false,
  loading: () => <div className="w-full aspect-[21/9] rounded-[2.5rem] skeleton" />
})

// Scroll animation styles to cycle through for cards
const scrollStyles = ["fade-up", "zoom-in", "rotate-in", "flip-x", "slide-rotate", "fade-left"] as const

export default function HomePage() {
  const containerRef = useRef(null)

  const features = [
    { icon: Zap, title: "Real-Time Neural Scanning", description: "Our proprietary AI inspects every pixel and frame to detect viral patterns in milliseconds.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: BarChart3, title: "Retention Forecasting", description: "Predict exactly where viewers will drop off before you even upload to social platforms.", color: "text-primary", bg: "bg-primary/10" },
    { icon: Hash, title: "Algorithm Benchmarking", description: "Compare your content against the top 1% of creators in your niche with real-time data.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: TrendingUp, title: "Viral Audio Sync", description: "Get recommendations for trending audio tracks that match your video's visual energy.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: ShieldCheck, title: "Copyright Pre-Check", description: "Ensure your content is safe for monetization with our built-in compliance engine.", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Globe, title: "Global Trend Alerts", description: "Stay ahead of the curve with daily alerts on viral trends from NYC to Tokyo.", color: "text-pink-500", bg: "bg-pink-500/10" }
  ]

  const stats = [
    { label: "Viral Videos Analyzed", value: "50M+" },
    { label: "Creator Success Rate", value: "84%" },
    { label: "Active Pro Users", value: "12k+" },
    { label: "Neural Speed", value: "< 2s" }
  ]

  const testimonials = [
    { name: "Alex Rivera", role: "Lifestyle Creator", text: "Go Viral changed my workflow. My retention jumped by 40% in just two weeks of using the hook analysis.", avatar: "AR" },
    { name: "Sarah Chen", role: "Tech Reviewer", text: "The most accurate virality predictor I've ever tested. It's like having a growth manager in your pocket.", avatar: "SC" },
    { name: "Jordan Mike", role: "Fitness Coach", text: "Finally, an AI that actually understands what makes a video stop the scroll. Pure genius design.", avatar: "JM" }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-background selection:bg-primary/30 relative overflow-x-hidden">
      <Navigation />

      <main className="grid-background">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-20 pb-32 overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 w-full h-full -z-20 bg-black/60" />
          <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-morph -z-10" />
          <div className="absolute bottom-20 left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-morph -z-10" style={{ animationDelay: "4s" }} />
          
          <div className="container relative mx-auto px-6 z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-center lg:text-left space-y-8"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-xl animate-border-glow"
                >
                  <Sparkles className="w-4 h-4 animate-float" />
                  The Future of Content Creation
                </motion.div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-balance font-[family-name:var(--font-space-grotesk)]">
                  <TextReveal text="Master the" />
                  <br />
                  <span className="text-gradient-primary">
                    <TextReveal text="Algorithm." delay={0.4} />
                  </span>
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto lg:mx-0"
                >
                  Predict virality before you post. Our Neural Engine scans your media to find the exact "thumb-stopping" moments that drive 10x engagement.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                >
                  <Magnetic>
                    <Button size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-primary/30 group relative overflow-hidden" asChild>
                      <Link href="/analyze">
                        <span className="relative z-10 flex items-center gap-2">
                          Analyze My First Video <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </Button>
                  </Magnetic>
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md" asChild>
                    <Link href="#how-it-works">Watch Demo</Link>
                  </Button>
                </motion.div>

                {/* Stats Mini Grid */}
                <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-white/5">
                  {stats.map((stat, i) => (
                    <StaggerItem key={i}>
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-white font-[family-name:var(--font-space-grotesk)]">{stat.value}</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">{stat.label}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>

              {/* Hero Mockup Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex-1 relative perspective-1000"
              >
                <div className="relative z-10 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden group card-shine">
                   <div className="rounded-[2.5rem] bg-zinc-900/50 aspect-square relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                         <div className="w-24 h-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                         <div className="space-y-2">
                            <p className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">AI SCALER v2</p>
                            <p className="text-sm text-primary font-[family-name:var(--font-jetbrains)] tracking-widest">CALCULATING VIRALITY...</p>
                         </div>
                      </div>
                      <div className="absolute top-10 right-10 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl animate-float">
                         <span className="text-xl font-black text-green-500">92%</span>
                      </div>
                      <div className="absolute bottom-10 left-10 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl animate-float-slow">
                         <div className="flex gap-1">
                            {[4,7,3,9,5].map((h, i) => <div key={i} className="w-1 bg-primary rounded-full" style={{ height: `${h*4}px` }} />)}
                         </div>
                      </div>
                   </div>
                </div>
                <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full -z-10 animate-glow" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="how-it-works" className="py-32 relative">
          <div className="container mx-auto px-6">
            <ScrollReveal style="fade-up">
              <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                  Three steps to <span className="text-gradient-primary">Stardom</span>
                </h2>
                <p className="text-xl text-muted-foreground font-light">We've simplified the complex science of social algorithms.</p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Upload Content", desc: "Drop your video, image, or even just a draft caption into our secure engine." },
                { step: "02", title: "Neural Scan", desc: "Our AI analyzes pacing, visual hooks, and semantic triggers against live trends." },
                { step: "03", title: "Go Viral", desc: "Get an actionable roadmap to optimize your content and dominate the explore page." }
              ].map((step, i) => (
                <ScrollReveal key={i} style={["flip-x", "zoom-in", "rotate-in"][i] as any} delay={i * 0.15}>
                  <motion.div 
                    whileHover={{ y: -10, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative p-10 rounded-[3rem] glass-card group overflow-hidden card-shine card-tilt"
                  >
                    <span className="text-6xl font-black text-white/5 absolute -top-2 -left-2 group-hover:text-primary/10 transition-colors duration-500 font-[family-name:var(--font-space-grotesk)]">{step.step}</span>
                    <h3 className="text-2xl font-bold mb-4 relative z-10 font-[family-name:var(--font-space-grotesk)]">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed relative z-10">{step.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID (BENTO) --- */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <ScrollReveal style="fade-up">
              <div className="text-center mb-24 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                  Engineered for <span className="text-gradient-primary">Growth</span>
                </h2>
                <p className="text-xl text-muted-foreground font-light">Everything you need to beat the algorithm, every single time.</p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <ScrollReveal key={i} style={scrollStyles[i % scrollStyles.length] as any} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group p-8 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all duration-500 card-shine"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-space-grotesk)]">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section className="py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              <ScrollReveal style="fade-left" className="max-w-xl space-y-8 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                  The secret weapon of <span className="text-gradient-primary">Elite Creators.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-light">Join the top 1% of digital storytellers who use Go Viral to maintain their advantage.</p>
                <div className="flex justify-center lg:justify-start gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
                  <span className="ml-2 font-bold text-white">4.9/5 Rating</span>
                </div>
              </ScrollReveal>
              
              <div className="flex-1 grid sm:grid-cols-2 gap-6 w-full">
                 {testimonials.map((t, i) => (
                   <ScrollReveal key={i} style={["fade-right", "zoom-in", "slide-rotate"][i] as any} delay={i * 0.2}>
                     <motion.div 
                       whileHover={{ scale: 1.03, rotateZ: i === 1 ? -1 : 1 }}
                       className={`p-8 rounded-[2rem] glass-card space-y-6 card-shine ${i === 2 ? 'sm:col-span-2' : ''}`}
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary font-[family-name:var(--font-space-grotesk)]">{t.avatar}</div>
                           <div>
                              <p className="font-bold font-[family-name:var(--font-space-grotesk)]">{t.name}</p>
                              <p className="text-xs text-muted-foreground">{t.role}</p>
                           </div>
                        </div>
                        <p className="text-muted-foreground italic font-light">"{t.text}"</p>
                     </motion.div>
                   </ScrollReveal>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA & FOOTER GLASS --- */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <ScrollReveal style="zoom-in">
              <FooterGlass />
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* --- FOOTER & CONTACT --- */}
      <footer className="pt-24 pb-12 border-t border-white/5 bg-black relative z-10">
        <div className="container mx-auto px-6">
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-4 gap-12 mb-20">
            <StaggerItem>
              <div className="space-y-6">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-xl tracking-tighter font-[family-name:var(--font-space-grotesk)]">GO VIRAL</span>
                </Link>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  The world's most advanced AI engine for content creators. Predict trends, analyze hooks, and grow faster.
                </p>
                <div className="flex gap-4">
                   <Twitter className="w-5 h-5 text-white/40 hover:text-primary cursor-pointer transition-colors hover:scale-110" />
                   <Instagram className="w-5 h-5 text-white/40 hover:text-primary cursor-pointer transition-colors hover:scale-110" />
                   <Youtube className="w-5 h-5 text-white/40 hover:text-primary cursor-pointer transition-colors hover:scale-110" />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-6">
                <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 font-[family-name:var(--font-space-grotesk)]">Platform</h4>
                <ul className="space-y-4 text-sm text-muted-foreground font-light">
                  <li><Link href="/analyze" className="hover:text-primary transition-colors">AI Analysis</Link></li>
                  <li><Link href="/history" className="hover:text-primary transition-colors">Report History</Link></li>
                  <li><Link href="/upgrade" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-6">
                <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 font-[family-name:var(--font-space-grotesk)]">Company</h4>
                <ul className="space-y-4 text-sm text-muted-foreground font-light">
                  <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-6">
                <h4 className="font-bold uppercase tracking-widest text-xs text-white/40 font-[family-name:var(--font-space-grotesk)]">Contact Support</h4>
                <ul className="space-y-4 text-sm text-muted-foreground font-light">
                  <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@goviral.ai</li>
                  <li className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Live Chat (24/7)</li>
                  <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> HQ: San Francisco, CA</li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
             <p className="text-[10px] uppercase font-bold tracking-[0.3em]">© 2026 GO VIRAL AI ENGINE. ALL RIGHTS RESERVED.</p>
             <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
                <Link href="#" className="hover:text-white">Privacy Policy</Link>
                <Link href="#" className="hover:text-white">Terms of Service</Link>
                <Link href="#" className="hover:text-white">Cookie Policy</Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
