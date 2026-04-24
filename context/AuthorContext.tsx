"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Author } from "@/types/blog";
import { SEED_AUTHORS } from "@/lib/data";

interface AuthorContextValue {
    currentAuthor: Author | null;
    setCurrentAuthor: (author: Author | null) => void;
    isLoggedIn: boolean;
    theme: "light" | "dark";
    toggleTheme: () => void;
}

const AuthorContext = createContext<AuthorContextValue | undefined>(undefined);

export function AuthorProvider({ children }: { children: ReactNode }) {
    const [currentAuthor, setCurrentAuthorState] = useState<Author | null>(() => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; blog_author=`);
        const savedId = parts.length === 2 ? parts.pop()?.split(';').shift() ?? null : null;
        return savedId ? SEED_AUTHORS.find((a) => a.id === savedId) ?? null : null;
    });
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("theme") as "light" | "dark") || "light";
        }
        return "light";
    });


    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    // Persist author to cookie when changed
    function setCurrentAuthor(author: Author | null) {
        setCurrentAuthorState(author);
        if (author) {
            document.cookie = "blog_author=" + author.id + "; path=/; max-age=86400";
        } else {
            document.cookie = "blog_author=; path=/; max-age=0";
        }
    }


    function toggleTheme() {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", next);
            return next;
        });
    }

    return (
        <AuthorContext.Provider
            value={{
                currentAuthor,
                setCurrentAuthor,
                isLoggedIn: currentAuthor !== null,
                theme,
                toggleTheme,
            }}
        >
            {children}
        </AuthorContext.Provider>
    );
}


export function useAuthor(): AuthorContextValue {
    const ctx = useContext(AuthorContext);
    if (!ctx) throw new Error("useAuthor must be used inside <AuthorProvider>");
    return ctx;
}