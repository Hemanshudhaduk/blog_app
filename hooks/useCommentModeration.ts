import { useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { moderateComment, deleteComment } from "@/store/commentSlice";
import { Comment } from "@/types/blog";

interface UseCommentModerationReturn {
    pendingComments: Comment[];   // approved === false, sorted by createdAt desc
    approvedComments: Comment[];  // approved === true,  sorted by createdAt desc
    approveComment: (id: string) => void;
    rejectComment: (id: string) => void;
    pendingCount: number;
}

export function useCommentModeration(authorId?: string): UseCommentModerationReturn {
    const dispatch = useDispatch<AppDispatch>();
    const comments = useSelector((state: RootState) => state.comments.comments);
    const posts = useSelector((state: RootState) => state.posts.posts);

    // Sort helper — newest first
    const byDateDesc = (a: Comment, b: Comment) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    // Filter comments to only those on posts by the author
    const authorPostIds = authorId ? new Set(posts.filter((p) => p.authorId === authorId).map((p) => p.id)) : null;
    const filteredComments = authorPostIds ? comments.filter((c) => authorPostIds.has(c.postId)) : comments;

    const pendingComments = useMemo(
        () => filteredComments.filter((c) => !c.approved).sort(byDateDesc),
        [filteredComments]
    );

    const approvedComments = useMemo(
        () => filteredComments.filter((c) => c.approved).sort(byDateDesc),
        [filteredComments]
    );

    const pendingCount = useMemo(
        () => filteredComments.filter((c) => !c.approved).length,
        [filteredComments]
    );

    // Approve: dispatch moderateComment with approved: true
    const approveComment = useCallback(
        (id: string) => {
            dispatch(moderateComment({ id, approved: true }));
        },
        [dispatch]
    );

    // Reject: delete the comment entirely
    const rejectComment = useCallback(
        (id: string) => {
            dispatch(deleteComment(id));
        },
        [dispatch]
    );

    return {
        pendingComments,
        approvedComments,
        approveComment,
        rejectComment,
        pendingCount,
    };
}