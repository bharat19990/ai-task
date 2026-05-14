import React, { useState, useEffect } from 'react';
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
import aiApi, { Suggestion } from '../../ai/api/aiApi';

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const result = await aiApi.getSuggestions();
      setSuggestions(result);
    } catch {
      console.error('Failed to load suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

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
    } catch {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSuggestion = (suggestion: Suggestion) => {
    setAiPrompt(suggestion.title);
  };

  const handleGenerateFromSuggestion = async (suggestion: Suggestion) => {
    setAiPrompt(suggestion.title);
    setIsGenerating(true);
    try {
      const result = await aiApi.generateContent({
        prompt: `Write a detailed blog post about: ${suggestion.title}. Context: ${suggestion.description}`,
      });
      setValue('title', result.title, { shouldValidate: true });
      setValue('content', result.content, { shouldValidate: true });
      toast.success('Content generated from suggestion!');
    } catch {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-100">Create New Post</h1>
        <p className="text-surface-400 mt-1">
          Share your thoughts with the community
        </p>
      </div>

      {/* AI Suggestions Panel */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-100">AI Post Suggestions</h3>
              <p className="text-xs text-surface-500">Based on your previous posts</p>
            </div>
          </div>
          <button
            onClick={fetchSuggestions}
            disabled={isLoadingSuggestions}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${isLoadingSuggestions ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {isLoadingSuggestions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-800/30 animate-pulse">
                <div className="h-4 bg-surface-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-700/60 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group p-4 rounded-xl bg-surface-800/40 border border-surface-700/40 hover:border-primary-500/30 hover:bg-surface-800/60 transition-all cursor-pointer"
                onClick={() => handleUseSuggestion(suggestion)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-surface-200 group-hover:text-primary-300 transition-colors line-clamp-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-surface-500 mt-1 line-clamp-2">
                      {suggestion.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateFromSuggestion(suggestion);
                    }}
                    disabled={isGenerating}
                    className="shrink-0 mt-0.5 p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-50"
                    title="Generate full post from this suggestion"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-500 text-center py-4">
            No suggestions available. Click refresh to generate new ones.
          </p>
        )}
      </Card>

      {/* AI Generate Section + Form */}
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
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
              placeholder="e.g. Write a blog post about the benefits of React 19..."
              className="flex-1 rounded-xl bg-surface-900/50 border border-surface-600/50 px-4 py-2.5 text-sm text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 placeholder:text-surface-500"
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
