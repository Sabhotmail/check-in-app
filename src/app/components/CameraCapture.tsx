'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void
    onRetake?: () => void
    previewSrc?: string | null
}

export function CameraCapture({ onCapture, onRetake, previewSrc }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isCountingDown, setIsCountingDown] = useState(false)

    useEffect(() => {
        if (previewSrc) return

        let currentStream: MediaStream | null = null

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1024 },
                        height: { ideal: 1024 }
                    },
                })
                currentStream = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (err) {
                console.error('Error accessing camera:', err)
                setError('Could not access camera. Please allow permission.')
            }
        }

        startCamera()

        return () => {
            currentStream?.getTracks().forEach((track) => track.stop())
        }
    }, [previewSrc])

    const capture = () => {
        if (!videoRef.current) return
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
            // Mirror capture to match preview
            ctx.translate(canvas.width, 0)
            ctx.scale(-1, 1)
            ctx.drawImage(videoRef.current, 0, 0)
            const imageSrc = canvas.toDataURL('image/jpeg', 0.8)
            onCapture(imageSrc)
        }
    }

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-rose-400 p-8 text-center font-medium">
                <div className="space-y-4">
                    <span className="text-4xl block">🚫</span>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {previewSrc ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative h-full w-full"
                    >
                        <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"></div>

                        {onRetake && (
                            <button
                                onClick={onRetake}
                                className="absolute bottom-6 right-6 bg-slate-900/90 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-xl border border-white/10 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl"
                            >
                                Re-verify
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="relative h-full w-full">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover"
                            style={{ transform: 'scaleX(-1)' }} // Mirror preview
                        />

                        {/* High-tech overlays */}
                        <div className="absolute inset-0 border-[20px] border-slate-950/20 pointer-events-none"></div>
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-indigo-500/80 rounded-tl-lg"></div>
                        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-indigo-500/80 rounded-tr-lg"></div>
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-indigo-500/80 rounded-bl-lg"></div>
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-indigo-500/80 rounded-br-lg"></div>

                        {/* Scanner Line Animation */}
                        <motion.div
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] opacity-50 pointer-events-none"
                        />

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={capture}
                                className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md border-[6px] border-white flex items-center justify-center p-1 shadow-2xl shadow-indigo-500/20 group"
                                aria-label="Take Photo"
                            >
                                <div className="h-full w-full rounded-full bg-white group-hover:bg-indigo-50 transition-colors"></div>
                            </motion.button>
                            <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                                Capture Identity
                            </span>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

