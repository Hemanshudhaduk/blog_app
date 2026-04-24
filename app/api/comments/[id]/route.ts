import { NextRequest, NextResponse } from "next/server";
import { comments } from "@/lib/data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ── PUT /api/comments/[id] ────────────────────────────────
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    if (typeof body.approved !== "boolean") {
      return NextResponse.json(
        { error: "approved: must be a boolean" },
        { status: 400 }
      );
    }

    comments[index] = { ...comments[index], approved: body.approved };

    return NextResponse.json(comments[index]);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// ── DELETE /api/comments/[id] ─────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  comments.splice(index, 1);

  return NextResponse.json({ message: "Comment deleted" });
}