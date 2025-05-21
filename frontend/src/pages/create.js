import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';
import PostForm from '../components/PostForm';
import { useRouter } from 'next/router';

export default function CreatePost() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 px-4">Create New Post</h1>
          <PostForm onSuccess={handleSuccess} />
        </div>
      </div>
    </ApolloProvider>
  );
} 