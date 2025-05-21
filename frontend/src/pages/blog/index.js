import { ApolloProvider } from '@apollo/client';
import client from '../../lib/apollo-client';
import PostList from '../../components/PostList';

export default function BlogListPage() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>
          <PostList />
        </div>
      </div>
    </ApolloProvider>
  );
} 