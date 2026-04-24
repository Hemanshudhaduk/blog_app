"use client";

import { PostCategory } from "@/types/blog";

export interface CategoryBadgeProps {
    category: PostCategory;
    size?: "sm" | "md" | "lg";
    clickable?: boolean;
    onClick?: (category: PostCategory) => void;
    className?: string;
}

// Unique color per category
const CATEGORY_COLORS: Record<PostCategory, string> = {
    technology: "bg-blue-100 text-blue-800 border-blue-200",
    design: "bg-pink-100 text-pink-800 border-pink-200",
    business: "bg-amber-100 text-amber-800 border-amber-200",
    lifestyle: "bg-green-100 text-green-800 border-green-200",
    tutorial: "bg-violet-100 text-violet-800 border-violet-200",
    opinion: "bg-orange-100 text-orange-800 border-orange-200",
    news: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const SIZE_CLASSES = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
};

export function CategoryBadge({
    category,
    size = "md",
    clickable = false,
    onClick,
    className = "",
}: CategoryBadgeProps) {
    const base = `inline-flex items-center rounded-full border font-medium capitalize
    ${CATEGORY_COLORS[category]} ${SIZE_CLASSES[size]}
    ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
    ${className}`;

    if (clickable) {
        return (
            <button className={base} onClick={() => onClick?.(category)}>
                {category}
            </button>
        );
    }

    return <span className={base}>{category}</span>;
}