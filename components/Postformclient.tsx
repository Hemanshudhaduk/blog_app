"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { createPost, editPost } from "@/store/postSlice";
import { usePostForm } from "@/hooks/usePostForm";
import { useAuthor } from "@/context/AuthorContext";
import { MarkdownEditor } from "@/components/Markdowneditor";
import { Post, PostCategory, PostStatus } from "@/types/blog";

interface PostFormClientProps {
    initialPost?: Post;
    mode: "create" | "edit";
}

const CATEGORIES: PostCategory[] = [
    "technology", "design", "business", "lifestyle",
    "tutorial", "opinion", "news",
];

export function PostFormClient({ initialPost, mode }: PostFormClientProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { currentAuthor } = useAuthor();
    const {
        values,
        handleChange,
        errors,
        handleSubmit,
        reset,
        isDirty,
        wordCount,
        readingTimeMinutes,
    } = usePostForm(initialPost);

    // Warn on navigate away if dirty
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    async function submitForm(targetStatus: PostStatus) {
        handleSubmit(async (formValues) => {
            const payload = {
                ...formValues,
                status: targetStatus,
                authorId: currentAuthor?.id ?? initialPost?.authorId ?? "",
                coverImageUrl: formValues.coverImageUrl || undefined,
                tags: formValues.tags,
            };

            if (mode === "create") {
                const result = await dispatch(createPost(payload as Parameters<typeof createPost>[0]));
                if (createPost.fulfilled.match(result)) {
                    router.push("/dashboard/posts");
                }
            } else if (mode === "edit" && initialPost) {
                const result = await dispatch(editPost({ id: initialPost.id, changes: payload }));
                if (editPost.fulfilled.match(result)) {
                    router.push("/dashboard/posts");
                }
            }
        });
    }

    const tagInputValue = values.tags.join(", ");

    function handleTagsChange(raw: string) {
        const tags = raw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        handleChange("tags", tags);
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mode === "create" ? "Create New Post" : "Edit Post"}
                    </h1>
                    {isDirty && (
                        <p className="text-xs text-amber-500 dark:text-amber-400 mt-1 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Unsaved changes
                        </p>
                    )}
                </div>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={values.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Your post title..."
                        className={`w-full px-4 py-2.5 text-base border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${errors.title
                                ? "border-red-400 dark:border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            }`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                    )}
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Excerpt <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs font-normal text-gray-400">
                            {values.excerpt.length}/200
                        </span>
                    </label>
                    <textarea
                        rows={2}
                        value={values.excerpt}
                        onChange={(e) => handleChange("excerpt", e.target.value)}
                        placeholder="Short summary of your post (max 200 chars)..."
                        maxLength={200}
                        className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none ${errors.excerpt
                                ? "border-red-400 dark:border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            }`}
                    />
                    {errors.excerpt && (
                        <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>
                    )}
                </div>

                {/* Row: Category + Status + Cover Image */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={values.category}
                            onChange={(e) => handleChange("category", e.target.value as PostCategory)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Status
                        </label>
                        <select
                            value={values.status}
                            onChange={(e) => handleChange("status", e.target.value as PostStatus)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            value={values.coverImageUrl}
                            onChange={(e) => handleChange("coverImageUrl", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Tags
                        <span className="ml-2 text-xs font-normal text-gray-400">comma-separated</span>
                    </label>
                    <input
                        type="text"
                        value={tagInputValue}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="react, nextjs, typescript..."
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {/* Markdown Editor */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Content <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs font-normal text-gray-400">
                            {readingTimeMinutes} min read · {wordCount} words
                        </span>
                    </label>
                    <MarkdownEditor
                        value={values.content}
                        onChange={(v) => handleChange("content", v)}
                        placeholder="Write your post content in Markdown..."
                        minHeight={420}
                    />
                    {errors.content && (
                        <p className="mt-1 text-xs text-red-500">{errors.content}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 pb-8">
                    <button
                        type="button"
                        onClick={() => submitForm("draft")}
                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => submitForm("published")}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        {mode === "create" ? "Publish" : "Save & Publish"}
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        disabled={!isDirty}
                        className="ml-auto px-4 py-2.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}