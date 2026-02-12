import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckIn } from '@/types/dashboard'
import { RecentActivityList } from './RecentActivityList'
import { StatsCard } from './StatsCard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Get start of today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch today's checkins
    const { data: checkIns } = await supabase
        .from('check_ins')
        .select('*, profiles(full_name, role)')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })

    // Fetch pending leave requests
    const { count: pendingLeaves } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    return (
        <div className="p-8 space-y-8 min-h-screen bg-transparent">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 drop-shadow-sm font-sans tracking-tight">Dashboard</h2>
                    <p className="text-slate-400 font-medium">Overview for {today.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <StatsCard label="Check-ins" value={checkIns?.length || 0} delay={0.1} />
                    <StatsCard label="Pending Leaves" value={pendingLeaves || 0} color="text-indigo-400" delay={0.2} />

                    <a href="/api/export" className="glass-card p-4 w-40 flex flex-col items-center justify-center transition-all hover:bg-slate-800/80 group cursor-pointer border-t-2 border-t-white/5 hover:border-t-emerald-500/50">
                        <span className="text-2xl group-hover:scale-110 transition-transform mb-1">⬇️</span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold group-hover:text-emerald-400 transition-colors">Export CSV</span>
                    </a>
                </div>
            </header>

            <section>
                <h3 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Recent Activity
                </h3>
                <RecentActivityList checkIns={checkIns as unknown as CheckIn[]} />
            </section>
        </div>
    )
}
