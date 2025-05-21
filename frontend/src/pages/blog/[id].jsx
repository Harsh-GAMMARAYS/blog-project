import { ApolloProvider } from '@apollo/client';
import { useQuery, useMutation, gql } from '@apollo/client';
import client from '../../lib/apollo-client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import MarkdownContent from '../../components/MarkdownContent';

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author
      format
      createdAt
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

function BlogPostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    skip: !id,
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      router.push('/blog');
    }
  });

  const handleDelete = async () => {
    try {
      await deletePost({
        variables: { id },
        update: (cache) => {
          // Remove the deleted post from the cache
          const existingPosts = cache.readQuery({
            query: gql`
              query GetPosts {
                posts {
                  id
                  title
                  content
                  author
                  format
                  createdAt
                }
              }
            `
          });
          
          if (existingPosts) {
            cache.writeQuery({
              query: gql`
                query GetPosts {
                  posts {
                    id
                    title
                    content
                    author
                    format
                    createdAt
                  }
                }
              `,
              data: {
                posts: existingPosts.posts.filter(post => post.id !== id)
              }
            });
          }
        }
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;
  if (!data?.post) return <div className="text-center p-4">Post not found</div>;

  const { post } = data;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/blog"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to Blog Posts
            </Link>
            <div className="flex gap-4">
              <Link
                href={`/blog/edit/${post.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
          <article className="prose lg:prose-xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-600 mb-8">
              By {post.author} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : ''}
            </div>
            <div className={post.format === 'MARKDOWN' ? 'markdown-content' : 'whitespace-pre-wrap'}>
              {post.format === 'MARKDOWN' ? (
                <MarkdownContent content={post.content} />
              ) : (
                post.content
              )}
            </div>
          </article>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDelete();
          setShowDeleteModal(false);
        }}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="bg-red-500 hover:bg-red-600"
      />
    </>
  );
}

export default function BlogPostPage() {
  return (
    <ApolloProvider client={client}>
      <BlogPostDetail />
    </ApolloProvider>
  );
} 