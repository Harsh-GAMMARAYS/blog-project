import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import ConfirmModal from './ConfirmModal';
import MarkdownContent from './MarkdownContent';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $author: String!) {
    createPost(title: $title, content: $content, author: $author, format: MARKDOWN) {
      id
      title
      content
      author
      format
      createdAt
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $content: String!, $author: String!) {
    updatePost(id: $id, title: $title, content: $content, author: $author, format: MARKDOWN) {
      id
      title
      content
      author
      format
      createdAt
    }
  }
`;

export default function PostForm({ post, onSuccess }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [createPost, { loading: createLoading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      if (!post) {
        // Only reset form and redirect for new posts
        setTitle('');
        setContent('');
        setAuthor('');
        setHasChanges(false);
        setIsSaving(false);
        if (onSuccess) onSuccess();
      }
    },
  });

  const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      setHasChanges(false);
      setIsSaving(false);
      // Redirect to the blog post view after updating
      if (post) {
        router.push(`/blog/${post.id}`);
      }
    },
  });

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (hasChanges && !isSaving) {
        setPendingRoute(url);
        setShowLeaveModal(true);
        router.events.emit('routeChangeError');
        throw 'routeChange aborted';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [hasChanges, router, isSaving]);

  useEffect(() => {
    const hasUnsavedChanges = 
      title !== (post?.title || '') ||
      content !== (post?.content || '') ||
      author !== (post?.author || '');
    setHasChanges(hasUnsavedChanges);
  }, [title, content, author, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasChanges) {
      setShowSaveModal(true);
    }
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    const postData = { title, content, author };
    try {
      if (post) {
        await updatePost({ variables: { id: post.id, ...postData } });
      } else {
        await createPost({ variables: postData });
      }
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving post:', error);
      setErrorMsg('Failed to save post. Please try again.');
      setIsSaving(false);
    }
  };

  const handleLeaveConfirm = () => {
    setShowLeaveModal(false);
    setHasChanges(false);
    if (pendingRoute) {
      router.push(pendingRoute);
    }
  };

  return (
    <>
      {errorMsg && (
        <div className="max-w-6xl mx-auto p-4 mb-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMsg}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="text-sm text-gray-500">
              <span className="font-mono">**bold**</span> • 
              <span className="font-mono">*italic*</span> • 
              <span className="font-mono"># heading</span> • 
              <span className="font-mono">- list</span> • 
              <span className="font-mono">```code```</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={20}
                className="block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono p-4"
                placeholder="Write your content here using markdown..."
              />
            </div>
            <div className="border rounded-md p-6 bg-white overflow-auto">
              <div className="prose max-w-none">
                <MarkdownContent content={content || '*Start writing to see the preview...*'} />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={createLoading || updateLoading || !hasChanges}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {createLoading || updateLoading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </form>

      <ConfirmModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleConfirmSave}
        title={post ? "Update Post" : "Create Post"}
        message={post ? "Are you sure you want to save these changes?" : "Are you sure you want to create this post?"}
        confirmText={post ? "Update" : "Create"}
        confirmStyle="bg-blue-500 hover:bg-blue-600"
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setPendingRoute(null);
        }}
        onConfirm={handleLeaveConfirm}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmText="Leave"
        confirmStyle="bg-red-500 hover:bg-red-600"
      />
    </>
  );
} 