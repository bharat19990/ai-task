import React, { useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchMyPosts } from '../postsSlice';
import Card from '../../../components/ui/Card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { myPosts } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch]);

  const activePosts = myPosts.filter((p) => p.status === 'active');
  const removedPosts = myPosts.filter((p) => p.status === 'removed');

  const stats = [
    {
      label: 'Total Posts',
      value: myPosts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      label: 'Active',
      value: activePosts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Removed',
      value: removedPosts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-100">
          Welcome back,{' '}
          <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-surface-400 mt-1">
          Here's an overview of your activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      {/* Recent Posts */}
      <Card>
        <h2 className="text-lg font-semibold text-surface-100 mb-4">
          Recent Posts
        </h2>
        {myPosts.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-surface-600 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="text-surface-400">No posts yet</p>
            <p className="text-sm text-surface-500 mt-1">
              Create your first post to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPosts.slice(0, 5).map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-800/40 hover:bg-surface-800/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-surface-200 truncate">
                    {post.title}
                  </h3>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    post.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
