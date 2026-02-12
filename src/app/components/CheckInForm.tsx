'use client'

import { useState } from 'react'
import { CameraCapture } from './CameraCapture'
import { useGeolocation } from '@/hooks/useGeolocation'
import { submitCheckIn } from '../actions'
import { GlassCard } from '@/components/ui/GlassCard'
import { motion } from 'framer-motion'

export function CheckInForm() {
    const [image, setImage] = useState<string | null>(null)
    const { location, error: geoError, loading: geoLoading, retry } = useGeolocation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)

    const handleCapture = (imgSrc: string) => {
        setImage(imgSrc)
        setStatusMessage(null)
    }

    const handleRetake = () => {
        setImage(null)
        setStatusMessage(null)
    }

    const handleSubmit = async () => {
        if (!image) {
            setStatusMessage('Please take a photo first.')
            return
        }
        if (!location) {
            setStatusMessage('Waiting for location...')
            return
        }

        setIsSubmitting(true)
        setStatusMessage(null)

        try {
            const res = await fetch(image)
            const blob = await res.blob()
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })

            const formData = new FormData()
            formData.append('image', file)
            formData.append('lat', location.lat.toString())
            formData.append('lng', location.lng.toString())

            const result = await submitCheckIn(formData)

            if (result.error) {
                setStatusMessage(result.error)
            } else {
                setStatusMessage('Check-in successful!')
                setTimeout(() => {
                    setImage(null)
                    setStatusMessage(null)
                }, 2000)
            }
        } catch (err) {
            setStatusMessage('An unexpected error occurred.')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            <GlassCard className="relative w-full text-center p-8 border-slate-700/50">
                <div className="text-6xl font-mono mb-2 tracking-wider font-light text-slate-100">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="text-indigo-400 mb-8 uppercase tracking-widest text-xs font-bold">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="bg-slate-900/50 aspect-square w-full rounded-2xl mb-6 relative overflow-hidden ring-1 ring-slate-700 shadow-2xl">
                    <CameraCapture
                        onCapture={handleCapture}
                        onRetake={handleRetake}
                        previewSrc={image}
                    />
                </div>

                {geoError && (
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <p className="text-rose-400 text-sm bg-rose-500/10 p-2 rounded">{geoError}</p>
                        <button
                            onClick={() => retry()}
                            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                        >
                            Retry GPS
                        </button>
                    </div>
                )}

                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm mb-4 p-3 rounded-lg font-medium ${statusMessage.includes('successful')
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                    >
                        {statusMessage}
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!image || !location || isSubmitting}
                    className={`w-full font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-2
                        ${!image || !location || isSubmitting
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-500/25 border border-indigo-400/20'}`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            CHECKING IN...
                        </>
                    ) : (
                        'CHECK IN NOW'
                    )}
                </motion.button>

                <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500 font-mono">
                    <span className={`h-2 w-2 rounded-full shadow-[0_0_10px_currentColor] ${location ? 'bg-emerald-500 text-emerald-500' : 'bg-amber-500 text-amber-500 animate-pulse'}`}></span>
                    <span className="tracking-wider">{location ? `LOC: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'ACQUIRING SATELLITE FIX...'}</span>
                </div>
            </GlassCard>
        </div>
    )
}
