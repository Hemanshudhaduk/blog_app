import { NextRequest, NextResponse } from "next/server";
import { posts } from "@/lib/data";
import { Post, PostCategory, PostStatus } from "@/types/blog";
import {
  slugify,
  computeReadingTime,
  generateId,
  isValidCategory,
  VALID_CATEGORIES,
} from "@/lib/utils";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") as PostStatus | "all" | null;
  const category = searchParams.get("category") as PostCategory | null;
  const search = searchParams.get("search")?.toLowerCase() ?? null;
  const tagsParam = searchParams.get("tags");
  const authorId = searchParams.get("authorId");
  const slug = searchParams.get("slug");

  let result: Post[] = [...posts];


  if (status && status !== "all") {
    result = result.filter((p) => p.status === status);
  }

  if (category && isValidCategory(category)) {
    result = result.filter((p) => p.category === category);
  }

  // Filter by search (title, excerpt, content)
  if (search) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.excerpt.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search)
    );
  }

  // Filter by tags (comma-separated)
  if (tagsParam) {
    const filterTags = tagsParam.split(",").map((t) => t.trim().toLowerCase());
    result = result.filter((p) =>
      filterTags.some((ft) => p.tags.map((t) => t.toLowerCase()).includes(ft))
    );
  }

  // Filter by authorId
  if (authorId) {
    result = result.filter((p) => p.authorId === authorId);
  }

  // Filter by slug (exact match)
  if (slug) {
    result = result.filter((p) => p.slug === slug);
  }

  // Sort by publishedAt or createdAt descending
  result.sort((a, b) => {
    const aDate = a.publishedAt ?? a.createdAt;
    const bDate = b.publishedAt ?? b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return NextResponse.json(result);
}

// ── POST /api/posts ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, excerpt, content, category, tags, status, authorId, coverImageUrl } = body;

    // ── Validation ──────────────────────────────────────
    const errors: string[] = [];

    if (!title || typeof title !== "string" || title.trim().length < 5) {
      errors.push("title: min 5 characters required");
    }
    if (!excerpt || typeof excerpt !== "string" || excerpt.trim().length > 200) {
      errors.push("excerpt: must be present and max 200 characters");
    }
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      errors.push("content: must not be empty");
    }
    if (!category || !isValidCategory(category)) {
      errors.push(`category: must be one of [${VALID_CATEGORIES.join(", ")}]`);
    }
    if (!authorId || typeof authorId !== "string") {
      errors.push("authorId: required");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // ── Slug generation (unique) ────────────────────────
    let slug = slugify(title);
    const existing = posts.map((p) => p.slug);
    if (existing.includes(slug)) {
      slug = `${slug}-${Date.now()}`;
    }

    // ── Build new post ──────────────────────────────────
    const now = new Date().toISOString();
    const newPost: Post = {
      id: generateId("post"),
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category as PostCategory,
      tags: Array.isArray(tags) ? tags : [],
      status: (status as PostStatus) ?? "draft",
      authorId,
      coverImageUrl: coverImageUrl ?? undefined,
      readingTimeMinutes: computeReadingTime(content),
      viewCount: 0,
      publishedAt: status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    posts.push(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}