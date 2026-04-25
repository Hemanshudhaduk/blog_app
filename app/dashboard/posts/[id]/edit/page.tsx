import { notFound } from "next/navigation";
import { Post } from "@/types/blog";
import { PostFormClient } from "@/components/Postformclient";

async function getPost(id: string): Promise<Post | null> {
    const res = await fetch(`/api/posts/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
}

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) notFound();

    return <PostFormClient initialPost={post} mode="edit" />;
}
