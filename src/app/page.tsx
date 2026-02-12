import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from './components/SignOutButton'
import { CheckInForm } from './components/CheckInForm'
import { BottomNav } from './components/BottomNav'

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

      <BottomNav />
    </div>
  )
}
