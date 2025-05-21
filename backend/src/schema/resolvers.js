const Post = require('../models/Post');

const resolvers = {
  Date: {
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
  },
  Query: {
    posts: async () => {
      try {
        return await Post.find().sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Error fetching posts');
      }
    },
    post: async (_, { id }) => {
      try {
        return await Post.findById(id);
      } catch (error) {
        throw new Error('Error fetching post');
      }
    }
  },
  Mutation: {
    createPost: async (_, { title, content, author, format }) => {
      try {
        const post = new Post({ title, content, author, format });
        return await post.save();
      } catch (error) {
        throw new Error('Error creating post');
      }
    },
    updatePost: async (_, { id, ...updates }) => {
      try {
        return await Post.findByIdAndUpdate(
          id,
          { ...updates },
          { new: true }
        );
      } catch (error) {
        throw new Error('Error updating post');
      }
    },
    deletePost: async (_, { id }) => {
      try {
        // First check if the post exists
        const post = await Post.findById(id);
        if (!post) {
          throw new Error('Post not found');
        }

        // Attempt to delete the post
        const result = await Post.findByIdAndDelete(id);
        
        if (!result) {
          throw new Error('Failed to delete post');
        }

        return true;
      } catch (error) {
        console.error('Delete post error:', error);
        throw new Error(error.message || 'Error deleting post');
      }
    }
  }
};

module.exports = resolvers; 