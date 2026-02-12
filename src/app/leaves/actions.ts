'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitLeaveRequest(data: {
    type: string
    startDate: string
    endDate: string
    reason: string
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    if (!data.startDate || !data.endDate) {
        return { error: 'Start and end dates are required.' }
    }

    const { error } = await supabase.from('leave_requests').insert({
        user_id: user.id,
        type: data.type,
        start_date: data.startDate,
        end_date: data.endDate,
        reason: data.reason,
        status: 'pending'
    })

    if (error) {
        console.error('Leave submission error:', error)
        return { error: error.message }
    }

    revalidatePath('/leaves')
    return { success: true }
}
