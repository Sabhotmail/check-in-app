'use client'

import { login, signup } from './actions'
import { GlassCard } from '@/components/ui/GlassCard'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginError() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    if (!error) return null

    return (
        <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {error}
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]"></div>

            <GlassCard className="w-full max-w-sm space-y-8 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-2 text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 font-sans">
                        Check In
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to start your shift
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-xl border-0 bg-slate-900/50 py-4 px-4 text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-xl border-0 bg-slate-900/50 py-4 px-4 text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            formAction={login}
                            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sign in
                        </button>
                        <button
                            formAction={signup}
                            className="group relative flex w-full justify-center rounded-xl border border-slate-700 bg-transparent px-4 py-4 text-sm font-semibold text-slate-300 hover:bg-slate-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-all"
                        >
                            Create account
                        </button>
                    </div>

                    <Suspense>
                        <LoginError />
                    </Suspense>
                </form>
            </GlassCard>
        </div>
    )
}
