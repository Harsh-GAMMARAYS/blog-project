import { ApolloProvider } from '@apollo/client';
import { useQuery, gql } from '@apollo/client';
import client from '../../lib/apollo-client';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

function BlogPostDetail() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link
          href="/blog"
          className="inline-block mb-6 text-blue-500 hover:text-blue-700"
        >
          ← Back to Blog Posts
        </Link>
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </article>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  return (
    <ApolloProvider client={client}>
      <BlogPostDetail />
    </ApolloProvider>
  );
} 