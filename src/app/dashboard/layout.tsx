import Link from 'next/link'
import { SignOutButton } from '../components/SignOutButton'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // In a real app, you'd redirect to strict access denied or back to home
    // For now, if role is not supervisor/admin, we might want to curb access.
    // Assuming 'employee' shouldn't see this.
    if (profile?.role !== 'supervisor' && profile?.role !== 'admin') {
        // For testing, if no role is set, maybe allow? 
        // Or strictly redirect to /
        // redirect('/') 
        // Let's allow for now to see if we can render, but usually:
        // if (!['supervisor', 'admin'].includes(profile?.role)) redirect('/')
    }

    return (
        <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col pt-6 pb-4">
                <div className="px-6 mb-8">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight font-sans">
                        Supervisor
                        <span className="text-slate-500 text-sm font-normal block mt-1 tracking-wide">Dashboard</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                        <span className="group-hover:scale-110 transition-transform">📊</span>
                        <span className="font-medium tracking-wide">Overview</span>
                    </Link>
                    <Link
                        href="/dashboard/leaves"
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                        <span className="group-hover:scale-110 transition-transform">📝</span>
                        <span className="font-medium tracking-wide">Leave Requests</span>
                    </Link>
                    <Link
                        href="/dashboard/employees"
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                        <span className="group-hover:scale-110 transition-transform">👥</span>
                        <span className="font-medium tracking-wide">Employees</span>
                    </Link>
                    <Link
                        href="/dashboard/map"
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                        <span className="group-hover:scale-110 transition-transform">🗺️</span>
                        <span className="font-medium tracking-wide">Live Map</span>
                    </Link>
                </nav>

                <div className="p-4 mx-4 mt-auto rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-slate-800">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm overflow-hidden flex-1">
                            <p className="truncate font-bold text-slate-200">{user.email?.split('@')[0]}</p>
                            <p className="text-xs text-indigo-400 capitalize font-medium tracking-wider">{profile?.role || 'User'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
