import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author
      createdAt
    }
  }
`;

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;
  if (!data?.post) return <div className="text-center p-4">Post not found</div>;

  const { post } = data;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Back to Posts
      </button>
      <article className="prose lg:prose-xl">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="whitespace-pre-wrap">{post.content}</div>
      </article>
    </div>
  );
} 