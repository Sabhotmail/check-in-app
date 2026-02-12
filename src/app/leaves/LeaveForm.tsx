'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { submitLeaveRequest } from './actions'

const LEAVE_TYPES = [
    { id: 'sick', label: 'Sick Leave', icon: '🤒' },
    { id: 'vacation', label: 'Vacation', icon: '🌴' },
    { id: 'personal', label: 'Personal', icon: '🏠' },
    { id: 'other', label: 'Other', icon: '📝' },
]

export function LeaveForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [formData, setFormData] = useState({
        type: 'sick',
        startDate: '',
        endDate: '',
        reason: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus(null)

        try {
            const result = await submitLeaveRequest(formData)
            if (result.error) {
                setStatus({ type: 'error', message: result.error })
            } else {
                setStatus({ type: 'success', message: 'Leave request submitted successfully!' })
                setFormData({ type: 'sick', startDate: '', endDate: '', reason: '' })
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'An unexpected error occurred.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <GlassCard className="w-full max-w-md p-6 border-slate-700/50">
            <h2 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Request Leave</h2>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Type Selection */}
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {LEAVE_TYPES.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: type.id })}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${formData.type === type.id
                                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                <span className="text-xl">{type.icon}</span>
                                <span className="text-xs font-bold">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Start Date</label>
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">End Date</label>
                        <input
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Reason / Details</label>
                    <textarea
                        rows={3}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                        placeholder="Explain your leave request..."
                    />
                </div>

                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-3 rounded-lg text-xs font-bold uppercase tracking-widest border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                }`}
                        >
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2
                        ${isSubmitting
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-indigo-500/20 border border-white/10'}`}
                >
                    {isSubmitting ? 'Processing Request...' : 'Submit Leave Application'}
                </motion.button>
            </form>
        </GlassCard>
    )
}
