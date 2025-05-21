const Post = require('../models/Post');

const resolvers = {
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
    createPost: async (_, { title, content, author }) => {
      try {
        const post = new Post({ title, content, author });
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
        const result = await Post.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        throw new Error('Error deleting post');
      }
    }
  }
};

module.exports = resolvers; 