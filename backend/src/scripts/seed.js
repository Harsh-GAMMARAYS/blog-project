require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');

const samplePosts = [
  {
    title: "Getting Started with GraphQL",
    content: "GraphQL is a powerful query language for APIs that was developed by Facebook. It provides a more efficient, powerful, and flexible alternative to REST. In this post, we'll explore the basics of GraphQL and how it can improve your API development workflow.\n\nKey benefits of GraphQL:\n- Precise data fetching\n- Single endpoint\n- Strong typing\n- Real-time updates\n- Developer tools",
    author: "John Doe",
    createdAt: new Date()
  },
  {
    title: "Building Modern Web Applications with Next.js",
    content: "Next.js is a React framework that enables server-side rendering and static site generation. It's perfect for building modern web applications that need to be fast, SEO-friendly, and developer-friendly.\n\nIn this post, we'll cover:\n- Server-side rendering\n- Static site generation\n- API routes\n- File-based routing\n- Built-in CSS support",
    author: "Jane Smith",
    createdAt: new Date()
  },
  {
    title: "MongoDB Best Practices for Node.js Applications",
    content: "MongoDB is a popular NoSQL database that works great with Node.js applications. In this post, we'll discuss best practices for using MongoDB in your Node.js projects.\n\nTopics covered:\n- Schema design\n- Indexing strategies\n- Connection pooling\n- Error handling\n- Performance optimization",
    author: "Mike Johnson",
    createdAt: new Date()
  },
  {
    title: "Understanding TypeScript in Modern Web Development",
    content: "TypeScript has become an essential tool in modern web development. This post explores how TypeScript enhances JavaScript development with static typing and better tooling.\n\nKey topics:\n- Type system basics\n- Interfaces and types\n- Generics\n- Type inference\n- Integration with React\n- Best practices and patterns",
    author: "Sarah Wilson",
    createdAt: new Date()
  },
  {
    title: "The Future of Web Development: WebAssembly",
    content: "WebAssembly (Wasm) is revolutionizing web development by enabling high-performance applications to run in the browser. Let's explore what this means for the future of web development.\n\nWhat we'll cover:\n- What is WebAssembly?\n- Performance benefits\n- Use cases\n- Integration with JavaScript\n- Future possibilities",
    author: "David Chen",
    createdAt: new Date()
  },
  {
    title: "Building Scalable Microservices with Node.js",
    content: "Microservices architecture has become a popular approach for building scalable applications. This post dives into how to implement microservices using Node.js.\n\nTopics include:\n- Microservices principles\n- Service communication\n- API Gateway pattern\n- Containerization\n- Deployment strategies\n- Monitoring and logging",
    author: "Emily Brown",
    createdAt: new Date()
  },
  {
    title: "Mastering CSS Grid and Flexbox",
    content: "Modern CSS layout techniques have revolutionized web design. This comprehensive guide covers both CSS Grid and Flexbox, showing how to use them together effectively.\n\nWhat you'll learn:\n- Grid layout fundamentals\n- Flexbox basics\n- Combining Grid and Flexbox\n- Responsive design patterns\n- Browser support and fallbacks",
    author: "Alex Thompson",
    createdAt: new Date()
  },
  {
    title: "The Art of API Design",
    content: "Designing great APIs is both an art and a science. This post explores the principles and best practices of API design that every developer should know.\n\nKey principles:\n- RESTful design\n- Resource modeling\n- Error handling\n- Versioning strategies\n- Documentation\n- Security considerations",
    author: "Rachel Martinez",
    createdAt: new Date()
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog');
    console.log('Connected to MongoDB');

    // Insert sample posts without clearing existing ones
    const posts = await Post.insertMany(samplePosts);
    console.log('Inserted sample posts:', posts.length);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 