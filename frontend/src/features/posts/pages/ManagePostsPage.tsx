import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAllPosts, updatePost, deletePost } from '../postsSlice';
import { Post } from '../postsTypes';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';

const ManagePostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, isLoading } = useAppSelector((state) => state.posts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'removed'>('all');

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const filteredPosts =
    filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await dispatch(deletePost(selectedPost._id)).unwrap();
      toast.success('Post removed successfully');
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch {
      toast.error('Failed to remove post');
    }
  };

  const handleEdit = async () => {
    if (!selectedPost) return;
    try {
      await dispatch(
        updatePost({
          id: selectedPost._id,
          data: { title: editTitle, content: editContent },
        })
      ).unwrap();
      toast.success('Post updated successfully');
      setShowEditModal(false);
      setSelectedPost(null);
    } catch {
      toast.error('Failed to update post');
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === 'active' ? 'removed' : 'active';
    try {
      await dispatch(
        updatePost({
          id: post._id,
          data: { status: newStatus },
        })
      ).unwrap();
      toast.success(
        `Post ${newStatus === 'active' ? 'restored' : 'removed'} successfully`
      );
    } catch {
      toast.error('Failed to update post status');
    }
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setShowEditModal(true);
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (post: Post) => (
        <div className="max-w-xs">
          <p className="font-medium text-surface-200 truncate">{post.title}</p>
          <p className="text-xs text-surface-500 truncate mt-0.5">
            {post.content.substring(0, 60)}...
          </p>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (post: Post) => (
        <div>
          <p className="text-surface-300">{post.author.name}</p>
          <p className="text-xs text-surface-500">{post.author.email}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post: Post) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            post.status === 'active'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}
        >
          {post.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (post: Post) => (
        <span className="text-surface-400 text-xs">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (post: Post) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEditModal(post)}
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleToggleStatus(post)}
            title={post.status === 'active' ? 'Remove' : 'Restore'}
          >
            {post.status === 'active' ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </Button>
          {post.status === 'active' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedPost(post);
                setShowDeleteModal(true);
              }}
              title="Delete"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-100">Manage Posts</h1>
          <p className="text-surface-400 mt-1">
            Moderate and manage all platform posts
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-800/60 rounded-xl border border-surface-700/50">
          {(['all', 'active', 'removed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize cursor-pointer ${
                filter === f
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
              }`}
            >
              {f}
              <span className="ml-1.5 text-xs opacity-70">
                ({f === 'all'
                  ? posts.length
                  : posts.filter((p) => p.status === f).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPosts}
        keyExtractor={(post) => post._id}
        emptyMessage="No posts found"
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPost(null);
        }}
        title="Remove Post"
        size="sm"
      >
        <p className="text-surface-300 mb-6">
          Are you sure you want to remove{' '}
          <span className="font-semibold text-surface-100">
            "{selectedPost?.title}"
          </span>
          ? This will mark the post as removed.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedPost(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Remove Post
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPost(null);
        }}
        title="Edit Post"
        size="lg"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-300">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl bg-surface-800/80 border border-surface-600 px-4 py-2.5 text-sm text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-300">
              Content
            </label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={6}
              className="w-full rounded-xl bg-surface-800/80 border border-surface-600 px-4 py-3 text-sm text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-3 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setSelectedPost(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePostsPage;
