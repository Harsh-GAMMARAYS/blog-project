import { useQuery, useMutation, gql } from '@apollo/client';
import Link from 'next/link';
import DeleteModal from './DeleteModal';
import { useState } from 'react';
import Button from './Button';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      author
      content
      createdAt
      format
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export function ShowCreateButton() {
  return (
    <Link
      href="/blog/create"
      className="inline-block text-base font-medium text-gray-600 hover:text-black px-4 py-2 rounded transition-colors duration-150 border border-gray-200 bg-white shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      Write
    </Link>
  );
}

export default function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { data } = await deletePost({
        variables: { id: postToDelete.id },
        update: (cache) => {
          // Remove the deleted post from the cache
          const existingPosts = cache.readQuery({
            query: GET_POSTS
          });

          if (existingPosts) {
            cache.writeQuery({
              query: GET_POSTS,
              data: {
                posts: existingPosts.posts.filter(post => post.id !== postToDelete.id)
              }
            });
          }
        }
      });

      if (data.deletePost) {
        setDeleteModalOpen(false);
        setPostToDelete(null);
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;

  return (
    <>
      <div className="space-y-10">
        {data.posts.map((post) => (
          <div
            key={post.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-0 cursor-pointer border flex"
          >
            {/* Left: Text Content */}
            <div className="flex-1 p-8">
              <Link href={`/blog/${post.id}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                    {post.author ? post.author[0].toUpperCase() : 'A'}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{post.author || 'Anonymous'}</span>
                  <span className="mx-2 text-gray-400">·</span>
                  <span className="text-xs text-gray-400">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : ''}
                  </span>
                  {post.format === 'MARKDOWN' && (
                    <>
                      <span className="mx-2 text-gray-400">·</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">MD</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-blue-700 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-base font-sans text-gray-800 line-clamp-3">
                  {post.content?.slice(0, 180)}{post.content && post.content.length > 180 ? '...' : ''}
                </p>
              </Link>
            </div>
            {/* Right: Buttons */}
            <div className="flex gap-2 pr-8 self-end pb-8">
              <Button
                variant="secondary"
                size="small"
                onClick={() => router.push(`/blog/edit/${post.id}`)}
              >
                Edit
              </Button>
              <Button variant="danger" size="small" onClick={() => handleDeleteClick(post)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        postTitle={postToDelete?.title}
      />
    </>
  );
}

PostList.ShowCreateButton = ShowCreateButton; 