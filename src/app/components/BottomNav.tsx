'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { label: 'Clock', href: '/', active: pathname === '/' },
        { label: 'History', href: '/history', active: pathname === '/history' },
        { label: 'Leaves', href: '/leaves', active: pathname === '/leaves' },
        { label: 'Admin', href: '/dashboard', active: pathname.startsWith('/dashboard') },
    ]

    return (
        <nav className="fixed bottom-6 w-[calc(100%-2rem)] max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 flex justify-around shadow-2xl z-50">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl w-full mx-1 transition-all ${item.active
                            ? 'text-indigo-400 bg-indigo-500/10'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                </Link>
            ))}
        </nav>
    )
}
