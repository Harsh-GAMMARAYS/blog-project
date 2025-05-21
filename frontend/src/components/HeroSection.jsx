import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-4 rounded-xl shadow mb-10">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Welcome to Your Blog</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Share your thoughts, ideas, and stories with the world. Create, edit, and manage your blog posts with ease.
        </p>
        <Link href="/blog/create">
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors duration-200">
            Create Your First Post
          </span>
        </Link>
      </div>
    </section>
  );
} 