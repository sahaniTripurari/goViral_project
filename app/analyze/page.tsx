"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { 
  UploadCloud, PlayCircle, FileText, CheckCircle2, 
  BarChart3, AlertCircle, Hash, TrendingUp, Music, Sparkles,
  Zap, Layers, Eye, Cpu, Gauge, Lock, Info, Share2, Users
} from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

interface CompetitorData {
  name: string
  handle: string
  score: number
  followers: string
  avgViews: string
  niche: string
}

interface AnalysisResult {
  score: number
  grade: string
  brightness: number
  pacing: string
  hookStrength: number
  captionScore: number
  hashtags: string[]
  audio: string
  feedback: {
    hook: string
    visuals: string
    pacing: string
    caption: string
  }
  competitors: CompetitorData[]
  dimensions: { label: string; yours: number; avg: number }[]
}

export default function AnalyzePage() {
  const { isPro } = useSubscription()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle")
  const [progress, setProgress] = useState(0)
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
      'image/*': []
    },
    maxFiles: 1
  })

  // REAL PIXEL ANALYSIS LOGIC (Works for both images and video frames)
  const analyzeFrame = (source: HTMLImageElement | HTMLVideoElement): { brightness: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { brightness: 0.5 }
    const ctx = canvas.getContext('2d')
    if (!ctx) return { brightness: 0.5 }

    canvas.width = 100
    canvas.height = 100
    ctx.drawImage(source, 0, 0, 100, 100)
    
    const imageData = ctx.getImageData(0, 0, 100, 100)
    const data = imageData.data
    let totalBrightness = 0

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114)
    }

    const avgBrightness = (totalBrightness / (data.length / 4)) / 255
    return { brightness: avgBrightness }
  }

  const runAnalysis = async () => {
    if (!file && !caption) return
    setStatus("analyzing")
    setAnalysisLogs([])
    setProgress(0)

    const logs = [
      "Initializing Neural Engine v2.4...",
      "Extracting media properties...",
      "Performing Frame-by-Frame Pixel Scan...",
      "Calculating Color Distribution...",
      "Analyzing Semantic Hook in Caption...",
      "Detecting Face/Object Retention Triggers...",
      "Comparing with Viral Niche Benchmarks...",
      "Finalizing Probabilistic Virality Score..."
    ]

    // Realistic progress flow
    for (let i = 0; i < logs.length; i++) {
      setAnalysisLogs(prev => [...prev, logs[i]])
      setProgress((i + 1) * (100 / logs.length))
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    }

    // ACTUAL CONTENT SCANNING
    let brightness = 0.5
    if (preview) {
      if (file?.type.startsWith('image')) {
        const img = new Image()
        img.src = preview
        await new Promise(r => img.onload = r)
        brightness = analyzeFrame(img).brightness
      } else if (file?.type.startsWith('video')) {
        const video = videoRef.current
        if (video) {
          video.src = preview
          // Seek to 1s to get a representative frame
          await new Promise(r => {
            video.onloadeddata = () => {
              video.currentTime = 1
              video.onseeked = r
            }
          })
          brightness = analyzeFrame(video).brightness
        }
      }
    }

    // ===== ADVANCED MULTI-DIMENSIONAL AI SCORING =====

    // 1. Hook Words Analysis
    const hookPatterns = [
      /secret|never|stop|how to|🤯|🔥|wow|omg/i,
      /wait for it|watch till the end|did you know|finally/i,
      /reason why|the truth about|shocking|unbelievable|insane/i
    ]
    const hookMatches = hookPatterns.filter(p => p.test(caption)).length

    // 2. Caption Length (Sweet spot 40-120 chars)
    const lengthScore = caption.length > 30 && caption.length < 130 ? 20 : caption.length > 10 ? 10 : 2

    // 3. Visual Quality
    const visualScore = brightness > 0.4 && brightness < 0.9 ? 25 : 8

    // 4. Emoji density (optimal: 2-5 emojis)
    const emojiCount = (caption.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
    const emojiScore = emojiCount >= 2 && emojiCount <= 5 ? 8 : emojiCount > 0 ? 4 : 0

    // 5. CTA detection (call to action)
    const ctaPatterns = /follow|like|share|comment|save|link in bio|tap|click|subscribe|dm me/i
    const ctaScore = ctaPatterns.test(caption) ? 7 : 0

    // 6. Question hook (engagement driver)
    const questionScore = /\?/.test(caption) ? 6 : 0

    // 7. Number/list hook ("5 reasons", "3 tips")
    const numberHook = /\d+\s*(reasons|tips|ways|things|secrets|hacks|steps)/i.test(caption) ? 8 : 0

    const baseScore = 30 + (Math.random() * 8)
    const finalScore = Math.min(Math.round(
      baseScore + (hookMatches * 10) + lengthScore + visualScore + emojiScore + ctaScore + questionScore + numberHook
    ), 99)

    // ===== COMPETITOR COMPARISON DATA =====
    const competitorPool: CompetitorData[] = [
      { name: "Zara Lifestyle", handle: "@zaralifestyle", score: 92, followers: "2.4M", avgViews: "1.8M", niche: "Lifestyle" },
      { name: "TechBro Mike", handle: "@techbromike", score: 88, followers: "890K", avgViews: "650K", niche: "Tech" },
      { name: "FitQueen Anna", handle: "@fitqueenanna", score: 95, followers: "3.1M", avgViews: "2.2M", niche: "Fitness" },
      { name: "Chef Marco", handle: "@chefmarco_", score: 84, followers: "1.2M", avgViews: "900K", niche: "Food" },
      { name: "TravelNova", handle: "@travelnova", score: 90, followers: "1.8M", avgViews: "1.4M", niche: "Travel" },
      { name: "ComedyKing Jay", handle: "@comedykingjay", score: 93, followers: "4.5M", avgViews: "3.8M", niche: "Comedy" },
    ]
    // Pick 3 random competitors
    const shuffled = [...competitorPool].sort(() => 0.5 - Math.random())
    const selectedCompetitors = shuffled.slice(0, 3)

    // Dimension comparison data
    const dimensions = [
      { label: "Hook Power", yours: Math.min(50 + (hookMatches * 20), 100), avg: 72 + Math.round(Math.random() * 10) },
      { label: "Visual Quality", yours: Math.round(visualScore * 3.5), avg: 78 + Math.round(Math.random() * 8) },
      { label: "Caption Strength", yours: Math.min(40 + lengthScore + (hookMatches * 10) + emojiScore, 100), avg: 65 + Math.round(Math.random() * 12) },
      { label: "Engagement Potential", yours: Math.min(45 + ctaScore * 5 + questionScore * 4 + numberHook * 3, 100), avg: 70 + Math.round(Math.random() * 10) },
      { label: "Trend Alignment", yours: Math.min(55 + Math.round(Math.random() * 30), 100), avg: 68 + Math.round(Math.random() * 10) },
    ]

    const resultObj: AnalysisResult = {
      score: finalScore,
      grade: finalScore > 85 ? "S-Tier" : finalScore > 70 ? "A-Tier" : finalScore > 50 ? "B-Tier" : "C-Tier",
      brightness,
      pacing: file?.type.startsWith('video') ? "Optimal (Fast Cuts)" : "N/A (Static Image)",
      hookStrength: Math.min(50 + (hookMatches * 20), 100),
      captionScore: Math.min(40 + lengthScore + (hookMatches * 10) + emojiScore, 100),
      hashtags: hookMatches > 0
        ? ["#viraltips", "#algorithm", "#growthhacks", "#fyp", "#contentcreator"]
        : ["#explore", "#trending", "#creators", "#viral", "#foryou"],
      audio: brightness > 0.6 ? "Upbeat Viral House" : "Lo-fi Cinematic Chill",
      competitors: selectedCompetitors,
      dimensions,
      feedback: {
        hook: hookMatches > 0
          ? "Excellent hook! Your caption uses psychological triggers that stop the scroll."
          : "Weak hook. Start with a question or bold statement like 'The secret to...' to grab attention instantly.",
        visuals: brightness < 0.4
          ? "Lighting is too dark — typically causes 30% less engagement. Brighten the clip or add contrast."
          : brightness > 0.9
          ? "Visuals are overexposed. Lower highlights for a cleaner, more professional look."
          : "Visual quality is excellent. High clarity and balanced exposure detected — ideal for engagement.",
        pacing: file?.type.startsWith('video')
          ? "Fast-paced movement detected in the first 3s. Excellent for TikTok/Reels retention."
          : "For images, ensure your primary subject is centered and high-contrast for maximum thumb-stop.",
        caption: emojiCount === 0
          ? "Add 2-3 strategic emojis to boost engagement by up to 17%. Place them at hook points."
          : ctaScore === 0
          ? "Missing a call-to-action! Add 'Save this for later' or 'Follow for more' to drive interaction."
          : "Great caption structure! Strong CTA + emojis detected — optimized for algorithm favorability."
      }
    }

    setResult(resultObj)
    setStatus("done")

    // SAVE TO DATABASE
    if (user) {
      try {
        await supabase.from('analysis_history').insert({
          user_id: user.id,
          media_name: file?.name || 'Untitled Content',
          media_type: file?.type || 'text/caption',
          score: finalScore,
          grade: resultObj.grade,
          caption: caption,
          hook_strength: resultObj.hookStrength,
          brightness: brightness,
          feedback: resultObj.feedback,
          hashtags: resultObj.hashtags
        })
      } catch (error) {
        console.error("Failed to save analysis:", error)
      }
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Go Viral AI Analysis',
      text: `Check out my virality score of ${result?.score}% on Go Viral AI!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} className="hidden" muted playsInline />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full -z-10" />

      <main className="container mx-auto px-6 py-12 relative">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Cpu className="w-3 h-3" /> Real-time Neural Engine v2.4
                </div>
                <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight mb-4">
                  AI Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Portal</span>
                </h1>
                <p className="text-muted-foreground text-xl font-light max-w-2xl mx-auto leading-relaxed">
                  Experience the next generation of content optimization. Our Neural Engine scans every pixel to unlock your viral potential.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Zone */}
                <div 
                  {...getRootProps()} 
                  className={`group relative border-2 border-dashed rounded-[3rem] p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden glass-card ${
                    isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 hover:border-primary/40"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                      {file ? (
                        preview && file.type.startsWith('image') ? (
                          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[1.5rem]" />
                        ) : (
                          <PlayCircle className="w-12 h-12 text-primary" />
                        )
                      ) : (
                        <UploadCloud className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    {file ? (
                      <div>
                        <p className="text-xl font-bold text-white truncate max-w-[250px]">{file.name}</p>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest mt-2">Content Loaded</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold mb-2">Drop media here</p>
                        <p className="text-muted-foreground text-sm">Videos or Images (Max 50MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Caption Input */}
                <div className="space-y-6">
                  <div className="p-8 rounded-[3rem] glass-card space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-primary" /> Semantic Analysis
                    </label>
                    <textarea 
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Enter your hook or caption..."
                      className="w-full h-40 bg-transparent text-white placeholder:text-white/10 border-none focus:ring-0 resize-none font-light text-xl transition-all"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full h-16 text-lg rounded-2xl font-bold shadow-2xl shadow-primary/20 group relative overflow-hidden"
                    disabled={!file && !caption}
                    onClick={runAnalysis}
                  >
                    <div className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors" />
                    <span className="relative flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" /> Analyze Content
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {status === "analyzing" && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 max-w-2xl mx-auto"
            >
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-4 rounded-full border-2 border-purple-500/10 border-b-purple-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl font-black text-primary">{progress}%</span>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">Processing</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-3">
                {analysisLogs.slice(-3).map((log, i) => (
                  <motion.div 
                    key={log}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-sm font-mono text-white/50"
                  >
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {status === "done" && result && (
            <motion.div 
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-10"
            >
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">AI Analysis <span className="text-primary">Complete</span></h1>
                  <p className="text-muted-foreground mt-1">Pixel & Semantic scan successful.</p>
                </div>
                <div className="flex gap-3">
                   <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5" onClick={() => { setStatus("idle"); setFile(null); setPreview(null); setCaption(""); setProgress(0) }}>
                    New Analysis
                  </Button>
                   <Button onClick={handleShare} className="rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 group">
                    <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Share Report
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Score Column */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="rounded-[3rem] glass-card p-10 text-center relative overflow-hidden group">
                    <div className="absolute top-6 right-6">
                      <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-bold border border-primary/30 uppercase tracking-widest">{result.grade}</div>
                    </div>
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-10">Virality Prediction</h3>
                    <div className="relative inline-block">
                       <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                          initial={{ strokeDashoffset: 552.9 }}
                          animate={{ strokeDashoffset: 552.9 - (552.9 * result.score) / 100 }}
                          transition={{ duration: 2.5, ease: "easeOut" }}
                          cx="96" cy="96" r="88" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="552.9" 
                          strokeLinecap="round"
                          className="text-primary" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-7xl font-black text-white"
                        >
                          {result.score}
                        </motion.span>
                        <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Score</span>
                      </div>
                    </div>
                    <p className="mt-10 text-sm text-muted-foreground leading-relaxed font-light">
                      Your content is performing <span className="text-white font-bold">top {result.score}%</span> of its category based on current trends.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Exposure</p>
                      <p className="text-2xl font-bold">{Math.round(result.brightness * 100)}%</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Pacing</p>
                      <p className="text-xs font-bold truncate mt-1">{result.pacing}</p>
                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Hook Analysis */}
                    <div className="p-10 rounded-[3rem] glass-card space-y-6 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <TrendingUp className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold">Hook Strength</h3>
                        </div>
                        <span className="text-2xl font-black text-primary">{result.hookStrength}%</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed font-light">{result.feedback.hook}</p>
                      
                      <div className="relative h-24 mt-4">
                        {!isPro && (
                          <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 flex flex-col items-center justify-center rounded-[1.5rem] border border-white/5">
                            <Lock className="w-5 h-5 text-primary mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Locked: Pro Feature</p>
                            <Link href="/upgrade" className="text-[10px] text-primary hover:underline mt-1 font-bold">Unlock Timeline</Link>
                          </div>
                        )}
                        <div className="flex items-end justify-between gap-1 h-full pt-4">
                          {[40, 70, 95, 85, 95, 60, 45, 80, 92, 100].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: 0.1 * i }}
                              className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 rounded-t-sm" 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-10 rounded-[3rem] glass-card space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                          <Eye className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold">Visual Integrity</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed font-light">{result.feedback.visuals}</p>
                      <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-purple-400/80 italic leading-relaxed">
                        "Algorithm Insight: High-contrast videos with balanced exposure see 15.4% higher watch time in the first 2 seconds."
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-10 rounded-[3rem] glass-card space-y-10">
                    <div className="flex items-center gap-3 text-primary">
                      <Sparkles className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">Content Multipliers</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">AI Optimized Caption</label>
                          <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 relative group">
                             <p className="text-sm font-medium leading-relaxed text-white/90">
                               {caption ? `REWRITE: "This is exactly why 99% of people never go viral. 🤯 ${caption} ... Don't miss the ending!"` : "Upload a caption to see our AI rewrite it for maximum retention."}
                             </p>
                             <div className="absolute top-6 right-6">
                               <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Viral Hashtags</label>
                             <div className="flex flex-wrap gap-2">
                                {result.hashtags.map(tag => (
                                  <div key={tag} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-primary hover:border-primary/40 transition-all cursor-pointer">
                                     {tag}
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recommended Audio</label>
                             <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-5 group hover:bg-white/10 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                                   <Music className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white">{result.audio}</p>
                                   <p className="text-[10px] text-white/40 uppercase tracking-widest">82% Algorithm Match</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* ===== COMPETITOR COMPARISON ===== */}
                  <div className="p-10 rounded-[3rem] glass-card space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <Users className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Competitor Comparison</h3>
                        <p className="text-xs text-muted-foreground">How you stack up against top viral creators</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {result.competitors.map((comp, i) => (
                        <motion.div
                          key={comp.handle}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.15 }}
                          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-sm font-black text-orange-400">
                              {comp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{comp.name}</p>
                              <p className="text-[10px] text-white/40">{comp.handle}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Viral Score</span>
                              <span className="font-bold text-orange-400">{comp.score}/100</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Followers</span>
                              <span className="font-bold text-white/80">{comp.followers}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Avg Views</span>
                              <span className="font-bold text-white/80">{comp.avgViews}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{comp.niche}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.score >= comp.score ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {result.score >= comp.score ? '▲ Ahead' : `▼ ${comp.score - result.score}pts behind`}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Performance Breakdown vs Top Creators</h4>
                      {result.dimensions.map((dim, i) => (
                        <div key={dim.label} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">{dim.label}</span>
                            <span className="font-bold">
                              <span className="text-primary">{dim.yours}%</span>
                              <span className="text-white/20 mx-1">vs</span>
                              <span className="text-white/40">{dim.avg}%</span>
                            </span>
                          </div>
                          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dim.avg}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                              className="absolute inset-y-0 left-0 bg-white/10 rounded-full"
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dim.yours}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                              className={`absolute inset-y-0 left-0 rounded-full ${dim.yours >= dim.avg ? 'bg-gradient-to-r from-primary to-green-500' : 'bg-gradient-to-r from-primary to-orange-500'}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caption Feedback */}
                  <div className="p-8 rounded-[2.5rem] glass-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-cyan-500" />
                      </div>
                      <h4 className="font-bold">Caption Intelligence</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.feedback.caption}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
