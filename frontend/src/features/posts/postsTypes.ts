export type PostStatus = 'active' | 'removed';

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PostsState {
  posts: Post[];
  myPosts: Post[];
  isLoading: boolean;
  error: string | null;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  id: string;
  data: Partial<{
    title: string;
    content: string;
    status: PostStatus;
  }>;
}
