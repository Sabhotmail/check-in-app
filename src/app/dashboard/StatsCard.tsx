'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'

export function StatsCard({
    label,
    value,
    color = "text-white",
    delay = 0
}: {
    label: string,
    value: number | string,
    color?: string,
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
        >
            <GlassCard className="p-4 w-40 text-center flex flex-col items-center justify-center border-t-2 border-t-white/10 hover:border-t-indigo-500/50 transition-all cursor-default">
                <div className={`text-3xl font-bold ${color} mb-1 drop-shadow-lg font-sans`}>{value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{label}</div>
            </GlassCard>
        </motion.div>
    )
}
