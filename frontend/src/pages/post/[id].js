import { ApolloProvider } from '@apollo/client';
import client from '../../lib/apollo-client';
import PostDetail from '../../components/PostDetail';

export default function PostPage() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        <PostDetail />
      </div>
    </ApolloProvider>
  );
} 