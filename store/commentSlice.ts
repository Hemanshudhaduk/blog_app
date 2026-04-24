import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "@/types/blog";

// ── State Shape ───────────────────────────────────────────
interface CommentState {
  comments: Comment[];
  pendingCount: number; // comments where approved === false
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  pendingCount: 0,
  status: "idle",
  error: null,
};

/** Helper: recompute pendingCount from array */
function computePending(comments: Comment[]): number {
  return comments.filter((c) => !c.approved).length;
}


export const fetchComments = createAsyncThunk<
  Comment[],
  { postId?: string; approved?: boolean } | undefined,
  { rejectValue: string }
>("comments/fetchComments", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters?.postId) params.set("postId", filters.postId);
    if (filters?.approved !== undefined) params.set("approved", String(filters.approved));

    const res = await fetch(`/api/comments?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return (await res.json()) as Comment[];
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

/** Submit new comment */
export const submitComment = createAsyncThunk<
  Comment,
  { postId: string; authorName: string; authorEmail: string; content: string },
  { rejectValue: string }
>("comments/submitComment", async (commentData, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors?.join(", ") ?? "Failed to submit comment");
    }
    return (await res.json()) as Comment;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

/** Approve or reject a comment */
export const moderateComment = createAsyncThunk<
  Comment,
  { id: string; approved: boolean },
  { rejectValue: string }
>("comments/moderateComment", async ({ id, approved }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to moderate comment");
    }
    return (await res.json()) as Comment;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

/** Delete a comment */
export const deleteComment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("comments/deleteComment", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to delete comment");
    }
    return id;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// ── Slice ─────────────────────────────────────────────────
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload;
      state.pendingCount = computePending(state.comments);
    },

    /** Add single comment + recompute pendingCount */
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
      state.pendingCount = computePending(state.comments);
    },

    /** Update single comment in array + recompute pendingCount */
    updateComment(state, action: PayloadAction<Comment>) {
      const index = state.comments.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.comments[index] = action.payload;
        state.pendingCount = computePending(state.comments);
      }
    },

    /** Remove comment by id + recompute pendingCount */
    removeComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
      state.pendingCount = computePending(state.comments);
    },
  },

  extraReducers: (builder) => {
    // ── fetchComments ───────────────────────────────────
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
        state.pendingCount = computePending(state.comments);
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // ── submitComment ───────────────────────────────────
    builder
      .addCase(submitComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments.push(action.payload);
        state.pendingCount = computePending(state.comments);
      })
      .addCase(submitComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // ── moderateComment ─────────────────────────────────
    builder
      .addCase(moderateComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(moderateComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.comments.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
          state.pendingCount = computePending(state.comments);
        }
      })
      .addCase(moderateComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // ── deleteComment ───────────────────────────────────
    builder
      .addCase(deleteComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = state.comments.filter((c) => c.id !== action.payload);
        state.pendingCount = computePending(state.comments);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { setComments, addComment, updateComment, removeComment } =
  commentSlice.actions;

export default commentSlice.reducer;