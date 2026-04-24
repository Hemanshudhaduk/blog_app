import { NextRequest, NextResponse } from "next/server";
import { comments, posts } from "@/lib/data";
import { Comment } from "@/types/blog";
import { generateId, isValidEmail } from "@/lib/utils";

// ── GET /api/comments ─────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const postId = searchParams.get("postId");
  const approvedParam = searchParams.get("approved");

  let result: Comment[] = [...comments];

  if (postId) {
    result = result.filter((c) => c.postId === postId);
  }

  if (approvedParam !== null) {
    const approved = approvedParam === "true";
    result = result.filter((c) => c.approved === approved);
  }

  return NextResponse.json(result);
}

// ── POST /api/comments ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, authorName, authorEmail, content } = body;

    // ── Validation ──────────────────────────────────────
    const errors: string[] = [];

    const postExists = posts.some((p) => p.id === postId);
    if (!postId || !postExists) {
      errors.push("postId: must reference an existing post");
    }
    if (!authorName || typeof authorName !== "string" || authorName.trim().length === 0) {
      errors.push("authorName: must not be empty");
    }
    if (!authorEmail || !isValidEmail(authorEmail)) {
      errors.push("authorEmail: must be a valid email address");
    }
    if (!content || typeof content !== "string" || content.trim().length < 5) {
      errors.push("content: min 5 characters required");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // ── Build comment ───────────────────────────────────
    const newComment: Comment = {
      id: generateId("comment"),
      postId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim().toLowerCase(),
      content: content.trim(),
      approved: false,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}