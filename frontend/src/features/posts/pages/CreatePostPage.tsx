import React, { useState } from 'react';
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
import aiApi from '../../ai/api/aiApi';

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
    setValue,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiApi.generateContent({ prompt: aiPrompt });
      setValue('title', result.title, { shouldValidate: true });
      setValue('content', result.content, { shouldValidate: true });
      toast.success('Content generated successfully!');
      setAiPrompt('');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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
        <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-primary-900/40 to-surface-800/40 border border-primary-500/20">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-100">Ask AI to Generate Content</h3>
              <p className="text-xs text-surface-400 mt-0.5">Describe what you want to write about and Groq AI will generate a title and content for you.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Write a blog post about the benefits of React 19..."
              className="flex-1 rounded-xl bg-surface-900/50 border border-surface-600/50 px-4 py-2.5 text-sm text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
              disabled={isGenerating}
            />
            <Button 
              type="button" 
              onClick={handleGenerateAI} 
              isLoading={isGenerating}
              className="shrink-0"
            >
              Generate ✨
            </Button>
          </div>
        </div>

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
