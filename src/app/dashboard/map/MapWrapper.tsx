'use client'

import dynamic from 'next/dynamic'
import { CheckIn } from '@/types/dashboard'

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-900 animate-pulse flex items-center justify-center text-gray-500">Loading Map...</div>
})

export default function MapWrapper({ checkIns }: { checkIns: CheckIn[] }) {
    return <MapComponent checkIns={checkIns} />
}
