'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected') {
    const supabase = await createClient()

    // Verify supervisor role (optional but recommended)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'supervisor' && profile?.role !== 'admin') {
        return { error: 'Insufficient permissions' }
    }

    const { error } = await supabase
        .from('leave_requests')
        .update({ status })
        .eq('id', leaveId)

    if (error) {
        console.error('Update error:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath('/dashboard/leaves')
    revalidatePath('/dashboard')
    return { success: true }
}
