import api from '../../../services/axios';
import { ApiResponse } from '../../../types';
import { Post, CreatePostData, UpdatePostData } from '../postsTypes';

/**
 * Posts API service - handles all post-related HTTP requests.
 */
const postsApi = {
  createPost: async (data: CreatePostData): Promise<ApiResponse<Post>> => {
    const response = await api.post<ApiResponse<Post>>('/posts', data);
    return response.data;
  },

  getAllPosts: async (): Promise<ApiResponse<Post[]> & { count: number }> => {
    const response = await api.get<ApiResponse<Post[]> & { count: number }>('/posts');
    return response.data;
  },

  getMyPosts: async (): Promise<ApiResponse<Post[]> & { count: number }> => {
    const response = await api.get<ApiResponse<Post[]> & { count: number }>('/posts/my-posts');
    return response.data;
  },

  updatePost: async ({ id, data }: UpdatePostData): Promise<ApiResponse<Post>> => {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await api.delete<ApiResponse<Post>>(`/posts/${id}`);
    return response.data;
  },
};

export default postsApi;
