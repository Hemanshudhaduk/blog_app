"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { fetchPosts } from "@/store/postSlice";
import { fetchComments } from "@/store/commentSlice";
import { useBlogStats } from "@/hooks/useBlogStats";
import { CategoryBadge } from "@/components/Categorybadge";
import { PostCategory } from "@/types/blog";
import { useAuthor } from "@/context/AuthorContext";

const CATEGORY_ORDER: PostCategory[] = [
    "technology", "design", "business", "lifestyle",
    "tutorial", "opinion", "news",
];

function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function DashboardHomePage() {
    const dispatch = useAppDispatch();
    const { currentAuthor } = useAuthor();
    const stats = useBlogStats(currentAuthor?.id);

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchComments());
    }, [dispatch]);

    const maxCategory = Math.max(...Object.values(stats.byCategory), 1);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Your blog at a glance
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Total Posts"
                    value={stats.totalPosts}
                    color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Published"
                    value={stats.publishedPosts}
                    color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    }
                />
                <StatCard
                    label="Drafts"
                    value={stats.draftPosts}
                    color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Views"
                    value={stats.totalViews}
                    color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Posts */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-900 dark:text-white">Top Posts by Views</h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {stats.topPosts.length === 0 ? (
                            <p className="p-5 text-sm text-gray-400">No published posts yet.</p>
                        ) : (
                            stats.topPosts.map((post, i) => (
                                <div key={post.id} className="flex items-center gap-3 px-5 py-3">
                                    <span className="text-lg font-bold text-gray-200 dark:text-gray-700 w-6 text-center">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {post.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <CategoryBadge category={post.category} size="sm" />
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                            {post.viewCount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-400">views</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* By Category */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-900 dark:text-white">Posts by Category</h2>
                    </div>
                    <div className="p-5 space-y-3">
                        {CATEGORY_ORDER.map((cat) => {
                            const count = stats.byCategory[cat] ?? 0;
                            const pct = Math.round((count / maxCategory) * 100);
                            return (
                                <div key={cat} className="flex items-center gap-3">
                                    <div className="w-24 shrink-0">
                                        <CategoryBadge category={cat} size="sm" />
                                    </div>
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-4 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}