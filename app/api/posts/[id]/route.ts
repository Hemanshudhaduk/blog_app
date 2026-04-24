import { NextRequest, NextResponse } from "next/server";
import { posts, comments } from "@/lib/data";
import { PostStatus } from "@/types/blog";
import { computeReadingTime } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ── GET /api/posts/[id] ───────────────────────────────────
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const track = new URL(req.url).searchParams.get("track") === "true";

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Increment viewCount on public read if ?track=true
  if (track) {
    posts[index] = { ...posts[index], viewCount: posts[index].viewCount + 1 };
  }

  return NextResponse.json(posts[index]);
}

// ── PUT /api/posts/[id] ───────────────────────────────────
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const existing = posts[index];
    const now = new Date().toISOString();

    // Determine publishedAt: set if status just changed to "published"
    let publishedAt = existing.publishedAt;
    const newStatus = (body.status as PostStatus) ?? existing.status;
    if (newStatus === "published" && !publishedAt) {
      publishedAt = now;
    }

    // Recompute reading time if content updated
    const newContent = body.content ?? existing.content;
    const readingTimeMinutes =
      body.content !== undefined
        ? computeReadingTime(newContent)
        : existing.readingTimeMinutes;

    const updated = {
      ...existing,
      ...body,
      id: existing.id,          // immutable
      slug: existing.slug,      // immutable
      createdAt: existing.createdAt, // immutable
      publishedAt,
      readingTimeMinutes,
      updatedAt: now,
    };

    posts[index] = updated;

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// ── DELETE /api/posts/[id] ────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Remove post
  posts.splice(index, 1);

  // Remove all associated comments
  const toDelete = comments
    .map((c, i) => (c.postId === id ? i : -1))
    .filter((i) => i !== -1)
    .reverse(); // reverse so splice indices stay valid

  toDelete.forEach((i) => comments.splice(i, 1));

  return NextResponse.json({ message: "Post and associated comments deleted" });
}