require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const connectDB = require('./config/db');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

// Start server
const PORT = process.env.PORT || 4000;

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer(); 