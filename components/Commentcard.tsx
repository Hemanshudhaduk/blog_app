"use client";

import { Comment } from "@/types/blog";

export interface CommentCardProps {
    comment: Comment;
    showModerationActions?: boolean;
    onApprove?: (id: string) => void;
    onDelete?: (id: string) => void;
    className?: string;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

// Generate initials avatar from name
function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Generate a bg color from name string
function getAvatarColor(name: string) {
    const colors = [
        "bg-blue-500", "bg-pink-500", "bg-amber-500",
        "bg-teal-500", "bg-violet-500", "bg-rose-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

export function CommentCard({
    comment,
    showModerationActions = false,
    onApprove,
    onDelete,
    className = "",
}: CommentCardProps) {
    const isPending = !comment.approved;

    return (
        <div
            className={`bg-white rounded-lg border p-4 flex gap-3
        ${isPending ? "border-l-4 border-l-yellow-400 border-gray-200" : "border-gray-200"}
        ${className}`}
        >
            {/* Avatar initials */}
            <div
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center
          text-white text-sm font-bold ${getAvatarColor(comment.authorName)}`}
            >
                {getInitials(comment.authorName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">
                        {comment.authorName}
                    </span>
                    <span className="text-xs text-gray-400">{comment.authorEmail}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>

                {/* Pending badge */}
                {isPending && (
                    <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5
            bg-yellow-100 text-yellow-800 rounded-full">
                        Pending Review
                    </span>
                )}

                {/* Comment text */}
                <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                    {comment.content}
                </p>

                {/* Moderation actions */}
                {showModerationActions && (
                    <div className="flex gap-2 mt-3">
                        {!comment.approved && (
                            <button
                                onClick={() => onApprove?.(comment.id)}
                                className="text-xs px-3 py-1 rounded bg-green-50 text-green-700
                  hover:bg-green-100 transition-colors font-medium"
                            >
                                ✓ Approve
                            </button>
                        )}
                        <button
                            onClick={() => onDelete?.(comment.id)}
                            className="text-xs px-3 py-1 rounded bg-red-50 text-red-600
                hover:bg-red-100 transition-colors font-medium"
                        >
                            ✕ Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}