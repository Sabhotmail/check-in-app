import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { BottomNav } from '../components/BottomNav'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: checkIns } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col items-center min-h-screen p-4 pb-24">
            <header className="flex w-full max-w-md justify-between items-center py-6 mb-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-sans tracking-tight">History</h1>
                <Link href="/" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                    Back
                </Link>
            </header>

            <main className="flex-1 w-full max-w-md space-y-4 no-scrollbar">
                {!checkIns || checkIns.length === 0 ? (
                    <GlassCard className="p-8 text-center text-slate-500">
                        <span className="text-4xl block mb-2">📅</span>
                        No check-ins found.
                    </GlassCard>
                ) : (
                    <ul className="space-y-4">
                        {checkIns.map((checkIn, index) => (
                            <li key={checkIn.id}>
                                <GlassCard className="p-4 flex items-center space-x-4 border-slate-800/50 hover:border-indigo-500/30">
                                    <div className="h-16 w-16 bg-slate-800 rounded-2xl overflow-hidden shrink-0 relative ring-1 ring-white/10">
                                        {checkIn.selfie_url ? (
                                            <img
                                                src={checkIn.selfie_url}
                                                alt="Selfie"
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-600 font-mono">NO_IMG</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div className="font-mono text-xl font-bold text-white tracking-tighter">
                                                {new Date(checkIn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </div>
                                            <div className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 uppercase tracking-widest">
                                                Verified
                                            </div>
                                        </div>
                                        <div className="text-slate-400 text-xs font-medium">
                                            {new Date(checkIn.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-1.5 font-mono">
                                            <span className="text-emerald-500">📍</span>
                                            {checkIn.location_lat.toFixed(6)}, {checkIn.location_lng.toFixed(6)}
                                        </div>
                                    </div>
                                </GlassCard>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            <BottomNav />
        </div>
    )
}

