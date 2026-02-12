import { createClient } from '@/utils/supabase/server'
import { updateLeaveStatus } from './actions'
import { LeaveRequest } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function LeavesPage() {
    const supabase = await createClient()

    // Fetch pending requests
    const { data: pendingLeaves } = await supabase
        .from('leave_requests')
        .select('*, profiles(full_name, avatar_url, role)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

    // Fetch history (last 50)
    const { data: historyLeaves } = await supabase
        .from('leave_requests')
        .select('*, profiles(full_name)')
        .neq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="p-8 space-y-8">
            <header>
                <h2 className="text-3xl font-bold">Leave Management</h2>
                <p className="text-gray-400">Review and manage employee leave requests</p>
            </header>

            <section>
                <h3 className="text-xl font-bold mb-4 text-indigo-400">Pending Requests</h3>
                <div className="grid gap-4">
                    {!pendingLeaves || pendingLeaves.length === 0 ? (
                        <div className="p-8 bg-gray-800/50 rounded-xl text-center text-gray-500 border border-gray-800">
                            No pending requests.
                        </div>
                    ) : (
                        (pendingLeaves as unknown as LeaveRequest[]).map((leave) => (
                            <div key={leave.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center text-xl font-bold text-gray-600">
                                        {leave.profiles?.avatar_url ? (
                                            <img src={leave.profiles.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            leave.profiles?.full_name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{leave.profiles?.full_name || 'Unknown'}</div>
                                        <div className="text-sm text-gray-400">
                                            Requested <span className="text-white font-medium">{leave.type}</span> leave
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 md:px-8">
                                    <div className="bg-gray-800/50 p-3 rounded-lg text-sm text-gray-300 italic">
                                        "{leave.reason || 'No reason provided'}"
                                    </div>
                                </div>

                                <div className="flex space-x-2 w-full md:w-auto">
                                    <form action={async () => {
                                        'use server'
                                        await updateLeaveStatus(leave.id, 'rejected')
                                    }}>
                                        <button className="w-full md:w-auto px-6 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-colors">
                                            Reject
                                        </button>
                                    </form>
                                    <form action={async () => {
                                        'use server'
                                        await updateLeaveStatus(leave.id, 'approved')
                                    }}>
                                        <button className="w-full md:w-auto px-6 py-2 bg-green-900/30 text-green-400 border border-green-900/50 rounded-lg hover:bg-green-900/50 transition-colors">
                                            Approve
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold mb-4 text-gray-500">History</h3>
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Employee</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Duration</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {(historyLeaves as unknown as LeaveRequest[]).map((leave) => (
                                <tr key={leave.id} className="text-gray-400 hover:bg-gray-800/30">
                                    <td className="px-6 py-3">{new Date(leave.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 text-white">{leave.profiles?.full_name || 'Unknown'}</td>
                                    <td className="px-6 py-3 capitalize">{leave.type}</td>
                                    <td className="px-6 py-3">
                                        {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${leave.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                                            leave.status === 'rejected' ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-400'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
