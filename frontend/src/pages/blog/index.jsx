import { ApolloProvider } from '@apollo/client';
import client from '../../lib/apollo-client';
import PostList from '../../components/PostList';
import HeroSection from '../../components/HeroSection';
import Navbar from '../../components/Navbar';

export default function BlogListPage() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <HeroSection />
          <div className="py-12">
            <header className="flex items-center justify-between mb-12">
              <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900">Blog</h1>
              <PostList.ShowCreateButton />
            </header>
            <PostList />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
} 