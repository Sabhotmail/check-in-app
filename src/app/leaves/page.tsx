import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LeaveForm } from './LeaveForm'
import { GlassCard } from '@/components/ui/GlassCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeavesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: leaves } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col items-center min-h-screen p-4 pb-24">
            <header className="flex w-full max-w-md justify-between items-center py-6 mb-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-sans tracking-tight">Leaves</h1>
                <Link href="/" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                    Back
                </Link>
            </header>

            <main className="w-full max-w-md space-y-8">
                <LeaveForm />

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Request History</h3>
                    {!leaves || leaves.length === 0 ? (
                        <div className="text-center py-10 text-slate-600 text-xs font-bold uppercase tracking-widest">
                            No requests found
                        </div>
                    ) : (
                        leaves.map((leave) => (
                            <GlassCard key={leave.id} className="p-4 flex items-center justify-between border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner">
                                        {leave.type === 'sick' ? '🤒' : leave.type === 'vacation' ? '🌴' : leave.type === 'personal' ? '🏠' : '📝'}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">{leave.type}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md border ${leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    leave.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                    {leave.status}
                                </div>
                            </GlassCard>
                        ))
                    )}
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-6 w-[calc(100%-2rem)] max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 flex justify-around shadow-2xl z-50">
                <Link href="/" className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 w-full mx-1 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider">Clock</span>
                </Link>
                <Link href="/history" className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 w-full mx-1 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider">History</span>
                </Link>
                <Link href="/leaves" className="flex flex-col items-center justify-center p-2 rounded-xl text-indigo-400 bg-indigo-500/10 w-full mx-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Leaves</span>
                </Link>
                <Link href="/dashboard" className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 w-full mx-1 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
                </Link>
            </nav>
        </div>
    )
}
