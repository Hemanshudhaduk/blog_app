import { Post, Comment, Author } from "@/types/blog";


export const SEED_AUTHORS : Author[] = [
  {
    id: "author-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    bio: "Senior developer and tech writer.",
    avatarUrl: "https://i.pravatar.cc/150?u=alice",
  },
  {
    id: "author-2",
    name: "Bob Smith",
    email: "bob@example.com",
    bio: "Designer and UX enthusiast.",
    avatarUrl: "https://i.pravatar.cc/150?u=bob",
  },
];


export const posts: Post[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 14",
    slug: "getting-started-with-nextjs-14",
    excerpt: "A beginner-friendly guide to Next.js 14 App Router and server components.",
    content:
      "# Getting Started with Next.js 14\n\nNext.js 14 introduces the stable App Router...\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    category: "technology",
    tags: ["nextjs", "react", "webdev"],
    status: "published",
    authorId: "author-1",
    coverImageUrl: "https://picsum.photos/seed/nextjs/800/400",
    readingTimeMinutes: 3,
    viewCount: 142,
    publishedAt: "2024-01-15T10:00:00.000Z",
    createdAt: "2024-01-14T08:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "post-2",
    title: "Tailwind CSS Design Tips",
    slug: "tailwind-css-design-tips",
    excerpt: "Practical tips for building beautiful UIs with Tailwind CSS utility classes.",
    content:
      "# Tailwind CSS Design Tips\n\nTailwind CSS makes styling fast and consistent...\n\nHere are some tips to level up your design game with Tailwind.",
    category: "design",
    tags: ["tailwind", "css", "design"],
    status: "published",
    authorId: "author-2",
    coverImageUrl: "https://picsum.photos/seed/tailwind/800/400",
    readingTimeMinutes: 2,
    viewCount: 98,
    publishedAt: "2024-02-01T09:00:00.000Z",
    createdAt: "2024-01-30T07:00:00.000Z",
    updatedAt: "2024-02-01T09:00:00.000Z",
  },
  {
    id: "post-3",
    title: "Redux Toolkit in 2024",
    slug: "redux-toolkit-in-2024",
    excerpt: "How Redux Toolkit simplifies state management in modern React applications.",
    content:
      "# Redux Toolkit in 2024\n\nRedux Toolkit is the official recommended way to write Redux logic...",
    category: "tutorial",
    tags: ["redux", "react", "state-management"],
    status: "draft",
    authorId: "author-1",
    readingTimeMinutes: 4,
    viewCount: 0,
    createdAt: "2024-02-10T12:00:00.000Z",
    updatedAt: "2024-02-10T12:00:00.000Z",
  },
];


export const comments: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    authorName: "Charlie Dev",
    authorEmail: "charlie@example.com",
    content: "Great article! Very helpful for beginners.",
    approved: true,
    createdAt: "2024-01-16T08:00:00.000Z",
  },
  {
    id: "comment-2",
    postId: "post-1",
    authorName: "Diana Ray",
    authorEmail: "diana@example.com",
    content: "Could you add more examples on server actions?",
    approved: false,
    createdAt: "2024-01-17T10:30:00.000Z",
  },
  {
    id: "comment-3",
    postId: "post-2",
    authorName: "Eve Cole",
    authorEmail: "eve@example.com",
    content: "The design tips are gold. Bookmarked!",
    approved: true,
    createdAt: "2024-02-03T14:00:00.000Z",
  },
];