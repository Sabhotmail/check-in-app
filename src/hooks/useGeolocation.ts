'use client'
import { useState, useEffect } from 'react'

export interface Location {
    lat: number
    lng: number
    accuracy?: number
}

export function useGeolocation() {
    const [location, setLocation] = useState<Location | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const getLocation = () => {
        setLoading(true)
        setError(null)

        if (!navigator.geolocation) {
            setError('Geolocation not supported by this browser.')
            setLoading(false)
            return
        }

        const success = (position: GeolocationPosition) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            })
            setLoading(false)
        }

        const errorCallback = (err: GeolocationPositionError) => {
            setError(err.message)
            setLoading(false)
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }

        navigator.geolocation.getCurrentPosition(success, errorCallback, options)
    }

    useEffect(() => {
        getLocation()
    }, [])

    return { location, error, loading, retry: getLocation }
}
