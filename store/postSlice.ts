import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostFilters } from "@/types/blog";

// ── State Shape ───────────────────────────────────────────
interface PostState {
    posts: Post[];
    filters: PostFilters;
    selectedPost: Post | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialFilters: PostFilters = {
    status: "all",
    category: "all",
    search: "",
    tags: [],
    authorId: "",
};

const initialState: PostState = {
    posts: [],
    filters: initialFilters,
    selectedPost: null,
    status: "idle",
    error: null,
};


export const fetchPosts = createAsyncThunk<
    Post[],
    Partial<PostFilters> | undefined,
    { rejectValue: string }
>("posts/fetchPosts", async (filters, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== "all") params.set("status", filters.status);
        if (filters?.category && filters.category !== "all") params.set("category", filters.category);
        if (filters?.search) params.set("search", filters.search);
        if (filters?.tags && filters.tags.length > 0) params.set("tags", filters.tags.join(","));
        if (filters?.authorId) params.set("authorId", filters.authorId);

        const res = await fetch(`/api/posts?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        return (await res.json()) as Post[];
    } catch (err) {
        return rejectWithValue((err as Error).message);
    }
});

/** Create new post */
export const createPost = createAsyncThunk<
    Post,
    Omit<Post, "id" | "slug" | "readingTimeMinutes" | "viewCount" | "createdAt" | "updatedAt">,
    { rejectValue: string }
>("posts/createPost", async (postData, { rejectWithValue }) => {
    try {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.errors?.join(", ") ?? "Failed to create post");
        }
        return (await res.json()) as Post;
    } catch (err) {
        return rejectWithValue((err as Error).message);
    }
});

/** Update existing post (alias: editPost) */
export const updatePost = createAsyncThunk<
    Post,
    { id: string; changes: Partial<Post> },
    { rejectValue: string }
>("posts/updatePost", async ({ id, changes }, { rejectWithValue }) => {
    try {
        const res = await fetch(`/api/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error ?? "Failed to update post");
        }
        return (await res.json()) as Post;
    } catch (err) {
        return rejectWithValue((err as Error).message);
    }
});

/** editPost — alias for updatePost (same API, named per exam spec) */
export const editPost = updatePost;

/** Remove post */
export const removePost = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("posts/removePost", async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error ?? "Failed to delete post");
        }
        return id;
    } catch (err) {
        return rejectWithValue((err as Error).message);
    }
});

export const deletePost = removePost;


const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {

        setPosts(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
        },

        addPost(state, action: PayloadAction<Post>) {
            state.posts.unshift(action.payload);
        },

        
        setSelectedPost(state, action: PayloadAction<Post | null>) {
            state.selectedPost = action.payload;
        },

       
        setFilters(state, action: PayloadAction<Partial<PostFilters>>) {
            state.filters = { ...state.filters, ...action.payload };
        },

       
        clearFilters(state) {
            state.filters = initialFilters;
        },
    },

    extraReducers: (builder) => {

        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Unknown error";
            });

        
        builder
            .addCase(createPost.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Unknown error";
            });

        
        builder
            .addCase(updatePost.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.posts.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) state.posts[index] = action.payload;
                if (state.selectedPost?.id === action.payload.id) {
                    state.selectedPost = action.payload;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Unknown error";
            });

        
        builder
            .addCase(removePost.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removePost.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = state.posts.filter((p) => p.id !== action.payload);
                if (state.selectedPost?.id === action.payload) {
                    state.selectedPost = null;
                }
            })
            .addCase(removePost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export const { setPosts, addPost, setSelectedPost, setFilters, clearFilters } =
    postSlice.actions;

export default postSlice.reducer;