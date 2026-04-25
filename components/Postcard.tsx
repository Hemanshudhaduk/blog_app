"use client";

import Image from "next/image";
import { Post, PostStatus } from "@/types/blog";
import { CategoryBadge } from "./Categorybadge";

export interface PostCardProps {
    post: Post;
    variant: "public" | "dashboard";
    onEdit?: (post: Post) => void;
    onDelete?: (id: string) => void;
    onStatusChange?: (id: string, status: PostStatus) => void;
    className?: string;
}

// Color per status badge
const STATUS_COLORS: Record<PostStatus, string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-600",
};

// Gradient placeholder when no cover image
const PLACEHOLDER_GRADIENTS = [
    "from-blue-400 to-indigo-500",
    "from-pink-400 to-rose-500",
    "from-amber-400 to-orange-500",
    "from-teal-400 to-cyan-500",
    "from-violet-400 to-purple-500",
];

function getGradient(id: string) {
    const index = id.charCodeAt(id.length - 1) % PLACEHOLDER_GRADIENTS.length;
    return PLACEHOLDER_GRADIENTS[index];
}

function formatDate(iso?: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

export function PostCard({
    post,
    variant,
    onEdit,
    onDelete,
    onStatusChange,
    className = "",
}: PostCardProps) {
    const isDashboard = variant === "dashboard";

    return (
        <article
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm
        hover:shadow-md transition-shadow flex flex-col ${className}`}
        >
            {/* Cover image or gradient placeholder */}
            <div className="relative h-44 w-full shrink-0">
                {post.coverImageUrl ? (
                    <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                    />
                ) : (
                    <div
                        className={`h-full w-full bg-linear-to-br ${getGradient(post.id)}
              flex items-center justify-center`}
                    >
                        <span className="text-white text-4xl font-bold opacity-30">
                            {post.title.charAt(0)}
                        </span>
                    </div>
                )}

                {/* Category badge over image */}
                <div className="absolute top-3 left-3">
                    <CategoryBadge category={post.category} size="sm" />
                </div>

                {/* Dashboard: status badge over image */}
                {isDashboard && (
                    <div className="absolute top-3 right-3">
                        <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize
                ${STATUS_COLORS[post.status]}`}
                        >
                            {post.status}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h2 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
                    {post.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2 flex-1">{post.excerpt}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>⏱ {post.readingTimeMinutes} min read</span>
                    <span>👁 {post.viewCount} views</span>
                    {post.publishedAt && (
                        <span className="ml-auto">{formatDate(post.publishedAt)}</span>
                    )}
                </div>

                {/* Dashboard actions */}
                {isDashboard && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
                        {/* Quick status change */}
                        <select
                            value={post.status}
                            onChange={(e) =>
                                onStatusChange?.(post.id, e.target.value as PostStatus)
                            }
                            className="text-xs border rounded px-1.5 py-1 bg-white text-gray-700
                flex-1 cursor-pointer"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>

                        {/* Edit button */}
                        <button
                            onClick={() => onEdit?.(post)}
                            className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-700
                hover:bg-blue-100 transition-colors font-medium"
                        >
                            Edit
                        </button>

                        {/* Delete button */}
                        <button
                            onClick={() => onDelete?.(post.id)}
                            className="text-xs px-3 py-1 rounded bg-red-50 text-red-600
                hover:bg-red-100 transition-colors font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}