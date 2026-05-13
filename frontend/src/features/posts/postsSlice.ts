import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostsState, CreatePostData, UpdatePostData } from './postsTypes';
import postsApi from './api/postsApi';

const initialState: PostsState = {
  posts: [],
  myPosts: [],
  isLoading: false,
  error: null,
};

// Create a post
export const createPost = createAsyncThunk(
  'posts/create',
  async (data: CreatePostData, { rejectWithValue }) => {
    try {
      const response = await postsApi.createPost(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create post'
      );
    }
  }
);

// Get all posts (admin)
export const fetchAllPosts = createAsyncThunk(
  'posts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsApi.getAllPosts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch posts'
      );
    }
  }
);

// Get my posts
export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsApi.getMyPosts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your posts'
      );
    }
  }
);

// Update a post
export const updatePost = createAsyncThunk(
  'posts/update',
  async (updateData: UpdatePostData, { rejectWithValue }) => {
    try {
      const response = await postsApi.updatePost(updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update post'
      );
    }
  }
);

// Delete a post (admin soft-delete)
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await postsApi.deletePost(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete post'
      );
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPostsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.myPosts.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch All Posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload || [];
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch My Posts
      .addCase(fetchMyPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPosts = action.payload || [];
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.posts.findIndex((p) => p._id === action.payload!._id);
          if (idx !== -1) state.posts[idx] = action.payload;

          const myIdx = state.myPosts.findIndex((p) => p._id === action.payload!._id);
          if (myIdx !== -1) state.myPosts[myIdx] = action.payload;
        }
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.posts.findIndex((p) => p._id === action.payload!._id);
          if (idx !== -1) state.posts[idx] = action.payload;
        }
      });
  },
});

export const { clearPostsError } = postsSlice.actions;
export default postsSlice.reducer;
