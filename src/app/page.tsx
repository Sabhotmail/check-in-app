import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from './components/SignOutButton'
import { CheckInForm } from './components/CheckInForm'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const now = new Date()

  return (
    <div className="flex flex-col items-center min-h-screen text-white p-4 pb-24">
      <header className="flex w-full max-w-md justify-between items-center py-6">
        <h1 className="text-xl font-bold font-sans tracking-tight">Check In</h1>
        <SignOutButton />
      </header>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center space-y-8">
        <CheckInForm />
      </main>

      <nav className="fixed bottom-6 w-[calc(100%-2rem)] max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 flex justify-around shadow-2xl z-50">
        <Link href="/" className="flex flex-col items-center justify-center p-2 rounded-xl text-indigo-400 bg-indigo-500/10 w-full mx-1">
          <span className="text-xs font-bold uppercase tracking-wider">Clock</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 w-full mx-1 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider">History</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 w-full mx-1 transition-all">
          {/* Using dashboard link instead of leave for now since dashboard has leaves */}
          <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
        </Link>
      </nav>
    </div>
  )
}
