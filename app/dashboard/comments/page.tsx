"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchComments } from "@/store/commentSlice";
import { fetchPosts } from "@/store/postSlice";
import { useCommentModeration } from "@/hooks/useCommentModeration";
import { CommentCard } from "@/components/Commentcard";
import { useAuthor } from "@/context/AuthorContext";

type Tab = "pending" | "approved";

export default function DashboardCommentsPage() {
    const dispatch = useAppDispatch();
    const { currentAuthor } = useAuthor();
    const status = useAppSelector((s) => s.comments.status);
    const [activeTab, setActiveTab] = useState<Tab>("pending");

    const {
        pendingComments,
        approvedComments,
        approveComment,
        rejectComment,
        pendingCount,
    } = useCommentModeration(currentAuthor?.id);

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchComments());
    }, [dispatch]);

    const displayed = activeTab === "pending" ? pendingComments : approvedComments;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Comments
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {currentAuthor
                            ? `Moderate reader comments on ${currentAuthor.name}'s posts`
                            : "Moderate reader comments across your posts"}
                    </p>
                </div>

                {pendingCount > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
                        rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        {pendingCount} pending
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                {(["pending", "approved"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize
                            ${activeTab === tab
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        {tab}
                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold
                            ${tab === "pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-green-100 text-green-700"
                            }`}>
                            {tab === "pending" ? pendingComments.length : approvedComments.length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Loading skeleton */}
            {status === "loading" && (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100
                                dark:border-gray-700 p-4 flex gap-3 animate-pulse"
                        >
                            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-full" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comment list */}
            {status !== "loading" && (
                <>
                    {displayed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <svg
                                className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"
                                />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                No {activeTab} comments
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                                {activeTab === "pending"
                                    ? "All caught up! No comments awaiting review."
                                    : "No comments have been approved yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayed.map((comment) => (
                                <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                    showModerationActions
                                    onApprove={approveComment}
                                    onDelete={rejectComment}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
