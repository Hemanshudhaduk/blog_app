"use client";

import { useState } from "react";

interface CommentFormProps {
    postId: string;
}

interface FormState {
    authorName: string;
    authorEmail: string;
    content: string;
}

const EMPTY: FormState = { authorName: "", authorEmail: "", content: "" };

export function Commentform({ postId }: CommentFormProps) {
    const [form, setForm] = useState<FormState>(EMPTY);
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    function validate(): boolean {
        const e: Partial<FormState> = {};
        if (!form.authorName.trim()) e.authorName = "Name is required.";
        if (!form.authorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.authorEmail)) {
            e.authorEmail = "Valid email is required.";
        }
        if (form.content.trim().length < 5) e.content = "Comment must be at least 5 characters.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, ...form }),
            });
            if (!res.ok) throw new Error("Failed");
            setStatus("success");
            setForm(EMPTY);
        } catch {
            setStatus("error");
        }
    }

    // Success state
    if (status === "success") {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                <p className="font-semibold text-green-800">✓ Comment submitted!</p>
                <p className="text-sm text-green-600 mt-1">
                    Your comment is awaiting moderation.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-3 text-xs text-green-700 underline"
                >
                    Leave another comment
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="font-bold text-gray-900">Leave a Comment</h3>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <input
                        type="text"
                        placeholder="Your name *"
                        value={form.authorName}
                        onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                        className={`w-full text-sm border rounded-lg px-3 py-2 bg-white outline-none
              focus:ring-2 focus:ring-blue-200
              ${errors.authorName ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.authorName && (
                        <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>
                    )}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Your email *"
                        value={form.authorEmail}
                        onChange={(e) => setForm((f) => ({ ...f, authorEmail: e.target.value }))}
                        className={`w-full text-sm border rounded-lg px-3 py-2 bg-white outline-none
              focus:ring-2 focus:ring-blue-200
              ${errors.authorEmail ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.authorEmail && (
                        <p className="text-xs text-red-500 mt-1">{errors.authorEmail}</p>
                    )}
                </div>
            </div>

            {/* Comment textarea */}
            <div>
                <textarea
                    rows={4}
                    placeholder="Write your comment... *"
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className={`w-full text-sm border rounded-lg px-3 py-2 bg-white outline-none
            focus:ring-2 focus:ring-blue-200 resize-none
            ${errors.content ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.content && (
                    <p className="text-xs text-red-500 mt-1">{errors.content}</p>
                )}
            </div>

            {/* Error message */}
            {status === "error" && (
                <p className="text-sm text-red-600">
                    Something went wrong. Please try again.
                </p>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold
          hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === "loading" ? "Submitting..." : "Submit Comment"}
            </button>
        </div>
    );
}