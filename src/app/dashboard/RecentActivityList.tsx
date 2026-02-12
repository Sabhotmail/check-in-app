'use client'

import { motion } from 'framer-motion'
import { CheckIn } from '@/types/dashboard'
import { GlassCard } from '@/components/ui/GlassCard'

export function RecentActivityList({ checkIns }: { checkIns: CheckIn[] }) {
    if (!checkIns || checkIns.length === 0) {
        return (
            <GlassCard className="p-8 text-center text-gray-500">
                No activity today.
            </GlassCard>
        )
    }

    return (
        <GlassCard className="overflow-hidden p-0">
            <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-gray-400 text-xs uppercase backdrop-blur-sm">
                    <tr>
                        <th className="px-6 py-4 font-medium tracking-wider">Time</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Employee</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Location</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Selfie</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {checkIns.map((checkIn, index) => (
                        <motion.tr
                            key={checkIn.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="hover:bg-slate-800/30 transition-colors group"
                        >
                            <td className="px-6 py-4 font-mono text-sm text-indigo-300">
                                {new Date(checkIn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                                    {checkIn.profiles?.full_name || 'Unknown'}
                                </div>
                                <div className="text-xs text-slate-500 capitalize">{checkIn.profiles?.role}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">
                                <span className="opacity-70">{checkIn.location_lat.toFixed(4)}, {checkIn.location_lng.toFixed(4)}</span>
                                <a
                                    href={`https://maps.google.com/?q=${checkIn.location_lat},${checkIn.location_lng}`}
                                    target="_blank"
                                    className="ml-2 text-indigo-400 hover:text-indigo-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Map ↗
                                </a>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-10 w-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                    {checkIn.selfie_url && (
                                        <img src={checkIn.selfie_url} className="h-full w-full object-cover" alt="Selfie" />
                                    )}
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </GlassCard>
    )
}
