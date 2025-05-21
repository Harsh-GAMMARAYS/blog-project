import { ApolloProvider } from '@apollo/client';
import { useQuery, gql } from '@apollo/client';
import client from '../../lib/apollo-client';
import PostForm from '../../components/PostForm';
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

function EditPostContent() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    skip: !id,
  });

  const handleSuccess = () => {
    router.push('/');
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;
  if (!data?.post) return <div className="text-center p-4">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 px-4">Edit Post</h1>
        <PostForm post={data.post} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default function EditPost() {
  return (
    <ApolloProvider client={client}>
      <EditPostContent />
    </ApolloProvider>
  );
} 