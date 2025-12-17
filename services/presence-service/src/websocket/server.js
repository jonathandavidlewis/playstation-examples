const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const clients = new Map();

function initWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    const clientId = uuidv4();
    console.log(`New WebSocket connection: ${clientId}`);

    // Store client connection
    clients.set(clientId, { ws, userId: null, subscriptions: new Set() });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleMessage(clientId, data);
      } catch (error) {
        console.error('Error parsing message:', error);
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed: ${clientId}`);
      clients.delete(clientId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${clientId}:`, error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      clientId: clientId,
      message: 'Connected to Presence Service',
    }));
  });

  return wss;
}

function handleMessage(clientId, data) {
  const client = clients.get(clientId);
  if (!client) return;

  const { ws } = client;

  switch (data.type) {
    case 'authenticate':
      client.userId = data.userId;
      ws.send(JSON.stringify({
        type: 'authenticated',
        userId: data.userId,
      }));
      break;

    case 'subscribe':
      // Subscribe to presence updates for specific users
      if (data.userIds && Array.isArray(data.userIds)) {
        data.userIds.forEach(userId => client.subscriptions.add(userId));
        ws.send(JSON.stringify({
          type: 'subscribed',
          userIds: data.userIds,
        }));
      }
      break;

    case 'unsubscribe':
      if (data.userIds && Array.isArray(data.userIds)) {
        data.userIds.forEach(userId => client.subscriptions.delete(userId));
        ws.send(JSON.stringify({
          type: 'unsubscribed',
          userIds: data.userIds,
        }));
      }
      break;

    case 'presence_update':
      // Broadcast presence update to subscribed clients
      broadcastPresenceUpdate(data.userId, data.presence);
      break;

    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;

    default:
      ws.send(JSON.stringify({ error: 'Unknown message type' }));
  }
}

function broadcastPresenceUpdate(userId, presence) {
  const message = JSON.stringify({
    type: 'presence_update',
    userId: userId,
    presence: presence,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.subscriptions.has(userId)) {
      client.ws.send(message);
    }
  });
}

module.exports = {
  initWebSocketServer,
  broadcastPresenceUpdate,
};
