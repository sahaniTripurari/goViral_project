"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreditCard, LogOut, Trash2, Sparkles, User, Settings, ShieldCheck, Flame, Zap, Camera, Edit3, BarChart3, TrendingUp, Calendar, Award, Globe, Bell, Eye, Moon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileClientProps {
  user: { id: string; email?: string }
}

export function ProfileClient({ user }: ProfileClientProps) {
  const { isPro, tier, downgradeToFree, refresh } = useSubscription()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDowngrading, setIsDowngrading] = useState(false)
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Settings toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [publicProfile, setPublicProfile] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved profile data from localStorage
    const saved = localStorage.getItem(`profile_${user.id}`)
    if (saved) {
      const data = JSON.parse(saved)
      setUserPhoto(data.photo || null)
      setDisplayName(data.name || "")
      setBio(data.bio || "")
      setEmailAlerts(data.emailAlerts ?? true)
      setDarkMode(data.darkMode ?? true)
      setPublicProfile(data.publicProfile ?? false)
    }
  }, [user.id])

  const saveProfile = useCallback((updates: Record<string, unknown>) => {
    const saved = localStorage.getItem(`profile_${user.id}`)
    const data = saved ? JSON.parse(saved) : {}
    const merged = { ...data, ...updates }
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(merged))
  }, [user.id])

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try { await fetch("/api/auth/signout", { method: "POST" }) } catch (e) { console.error(e) }
    window.location.href = "/"
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch("/api/account/delete", { method: "POST" })
      if (!res.ok) throw new Error((await res.json()).error || "Failed")
      localStorage.removeItem(`profile_${user.id}`)
      setShowDeleteDialog(false)
      window.location.href = "/"
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete account.")
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDowngrade = async () => {
    setIsDowngrading(true)
    try {
      await downgradeToFree()
      setShowDowngradeDialog(false)
      toast.success("Downgraded to Free plan.")
    } catch (e) {
      console.error(e)
      toast.error("Failed to downgrade.")
    } finally { setIsDowngrading(false) }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB."); return }
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setUserPhoto(result)
      saveProfile({ photo: result })
      toast.success("Profile photo updated!")
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const removePhoto = () => {
    setUserPhoto(null)
    saveProfile({ photo: null })
    toast.success("Photo removed.")
  }

  const saveName = () => {
    setIsEditingName(false)
    saveProfile({ name: displayName })
    toast.success("Name updated!")
  }

  const saveBio = () => {
    setIsEditingBio(false)
    saveProfile({ bio })
    toast.success("Bio updated!")
  }

  const ToggleSwitch = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${active ? "bg-primary" : "bg-white/10"}`}>
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
        animate={{ left: active ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <Navigation />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6 py-16 relative">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-8">

          {/* Profile Header with Photo Upload */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-white/5">
            <div
              ref={dropZoneRef}
              className="relative group"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 ${isDragging ? "border-primary border-dashed scale-105" : "border-white/10"} flex items-center justify-center shadow-2xl overflow-hidden relative transition-all duration-300 profile-avatar-ring`}>
                <AnimatePresence mode="wait">
                  {userPhoto ? (
                    <motion.img key="photo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1">
                      <User className="w-10 h-10 text-primary/40" />
                      <span className="text-[8px] text-white/30 font-bold uppercase tracking-wider">Drop Image</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm">
                  <Camera className="w-6 h-6 text-primary mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Change</span>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              {userPhoto && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 mb-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name"
                      className="text-3xl font-bold tracking-tight bg-transparent border-b-2 border-primary outline-none font-[family-name:var(--font-space-grotesk)] w-64"
                      onKeyDown={(e) => e.key === "Enter" && saveName()} autoFocus />
                    <Button size="sm" onClick={saveName} className="rounded-xl">Save</Button>
                  </div>
                ) : (
                  <h1 onClick={() => setIsEditingName(true)} className="text-3xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] cursor-pointer group flex items-center gap-2 hover:text-primary transition-colors">
                    {displayName || "Creator Dashboard"}
                    <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h1>
                )}
                {isPro && (
                  <span className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest animate-border-glow">PRO</span>
                )}
              </div>
              <p className="text-muted-foreground font-light">{user.email || "No email"}</p>

              {isEditingBio ? (
                <div className="flex items-start gap-2 mt-2">
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the world about yourself..."
                    className="text-sm bg-white/5 border border-white/10 rounded-xl p-3 outline-none w-full resize-none h-20 focus:border-primary transition-colors" />
                  <Button size="sm" onClick={saveBio} className="rounded-xl mt-1">Save</Button>
                </div>
              ) : (
                <p onClick={() => setIsEditingBio(true)} className="text-sm text-muted-foreground cursor-pointer hover:text-white transition-colors group flex items-center gap-1 mt-1">
                  {bio || "Click to add bio..."} <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, label: "Analyses", value: "24", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: TrendingUp, label: "Avg Score", value: "87%", color: "text-green-400", bg: "bg-green-500/10" },
              { icon: Calendar, label: "Member Since", value: "2026", color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: Award, label: "Streak", value: "12d", color: "text-orange-400", bg: "bg-orange-500/10" },
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }} className="p-5 rounded-2xl glass-card profile-stat-card card-shine">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black font-[family-name:var(--font-space-grotesk)]">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Sidebar */}
            <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl glass-card space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <Settings className="w-3 h-3" /> Preferences
                </h3>
                {[
                  { label: "Email Alerts", icon: Bell, active: emailAlerts, toggle: () => { setEmailAlerts(!emailAlerts); saveProfile({ emailAlerts: !emailAlerts }) } },
                  { label: "Dark Mode", icon: Moon, active: darkMode, toggle: () => { setDarkMode(!darkMode); saveProfile({ darkMode: !darkMode }) } },
                  { label: "Public Profile", icon: Eye, active: publicProfile, toggle: () => { setPublicProfile(!publicProfile); saveProfile({ publicProfile: !publicProfile }) } },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/60 flex items-center gap-2"><pref.icon className="w-4 h-4 text-white/30" />{pref.label}</span>
                    <ToggleSwitch active={pref.active} onToggle={pref.toggle} />
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Security
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your account is protected by Supabase's military-grade encryption and secure auth protocols.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-3xl glass-card">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <Globe className="w-3 h-3" /> Connected Accounts
                </h3>
                {["Instagram", "TikTok", "YouTube"].map((platform, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white/60">{platform}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/20 px-2 py-1 rounded-lg bg-white/5">Coming Soon</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants} className="md:col-span-3 space-y-6">
              {/* Plan Management */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition" />
                <Card className="relative glass-card p-8 rounded-[2rem] overflow-hidden border-none">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">Plan Management</h2>
                    </div>
                  </div>

                  {isPro ? (
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Flame className="w-6 h-6 text-primary fill-primary/20" />
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-wider">Current Tier</p>
                            <p className="text-lg font-bold text-primary font-[family-name:var(--font-space-grotesk)]">Go Viral Pro</p>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">Active</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-4">
                        {mounted && (
                          <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" className="text-xs text-muted-foreground hover:text-white hover:bg-white/5" disabled={isDowngrading}>Switch to Basic</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-black/90 border-white/10 rounded-3xl backdrop-blur-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">Downgrade?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">You'll lose Pro features immediately.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel className="rounded-xl bg-white/5 border-white/10" disabled={isDowngrading}>Keep Pro</AlertDialogCancel>
                                <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDowngrade() }} disabled={isDowngrading} className="rounded-xl bg-destructive text-destructive-foreground">
                                  {isDowngrading ? "Downgrading..." : "Confirm"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <p className="text-[10px] text-muted-foreground italic">Renews next month</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Current Tier</p>
                        <p className="text-lg font-bold text-white/80 italic font-[family-name:var(--font-space-grotesk)]">Basic Creator</p>
                      </div>
                      <Link href="/upgrade">
                        <Button size="sm" className="rounded-xl font-bold flex items-center gap-2"><Zap className="w-4 h-4" /> Get Pro</Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </div>

              {/* Account Safety */}
              <Card className="glass-card p-8 rounded-[2rem] border-none">
                <h2 className="text-xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]">Account Safety</h2>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-14 rounded-2xl justify-start text-white border-white/10 bg-transparent hover:bg-white/5 group" onClick={handleLogout} disabled={isLoggingOut}>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    {isLoggingOut ? "Ending Session..." : "Secure Sign Out"}
                  </Button>

                  {mounted && (
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full h-14 rounded-2xl justify-start text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent group" disabled={isDeleting}>
                          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center mr-4"><Trash2 className="w-4 h-4" /></div>
                          Permanent Account Deletion
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black/90 border-red-500/20 rounded-3xl backdrop-blur-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold text-destructive font-[family-name:var(--font-space-grotesk)]">Destroy Account?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-3 pt-2">
                            <p className="text-white/80 font-medium">This is permanent and cannot be reversed.</p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />All history will be wiped.</li>
                              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />Pro subscription terminated.</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8">
                          <AlertDialogCancel disabled={isDeleting} className="rounded-xl border-white/10 bg-white/5">Keep Data</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDeleteAccount() }} disabled={isDeleting} className="rounded-xl bg-destructive text-destructive-foreground">
                            {isDeleting ? "Wiping..." : "Destroy Everything"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
