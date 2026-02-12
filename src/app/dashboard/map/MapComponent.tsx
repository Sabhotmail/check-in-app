'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { CheckIn } from '@/types/dashboard'

// Fix for default marker icon in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
    checkIns: CheckIn[]
}

export default function MapComponent({ checkIns }: MapComponentProps) {
    // Default center (Bangkok or user location)
    const defaultCenter: [number, number] = [13.7563, 100.5018]

    return (
        <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {checkIns.map((checkIn) => (
                <Marker
                    key={checkIn.id}
                    position={[checkIn.location_lat, checkIn.location_lng]}
                >
                    <Popup>
                        <div className="min-w-[200px]">
                            <h3 className="font-bold">{checkIn.profiles?.full_name || 'Unknown'}</h3>
                            <p className="text-xs text-gray-500 mb-2">
                                {new Date(checkIn.created_at).toLocaleString()}
                            </p>
                            {checkIn.selfie_url && (
                                <img
                                    src={checkIn.selfie_url}
                                    alt="Selfie"
                                    className="w-full h-auto rounded-lg"
                                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
