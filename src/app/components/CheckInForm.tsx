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
            {/* Animated background glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full"
            ></motion.div>

            <GlassCard className="relative w-full text-center p-8 border-slate-700/50 shadow-2xl backdrop-blur-2xl">
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl font-mono mb-2 tracking-tighter font-bold text-white neo-glow"
                    >
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </motion.div>
                    <p className="text-indigo-400 uppercase tracking-[0.3em] text-[10px] font-black">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="bg-slate-950 aspect-square w-full rounded-[2.5rem] mb-8 relative overflow-hidden ring-1 ring-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <CameraCapture
                        onCapture={handleCapture}
                        onRetake={handleRetake}
                        previewSrc={image}
                    />
                </div>

                {geoError && (
                    <div className="flex flex-col items-center gap-2 mb-6 p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                        <p className="text-rose-400 text-xs font-medium">{geoError}</p>
                        <button
                            onClick={() => retry()}
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                        >
                            Retry Satellite Fix
                        </button>
                    </div>
                )}

                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs mb-6 p-4 rounded-2xl font-bold uppercase tracking-widest border ${statusMessage.includes('successful')
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 neo-glow-emerald'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                    >
                        {statusMessage}
                    </motion.div>
                )}

                <motion.button
                    whileHover={(!image || !location || isSubmitting) ? {} : { scale: 1.02 }}
                    whileTap={(!image || !location || isSubmitting) ? {} : { scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!image || !location || isSubmitting}
                    className={`w-full font-black py-5 rounded-2xl text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3
                        ${!image || !location || isSubmitting
                            ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-white/5'
                            : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white shadow-indigo-500/40 border border-white/10'}`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Synchronizing...
                        </>
                    ) : (
                        image ? 'Authorize Check-in' : 'Identity Required'
                    )}
                </motion.button>

                <div className="mt-8 flex items-center justify-center space-x-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <div className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${location ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${location ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </div>
                    <span>{location ? `Signal Locked: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Wait: Acquiring GPS...'}</span>
                </div>
            </GlassCard>
        </div>
    )

}
