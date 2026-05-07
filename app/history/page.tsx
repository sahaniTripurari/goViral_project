"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { 
  History as HistoryIcon, 
  ChevronRight, 
  Clock, 
  BarChart3, 
  Zap, 
  FileText, 
  Calendar,
  Trash2,
  TrendingUp,
  Search,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  id: string
  media_name: string
  media_type: string
  score: number
  grade: string
  caption: string
  created_at: string
}

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!authLoading && user) {
      fetchHistory()
    } else if (!authLoading && !user) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("Supabase Error Details:", error.message, error.details, error.hint)
        throw error
      }
      setHistory(data || [])
    } catch (error: any) {
      console.error("Detailed Fetch Error:", error?.message || error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const filteredHistory = history.filter(item => 
    item.media_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.caption?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Please sign in to view your analysis history.</p>
          <Button asChild className="rounded-xl">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="container mx-auto px-6 py-12 relative">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <HistoryIcon className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Analysis <span className="text-primary">History</span></h1>
              </div>
              <p className="text-muted-foreground font-light">Track your content growth and viral evolution.</p>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl focus:ring-primary focus:border-primary text-sm transition-all"
              />
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="grid gap-4">
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-primary/40 transition-all"
                  >
                    {/* Score Circle */}
                    <div className="shrink-0 relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      <span className="text-xl font-black text-white group-hover:text-primary transition-colors">{item.score}</span>
                      <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-primary text-[8px] font-bold uppercase tracking-widest">{item.grade}</div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1 text-center md:text-left">
                      <h3 className="font-bold text-white truncate">{item.media_name}</h3>
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(item.created_at))}</span>
                        <span className="flex items-center gap-1 uppercase font-bold tracking-widest text-[10px] text-primary">{item.media_type.split('/')[0]}</span>
                      </div>
                      {item.caption && (
                        <p className="text-xs text-white/40 truncate max-w-md italic mt-1">"{item.caption}"</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                       <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10 hover:text-destructive text-white/30" onClick={() => deleteHistoryItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 flex items-center gap-2 group/btn" asChild>
                        <Link href="/analyze">
                          Re-Analyze <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6 bg-white/5 border border-white/10 rounded-[3rem]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <HistoryIcon className="w-10 h-10 text-white/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">No history yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto font-light">Start your virality journey by analyzing your first piece of content.</p>
                </div>
                <Button size="lg" className="rounded-2xl font-bold shadow-xl shadow-primary/20" asChild>
                  <Link href="/analyze">Analyze Now</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
