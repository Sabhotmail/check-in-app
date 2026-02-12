import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { CheckIn } from '@/types/dashboard'

export async function GET() {
    const supabase = await createClient()

    const { data: checkIns } = await supabase
        .from('check_ins')
        .select('created_at, location_lat, location_lng, profiles(full_name, email)')
        .order('created_at', { ascending: false })

    if (!checkIns) {
        return new NextResponse('No data', { status: 404 })
    }

    const csvHeader = 'Date,Time,Name,Email,Latitude,Longitude\n'
    const csvRows = (checkIns as unknown as CheckIn[]).map((row) => {
        const date = new Date(row.created_at)
        return [
            date.toLocaleDateString(),
            date.toLocaleTimeString(),
            `"${row.profiles?.full_name || ''}"`,
            row.profiles?.email,
            row.location_lat,
            row.location_lng
        ].join(',')
    }).join('\n')

    return new NextResponse(csvHeader + csvRows, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="attendance-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
    })
}
