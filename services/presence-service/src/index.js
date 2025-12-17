const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const { initWebSocketServer } = require('./websocket/server');
const config = require('./config/config');

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: config.NODE_ENV === 'development',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'presence-service' });
});

// Initialize WebSocket server
const wss = initWebSocketServer(server);

// Start server
const PORT = config.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Presence Service running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
