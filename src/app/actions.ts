'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitCheckIn(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Ensure profile exists
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()

    if (!profile) {
        // Try to insert cleanly without select
        const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'Unknown User',
            role: 'employee'
        })

        if (profileError) {
            console.error('Failed to ensure profile (likely policy issue):', profileError)
            // We can't proceed if profile creation fails due to RLS policies
            if (profileError.code === '42P17') {
                return { error: 'Database Policy Error: Infinite recursion. Please contact admin to fix RLS policies on "profiles" table.' }
            }
            if (profileError.code === '23505') {
                // Unique violation: Profile already exists.
                // This happens if RLS hides the profile from SELECT, but it exists physically.
                // We can proceed safely.
                console.log('Profile already exists (caught 23505). Proceeding...')
            } else if (profileError.code === '42501') {
                // RLS Policy violation
                console.warn('RLS Policy denied profile creation.')
                return { error: 'Permission Denied: Cannot creating user profile. Please ask admin to enable INSERT policy for authenticated users on "profiles" table.' }
            } else {
                console.error('Unexpected profile error:', profileError)
                return { error: 'Failed to initialize user profile.' }
            }
        }
    }

    const imageFile = formData.get('image') as File
    const lat = formData.get('lat')
    const lng = formData.get('lng')

    if (!imageFile || !lat || !lng) {
        return { error: 'Missing required data' }
    }

    // Upload image to Storage
    const filename = `${user.id}/${Date.now()}.jpg`
    const { error: uploadError } = await supabase.storage
        .from('selfies')
        .upload(filename, imageFile)

    if (uploadError) {
        console.error('Upload error:', uploadError)
        return { error: 'Failed to upload selfie. Please ensure storage bucket exists.' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('selfies').getPublicUrl(filename)

    // Insert check-in record
    const { error: insertError } = await supabase.from('check_ins').insert({
        user_id: user.id,
        selfie_url: publicUrl,
        location_lat: parseFloat(lat.toString()),
        location_lng: parseFloat(lng.toString()),
    })

    if (insertError) {
        console.error('Insert error:', insertError)
        return { error: 'Failed to record check-in' }
    }

    revalidatePath('/')
    return { success: true }
}
