'use client'

import { useRef, useState, useEffect } from 'react'

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void
    onRetake?: () => void
    previewSrc?: string | null
}

export function CameraCapture({ onCapture, onRetake, previewSrc }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (previewSrc) return

        let currentStream: MediaStream | null = null

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' },
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
            // Mirror the image to match user expectation (if facingMode is user)
            // ctx.scale(-1, 1);
            // ctx.drawImage(videoRef.current, -canvas.width, 0);
            // Actually, CSS transforms it, but canvas draw is raw. 
            // Usually users want mirrored preview but normal capture, or mirrored capture.
            // Let's standard draw for now.
            ctx.drawImage(videoRef.current, 0, 0)
            const imageSrc = canvas.toDataURL('image/jpeg', 0.8)
            onCapture(imageSrc)
        }
    }

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gray-800 text-red-400">
                <p className="text-center px-4">{error}</p>
            </div>
        )
    }

    if (previewSrc) {
        return (
            <div className="relative h-full w-full">
                <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />

                {onRetake && (
                    <button
                        onClick={onRetake}
                        className="absolute bottom-4 right-4 bg-gray-900/80 text-white p-2 rounded-full text-xs backdrop-blur-sm border border-gray-700 hover:bg-gray-800"
                    >
                        Retake
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="relative h-full w-full bg-black">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror preview
            />

            {!previewSrc && (
                <button
                    onClick={capture}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-white border-4 border-gray-300 shadow-lg hover:scale-105 transition-transform"
                    aria-label="Take Photo"
                />
            )}
        </div>
    )
}
