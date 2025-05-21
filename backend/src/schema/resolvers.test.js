const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const { createTestClient } = require('apollo-server-testing');

describe('Post Resolvers', () => {
  let server;
  let query;
  let mutate;
  let postId;

  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/blog_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server = new ApolloServer({ typeDefs, resolvers });
    const testClient = createTestClient(server);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  it('creates a post', async () => {
    const CREATE_POST = `
      mutation {
        createPost(title: "Test", content: "Content", author: "Author", format: MARKDOWN) {
          id
          title
          content
          author
          format
        }
      }
    `;
    const res = await mutate({ mutation: CREATE_POST });
    expect(res.data.createPost.title).toBe('Test');
    expect(res.data.createPost.format).toBe('MARKDOWN');
  });

  it('fetches posts', async () => {
    await Post.create({ title: 'T', content: 'C', author: 'A', format: 'MARKDOWN' });
    const GET_POSTS = `
      query {
        posts {
          id
          title
        }
      }
    `;
    const res = await query({ query: GET_POSTS });
    expect(res.data.posts.length).toBeGreaterThan(0);
    expect(res.data.posts[0].title).toBe('T');
  });

  it('updates a post', async () => {
    const post = await Post.create({ title: 'T', content: 'C', author: 'A', format: 'MARKDOWN' });
    const UPDATE_POST = `
      mutation {
        updatePost(id: "${post.id}", title: "T2", content: "C2", author: "A2", format: MARKDOWN) {
          id
          title
          content
          author
        }
      }
    `;
    const res = await mutate({ mutation: UPDATE_POST });
    expect(res.data.updatePost.title).toBe('T2');
    expect(res.data.updatePost.author).toBe('A2');
  });

  it('deletes a post', async () => {
    const post = await Post.create({ title: 'T', content: 'C', author: 'A', format: 'MARKDOWN' });
    const DELETE_POST = `
      mutation {
        deletePost(id: "${post.id}") {
          id
        }
      }
    `;
    const res = await mutate({ mutation: DELETE_POST });
    expect(res.data.deletePost.id).toBe(post.id);
    const found = await Post.findById(post.id);
    expect(found).toBeNull();
  });

  it('returns error for updating non-existent post', async () => {
    const UPDATE_POST = `
      mutation {
        updatePost(id: "nonexistentid", title: "T", content: "C", author: "A", format: MARKDOWN) {
          id
        }
      }
    `;
    const res = await mutate({ mutation: UPDATE_POST });
    expect(res.errors).toBeDefined();
  });

  it('returns error for deleting non-existent post', async () => {
    const DELETE_POST = `
      mutation {
        deletePost(id: "nonexistentid") {
          id
        }
      }
    `;
    const res = await mutate({ mutation: DELETE_POST });
    expect(res.errors).toBeDefined();
  });
}); 