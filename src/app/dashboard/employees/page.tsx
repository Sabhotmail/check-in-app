import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
    const supabase = await createClient()

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    return (
        <div className="p-8 space-y-8">
            <header>
                <h2 className="text-3xl font-bold">Employees</h2>
                <p className="text-gray-400">Manage and view employee details</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!profiles || profiles.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
                        No employees found.
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <div key={profile.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex items-center space-x-4 hover:border-indigo-500/50 transition-colors">
                            <div className="h-16 w-16 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center text-2xl font-bold text-gray-600">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    profile.full_name?.charAt(0) || 'U'
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-lg truncate">{profile.full_name || 'Unnamed'}</h3>
                                <p className="text-sm text-gray-400 truncate">ID: {profile.id.substring(0, 8)}</p>
                                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider ${profile.role === 'supervisor' ? 'bg-indigo-900/50 text-indigo-400' :
                                    profile.role === 'admin' ? 'bg-purple-900/50 text-purple-400' :
                                        'bg-gray-800 text-gray-500'
                                    }`}>
                                    {profile.role || 'Employee'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
