import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Post, Comment } from "@/types/blog";
import { CategoryBadge } from "@/components/Categorybadge";
import { CommentCard } from "@/components/Commentcard";
import { Commentform } from "@/components/Commentform";
    
// ── Data fetching ─────────────────────────────────────────
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

async function getPostBySlug(slug: string): Promise<Post | null> {
    const res = await fetch(`${getBaseUrl()}/api/posts?slug=${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const posts: Post[] = await res.json();
    return posts[0] ?? null;
}

async function getApprovedComments(postId: string): Promise<Comment[]> {
    const res = await fetch(
        `${getBaseUrl()}/api/comments?postId=${postId}&approved=true`,
        { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
}

async function trackView(postId: string): Promise<void> {
    await fetch(`${getBaseUrl()}/api/posts/${postId}?track=true`, {
        method: "GET",
        cache: "no-store",
    });
}

// ── Page ──────────────────────────────────────────────────
interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    // 404 if not found or not published
    if (!post || post.status !== "published") {
        notFound();
    }

    // Track view server-side (fire and forget — don't block render)
    void trackView(post.id);

    const approvedComments = await getApprovedComments(post.id);

    function formatDate(iso?: string) {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
        });
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

            {/* ── Cover image ──────────────────────────────────── */}
            {post.coverImageUrl ? (
                <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    width={1200}
                    height={450}
                    className="w-full h-72 object-cover rounded-2xl"
                />
            ) : (
                <div className="w-full h-72 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-600
          flex items-center justify-center">
                    <span className="text-white text-8xl font-black opacity-20">
                        {post.title.charAt(0)}
                    </span>
                </div>
            )}

            {/* ── Post header ──────────────────────────────────── */}
            <header className="space-y-4">
                {/* Category + meta */}
                <div className="flex flex-wrap items-center gap-3">
                    <CategoryBadge category={post.category} size="md" />
                    <span className="text-sm text-gray-400">⏱ {post.readingTimeMinutes} min read</span>
                    <span className="text-sm text-gray-400">👁 {post.viewCount} views</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

                {/* Author + date */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600
            flex items-center justify-center text-white text-sm font-bold shrink-0">
                        A
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Author</p>
                        {post.publishedAt && (
                            <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
                        )}
                    </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2.5 py-1 rounded-full bg-gray-100
                  text-gray-600 font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* ── Markdown content (server-rendered, no JS needed) ── */}
            <article className="prose prose-gray max-w-none prose-headings:font-bold
        prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1
        prose-code:rounded prose-code:text-sm">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>

            {/* ── Comments section ──────────────────────────────── */}
            <section className="space-y-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                    Comments ({approvedComments.length})
                </h2>

                {/* Approved comments list */}
                {approvedComments.length > 0 ? (
                    <div className="space-y-3">
                        {approvedComments.map((comment) => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">
                        No comments yet. Be the first to comment!
                    </p>
                )}

                {/* Comment submission form — Client Component island */}
                <Commentform postId={post.id} />
            </section>
        </div>
    );
}