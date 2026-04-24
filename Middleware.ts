import { NextRequest, NextResponse } from "next/server";
import { SEED_AUTHORS } from "@/lib/data";

// Applies to all /dashboard routes
export const config = {
    matcher: "/dashboard/:path*",
};

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Log path + timestamp for every matched dashboard request
    console.log(`[Dashboard] ${new Date().toISOString()} � ${pathname}`);

    const authorId = req.cookies.get("blog_author")?.value;
    const isValidAuthor = Boolean(
        authorId && SEED_AUTHORS.some((author) => author.id === authorId)
    );

    if (!isValidAuthor) {
        const redirectUrl = new URL("/", req.url);
        redirectUrl.searchParams.set("error", "login_required");
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}
