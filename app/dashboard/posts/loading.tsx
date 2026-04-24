export default function PostsLoading() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
            <div className="h-14 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        <div className="h-44 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="p-5 space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                            <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded animate-pulse w-2/3" />
                            <div className="flex gap-2 pt-1">
                                <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                                <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}