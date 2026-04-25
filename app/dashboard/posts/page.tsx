"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPosts, deletePost, editPost } from "@/store/postSlice";
import { fetchComments } from "@/store/commentSlice";
import { PostCard } from "@/components/Postcard";
import { Postfiltersbar } from "@/components/Postfiltersbar";
import { Post, PostStatus } from "@/types/blog";
import { useAuthor } from "@/context/AuthorContext";
import Link from "next/link";

export default function DashboardPostsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { currentAuthor } = useAuthor();
    const { posts, filters, status } = useAppSelector((s) => s.posts);
    const isLoading = status === "idle" || status === "loading";

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchComments());
    }, [dispatch, currentAuthor]);

    // Client-side filtering from Redux state
    const filtered = posts.filter((post) => {
        // Show only selected author's posts
        if (currentAuthor && post.authorId !== currentAuthor.id) return false;
        if (filters.status !== "all" && post.status !== filters.status) return false;
        if (filters.category !== "all" && post.category !== filters.category) return false;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            if (
                !post.title.toLowerCase().includes(q) &&
                !post.excerpt.toLowerCase().includes(q)
            )
                return false;
        }
        if (filters.tags.length > 0) {
            const postTags = post.tags.map((t) => t.toLowerCase());
            if (!filters.tags.every((t) => postTags.includes(t.toLowerCase())))
                return false;
        }
        if (filters.authorId && post.authorId !== filters.authorId) return false;
        return true;
    });

    const handleEdit = useCallback(
        (post: Post) => {
            router.push(`/dashboard/posts/${post.id}/edit`);
        },
        [router]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            if (!window.confirm("Delete this post? This cannot be undone.")) return;
            await dispatch(deletePost(id));
        },
        [dispatch]
    );

    const handleStatusChange = useCallback(
        async (id: string, newStatus: PostStatus) => {
            await dispatch(editPost({ id, changes: { status: newStatus } }));
        },
        [dispatch]
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {filtered.length} of {posts.length} posts
                    </p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <Postfiltersbar showStatusFilter className="mb-6" />

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse"
                        >
                            <div className="h-44 bg-gray-200 dark:bg-gray-700" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-full" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Posts grid */}
            {!isLoading && (
                <>
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No posts found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Either there are no posts yet or update your filters/search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    variant="dashboard"
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}