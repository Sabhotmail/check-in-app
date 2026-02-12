export interface Profile {
    full_name: string | null
    avatar_url?: string | null
    role?: string | null
    email?: string | null // Optional as it might not be joined
}

export interface CheckIn {
    id: string
    created_at: string
    location_lat: number
    location_lng: number
    selfie_url: string | null
    profiles: Profile | null
}

export interface LeaveRequest {
    id: string
    created_at: string
    start_date: string
    end_date: string
    type: string
    reason: string | null
    status: string
    profiles: Profile | null
}
