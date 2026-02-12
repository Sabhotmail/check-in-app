export default function Loading() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-800 rounded"></div>
                    <div className="h-4 w-32 bg-gray-800 rounded"></div>
                </div>
                <div className="flex space-x-4">
                    <div className="h-24 w-40 bg-gray-800 rounded-xl"></div>
                    <div className="h-24 w-40 bg-gray-800 rounded-xl"></div>
                    <div className="h-24 w-40 bg-gray-800 rounded-xl"></div>
                </div>
            </div>
            <div className="h-96 bg-gray-900 rounded-xl border border-gray-800"></div>
        </div>
    )
}
