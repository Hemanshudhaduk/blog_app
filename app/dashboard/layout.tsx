"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthor } from "@/context/AuthorContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SEED_AUTHORS } from "@/lib/data";
import { ReactNode, useEffect, useState } from "react";

const NAV_LINKS = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/posts", label: "Posts", icon: "📄" },
    { href: "/dashboard/create", label: "Create Post", icon: "✏️" },
    { href: "/dashboard/comments", label: "Comments", icon: "💬" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { currentAuthor, setCurrentAuthor } = useAuthor();
    const pendingCount = useSelector((state: RootState) => state.comments.pendingCount);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && currentAuthor === null) {
            router.push("/?error=login_required");
        }
    }, [currentAuthor, mounted, router]);

    function handleAuthorChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        const author = SEED_AUTHORS.find((a) => a.id === id) ?? null;
        setCurrentAuthor(author);
        if (author) {
            document.cookie = "blog_author=" + author.id + "; path=/; max-age=86400";
        } else {
            document.cookie = "blog_author=; path=/; max-age=0";
        }
    }

    function handleLogout() {
        setCurrentAuthor(null);
        document.cookie = "blog_author=; path=/; max-age=0";
        router.push("/?error=login_required");
    }

    return (
        <div className="flex min-h-[calc(100vh-56px)]">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
                <nav className="flex flex-col gap-1 p-3 flex-1">
                    {NAV_LINKS.map(({ href, label, icon }) => {
                        const isActive = pathname === href;
                        const isComments = href === "/dashboard/comments";
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={"flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors " +
                                    (isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-200")}
                            >
                                <span>{icon}</span>
                                <span>{label}</span>
                                {isComments && pendingCount > 0 && (
                                    <span className={"ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full " +
                                        (isActive ? "bg-white text-blue-600" : "bg-red-500 text-white")}>
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Dashboard header */}
                <header className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white shrink-0" suppressHydrationWarning>
                    {/* Current author */}
                    {mounted && currentAuthor ? (
                        <div className="flex items-center gap-2">
                            <Image
                                src={currentAuthor.avatarUrl ?? "https://i.pravatar.cc/32"}
                                alt={currentAuthor.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                                unoptimized
                            />
                            <span className="text-sm font-semibold text-gray-800">
                                {currentAuthor.name}
                            </span>
                        </div>
                    ) : (
                        <span className="text-sm text-gray-400 italic">No author selected</span>
                    )}

                    {/* Author switcher — simulates login */}
                    <select
                        value={currentAuthor?.id ?? ""}
                        onChange={handleAuthorChange}
                        className="ml-4 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none cursor-pointer"
                    >
                        <option value="">— Switch Author —</option>
                        {SEED_AUTHORS.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="ml-auto text-sm px-3 py-1.5 rounded-lg border border-gray-200
              text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-medium"
                    >
                        Logout
                    </button>
                </header>

                {/* Page content */}
                <div className="flex-1 p-6 bg-white overflow-auto">{children}</div>
            </div>
        </div>
    );
}