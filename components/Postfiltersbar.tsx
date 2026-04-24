"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setFilters, clearFilters } from "@/store/postSlice";
import { PostCategory, PostStatus } from "@/types/blog";
import { VALID_CATEGORIES } from "@/lib/utils";

export interface PostFiltersBarProps {
    showStatusFilter?: boolean;
    className?: string;
}

const STATUS_OPTIONS: (PostStatus | "all")[] = ["all", "published", "draft", "archived"];

export function Postfiltersbar({
    showStatusFilter = false,
    className = "",
}: PostFiltersBarProps) {
    const dispatch = useDispatch<AppDispatch>();
    const filters = useSelector((state: RootState) => state.posts.filters);

    // Count active filters (non-default values)
    const activeCount = [
        filters.status !== "all",
        filters.category !== "all",
        filters.search.trim() !== "",
        filters.tags.length > 0,
        filters.authorId !== "",
    ].filter(Boolean).length;

    const hasActiveFilters = activeCount > 0;

    function handleTagsInput(raw: string) {
        // Parse comma-separated tags
        const tags = raw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        dispatch(setFilters({ tags }));
    }

    return (
        <div
            className={`flex flex-wrap items-center gap-3 p-3 bg-gray-50
        border border-gray-200 rounded-xl ${className}`}
        >
            {/* Label + active count badge */}
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold text-gray-700">Filters</span>
                {hasActiveFilters && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full
            bg-blue-600 text-white">
                        {activeCount}
                    </span>
                )}
            </div>

            {/* Search input */}
            <input
                type="text"
                placeholder="Search posts..."
                value={filters.search}
                onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
          bg-white outline-none focus:ring-2 focus:ring-blue-200 w-48"
            />

            {/* Category dropdown */}
            <select
                value={filters.category}
                onChange={(e) =>
                    dispatch(setFilters({ category: e.target.value as PostCategory | "all" }))
                }
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
          bg-white outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            >
                <option value="all">All Categories</option>
                {VALID_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                ))}
            </select>

            {/* Tags input (comma-separated) */}
            <input
                type="text"
                placeholder="Tags: react, nextjs"
                defaultValue={filters.tags.join(", ")}
                onBlur={(e) => handleTagsInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleTagsInput((e.target as HTMLInputElement).value);
                }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
          bg-white outline-none focus:ring-2 focus:ring-blue-200 w-44"
            />

            {/* Status dropdown (optional) */}
            {showStatusFilter && (
                <select
                    value={filters.status}
                    onChange={(e) =>
                        dispatch(setFilters({ status: e.target.value as PostStatus | "all" }))
                    }
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
            bg-white outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">
                            {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            )}

            {/* Clear all — only when filters active */}
            {hasActiveFilters && (
                <button
                    onClick={() => dispatch(clearFilters())}
                    className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg
            border border-gray-300 text-gray-600 hover:bg-gray-100
            transition-colors"
                >
                    ✕ Clear All
                </button>
            )}
        </div>
    );
}