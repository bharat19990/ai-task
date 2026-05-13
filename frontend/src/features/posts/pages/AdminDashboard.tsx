import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAllPosts } from '../postsSlice';
import Card from '../../../components/ui/Card';
import { useAuth } from '../../auth/hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const activePosts = posts.filter((p) => p.status === 'active');
  const removedPosts = posts.filter((p) => p.status === 'removed');
  const uniqueAuthors = new Set(posts.map((p) => p.author._id)).size;

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      label: 'Active Posts',
      value: activePosts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Removed Posts',
      value: removedPosts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
    },
    {
      label: 'Authors',
      value: uniqueAuthors,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-100">
          Admin Dashboard
        </h1>
        <p className="text-surface-400 mt-1">
          Welcome back, <span className="text-primary-400">{user?.name}</span>. Here's the platform overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-100">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-surface-100 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {posts.slice(0, 8).map((post) => (
            <div
              key={post._id}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-800/40 hover:bg-surface-800/60 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-surface-200 truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  by {post.author.name} •{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ml-3 ${
                  post.status === 'active'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {post.status}
              </span>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-surface-500 py-8">
              No posts to display
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
