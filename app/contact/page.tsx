"use client"

import { Navigation } from "@/components/navigation"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Globe, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <main className="container mx-auto px-6 py-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-xl mx-auto">
              Have questions? Our support team is available 24/7 to help you scale your content.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {[
                { icon: Mail, label: "Email Support", value: "support@goviral.ai" },
                { icon: MessageSquare, label: "Live Chat", value: "Available 24/7" },
                { icon: MapPin, label: "HQ Location", value: "San Francisco, CA" }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] glass-card flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 p-10 rounded-[3rem] glass-card">
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Full Name</label>
                    <input type="text" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-primary outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Email Address</label>
                    <input type="email" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Message</label>
                  <textarea className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-primary outline-none transition-all resize-none" placeholder="Tell us how we can help..." />
                </div>
                <Button size="lg" className="h-16 px-10 rounded-2xl font-bold w-full md:w-auto shadow-2xl shadow-primary/20 flex items-center gap-2 group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
