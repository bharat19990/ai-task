import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createPost } from '../postsSlice';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

const CreatePostPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.posts);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await dispatch(createPost(data)).unwrap();
      toast.success('Post created successfully!');
      navigate('/posts/my-posts');
    } catch {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-100">Create New Post</h1>
        <p className="text-surface-400 mt-1">
          Share your thoughts with the community
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Title"
            placeholder="Enter a catchy title..."
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-300">
              Content
            </label>
            <textarea
              placeholder="Write your post content here..."
              rows={8}
              className={`w-full rounded-xl bg-surface-800/80 border transition-all duration-200
                px-4 py-3 text-sm text-surface-100 placeholder:text-surface-500 resize-none
                ${
                  errors.content
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-surface-600 focus:ring-primary-500 focus:border-primary-500 hover:border-surface-500'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-0`}
              {...register('content')}
            />
            {errors.content && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>
              Publish Post
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostPage;
