import { createClient } from '@/utils/supabase/server'
import MapWrapper from './MapWrapper'
import { CheckIn } from '@/types/dashboard'

export default async function MapPage() {
    const supabase = await createClient()

    // Get today's checkins primarily, but maybe all for the map view?
    // Let's show today's for relevance, or last 100.
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: checkIns } = await supabase
        .from('check_ins')
        .select('*, profiles(full_name)')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <header className="p-4 bg-gray-900 border-b border-gray-800 z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-white">Live Map</h1>
                    <p className="text-xs text-gray-400">Showing check-ins for today</p>
                </div>
                <div className="text-sm text-gray-400">
                    {checkIns?.length || 0} Check-ins
                </div>
            </header>
            <div className="flex-1 relative">
                <MapWrapper checkIns={checkIns as unknown as CheckIn[]} />
            </div>
        </div>
    )
}
