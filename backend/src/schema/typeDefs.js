const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum PostFormat {
    PLAIN
    MARKDOWN
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: String!
    createdAt: Date!
    format: PostFormat!
  }

  scalar Date

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, author: String!, format: PostFormat!): Post!
    updatePost(id: ID!, title: String, content: String, author: String, format: PostFormat): Post
    deletePost(id: ID!): Boolean!
  }
`;

module.exports = typeDefs; 