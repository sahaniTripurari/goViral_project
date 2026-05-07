"use client"

import { Navigation } from "@/components/navigation"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight, Zap, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      title: "How AI is Changing Content Pacing in 2026",
      desc: "Deep dive into the neural patterns that keep viewers watching beyond the first 3 seconds.",
      category: "Algorithm",
      date: "May 5, 2026",
      author: "Alex Rivera",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "The 'Secret' Hook That Doubled Retention",
      desc: "Our latest study on over 50 million viral videos reveals a common semantic thread.",
      category: "Growth",
      date: "May 2, 2026",
      author: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Monetization vs. Virality: Finding the Balance",
      desc: "How to maintain high engagement while scaling your creator business profitably.",
      category: "Business",
      date: "April 28, 2026",
      author: "Jordan Mike",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    }
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full -z-10" />
      
      <main className="container mx-auto px-6 py-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-20"
        >
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight">
              Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-xl mx-auto">
              Stay updated with the latest research on social algorithms and creator economy trends.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col glass-card rounded-[3rem] overflow-hidden hover:scale-[1.02] transition-all duration-500"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {post.category}
                  </div>
                </div>
                <div className="p-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-light">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed flex-1">{post.desc}</p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between group/btn">
                    <span className="text-sm font-bold text-white group-hover/btn:text-primary transition-colors">Read Full Post</span>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover/btn:text-primary group-hover/btn:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
