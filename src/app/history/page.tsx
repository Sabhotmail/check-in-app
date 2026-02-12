import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
        <div className="flex flex-col items-center min-h-screen bg-black text-white p-4">
            <header className="flex w-full max-w-md justify-between items-center py-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">History</h1>
                <Link href="/" className="text-sm text-indigo-400">Back</Link>
            </header>

            <main className="flex-1 w-full max-w-md mt-4 overflow-y-auto pb-20 no-scrollbar">
                {!checkIns || checkIns.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">No check-ins found.</div>
                ) : (
                    <ul className="space-y-4">
                        {checkIns.map((checkIn) => (
                            <li key={checkIn.id} className="bg-gray-900 rounded-xl p-4 flex items-center space-x-4 border border-gray-800">
                                <div className="h-16 w-16 bg-gray-800 rounded-lg overflow-hidden shrink-0 relative">
                                    {checkIn.selfie_url ? (
                                        <img
                                            src={checkIn.selfie_url}
                                            alt="Selfie"
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-600">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-mono text-lg font-bold truncate">
                                        {new Date(checkIn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        {new Date(checkIn.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-indigo-400 text-xs mt-1 truncate">
                                        📍 {checkIn.location_lat.toFixed(6)}, {checkIn.location_lng.toFixed(6)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            <nav className="fixed bottom-0 w-full max-w-md bg-gray-900/80 backdrop-blur-md border-t border-gray-800 p-4 flex justify-around pb-6">
                <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-gray-300">
                    <span className="text-xs font-medium">Clock</span>
                </Link>
                <Link href="/history" className="flex flex-col items-center text-indigo-400">
                    <span className="text-xs font-medium">History</span>
                </Link>
                <Link href="/leave" className="flex flex-col items-center text-gray-500 hover:text-gray-300">
                    <span className="text-xs font-medium">Leave</span>
                </Link>
            </nav>
        </div>
    )
}
