"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthor } from "@/context/AuthorContext";
import { SEED_AUTHORS } from "@/lib/data";

// Top nav shown on ALL pages — only blog links + theme toggle, no author/dashboard UI
export function TopNav() {
    const { theme, toggleTheme, setCurrentAuthor, currentAuthor } = useAuthor();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    function handleDashboardClick() {
        if (currentAuthor) {
            router.push("/dashboard");
        } else {
            setShowModal(true);
        }
    }

    function handleAuthorSelect(authorId: string) {
        const author = SEED_AUTHORS.find((a) => a.id === authorId);
        if (author) {
            setCurrentAuthor(author);
            setShowModal(false);
            router.push("/dashboard");
        }
    }

    return (
        <>
            <header className="border-b border-gray-200 bg-white dark:bg-gray-900
          dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight"
                    >
                        📝 BlogApp
                    </Link>

                    {/* Nav links */}
                    <nav className="flex items-center gap-4 text-sm font-medium">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300
                  dark:hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <button
                            onClick={handleDashboardClick}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300
                  dark:hover:text-white transition-colors"
                        >
                            Dashboard
                        </button>
                    </nav>

                    {/* Theme toggle — right side */}
                    <button
                        onClick={toggleTheme}
                        className="ml-auto text-sm px-3 py-1.5 rounded-lg border border-gray-200
                dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800
                text-gray-600 dark:text-gray-300 transition-colors"
                        title="Toggle theme"
                    >
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </div>
            </header>

            {/* Author Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Select Author
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Choose an author to access the dashboard.
                        </p>
                        <div className="space-y-3">
                            {SEED_AUTHORS.map((author) => (
                                <button
                                    key={author.id}
                                    onClick={() => handleAuthorSelect(author.id)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200
                        dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Image
                                        src={author.avatarUrl ?? "https://i.pravatar.cc/40"}
                                        alt={author.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {author.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {author.email}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                  bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}