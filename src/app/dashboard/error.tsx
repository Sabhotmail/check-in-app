'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-400">Something went wrong!</h2>
                <p className="text-gray-400 max-w-md mx-auto">{error.message || 'Failed to load dashboard data.'}</p>
            </div>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
                Try again
            </button>
        </div>
    )
}
