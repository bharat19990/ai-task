import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchMyPosts } from '../postsSlice';
import Card from '../../../components/ui/Card';
import Loader from '../../../components/ui/Loader';

const MyPostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myPosts, isLoading } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch]);

  if (isLoading) {
    return <Loader text="Loading your posts..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-100">My Posts</h1>
        <p className="text-surface-400 mt-1">
          {myPosts.length} post{myPosts.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {myPosts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-surface-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-lg font-medium text-surface-300">No posts yet</h3>
            <p className="text-surface-500 mt-1">Create your first post to see it here</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myPosts.map((post) => (
            <Card key={post._id} hover>
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {post.status}
                </span>
                <span className="text-xs text-surface-500">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2">{post.title}</h3>
              <p className="text-sm text-surface-400 line-clamp-3">{post.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
