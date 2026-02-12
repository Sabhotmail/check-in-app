'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-rose-500/20"
        >
            Sign Out
        </button>
    )
}
