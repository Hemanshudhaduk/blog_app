import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { BlogStats, PostCategory } from "@/types/blog";
import { VALID_CATEGORIES } from "@/lib/utils";

// Reads posts + comments from Redux, returns a fully typed BlogStats object
export function useBlogStats(authorId?: string): BlogStats {
    const posts = useSelector((state: RootState) => state.posts.posts);
    const comments = useSelector((state: RootState) => state.comments.comments);

    return useMemo(() => {
        // Filter posts and comments by authorId if provided
        const filteredPosts = authorId ? posts.filter((p) => p.authorId === authorId) : posts;
        
        // For comments, filter to those on the author's posts
        const authorPostIds = authorId ? new Set(filteredPosts.map(p => p.id)) : null;
        const filteredComments = authorPostIds ? comments.filter((c) => authorPostIds.has(c.postId)) : comments;

        const publishedPosts = filteredPosts.filter((p) => p.status === "published");
        const draftPosts = filteredPosts.filter((p) => p.status === "draft");

        // Sum viewCount of published posts only
        const totalViews = publishedPosts.reduce((sum, p) => sum + p.viewCount, 0);

        // Top 5 posts by viewCount descending
        const topPosts = [...publishedPosts]
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 5);

        // Count published posts per category
        const byCategory = VALID_CATEGORIES.reduce<Record<PostCategory, number>>(
            (acc, cat) => {
                acc[cat] = publishedPosts.filter((p) => p.category === cat).length;
                return acc;
            },
            {} as Record<PostCategory, number>
        );

        return {
            totalPosts: filteredPosts.length,
            publishedPosts: publishedPosts.length,
            draftPosts: draftPosts.length,
            totalViews,
            totalComments: filteredComments.length,
            topPosts,
            byCategory,
        };
    }, [posts, comments, authorId]);
}