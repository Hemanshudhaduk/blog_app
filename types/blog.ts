export type PostStatus = "draft" | "published" | "archived";
export type PostCategory =
  | "technology"
  | "design"
  | "business"
  | "lifestyle"
  | "tutorial"
  | "opinion"
  | "news";
export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}
export interface Post {
  id: string;
  title: string;
  slug: string;           // URL-friendly, e.g., "my-first-blog-post"
  excerpt: string;        // Short summary, max 200 chars
  content: string;        // Markdown content
  category: PostCategory;
  tags: string[];
  status: PostStatus;
  authorId: string;
  coverImageUrl?: string;
  readingTimeMinutes: number; // computed: Math.ceil(wordCount / 200)
  viewCount: number;
  publishedAt?: string;   // ISO timestamp, set when status → "published"
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: string;
}
export interface PostFilters {
  status: PostStatus | "all";
  category: PostCategory | "all";
   search: string;
  tags: string[];
  authorId: string;
}
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  topPosts: Post[];    // top 5 by viewCount
  byCategory: Record<PostCategory, number>;
}
