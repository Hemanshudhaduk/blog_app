"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error("Posts page error:", error);
    }, [error]);

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center max-w-sm">
                {error.message || "Failed to load posts. Please try again."}
            </p>
            <div className="flex items-center gap-3">
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => router.refresh()}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
}