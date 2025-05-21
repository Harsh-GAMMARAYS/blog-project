import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      author
      createdAt
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export default function PostList() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_POSTS);
  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost({ variables: { id } });
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-end mb-8">
        <Link
          href="/blog/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Post
        </Link>
      </div>
      <div className="space-y-4">
        {data.posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                >
                  {post.title}
                </Link>
                <p className="text-gray-600 mt-1">
                  By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 