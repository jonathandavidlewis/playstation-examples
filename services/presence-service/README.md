# Presence Service

WebSocket and GraphQL-based presence microservice for the PlayStation Family Application.

## Features

- WebSocket server for real-time presence updates
- GraphQL API for querying and mutating presence data
- DynamoDB integration for persistent storage
- SNS integration for event notifications

## Setup

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
PORT=4000
NODE_ENV=development
AWS_REGION=us-east-1
DYNAMODB_TABLE=presence-table
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:presence-updates
```

## Running

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## GraphQL API

Access GraphiQL at: `http://localhost:4000/graphql`

### Example Queries

Get user presence:
```graphql
query {
  presence(userId: "user123") {
    userId
    status
    isOnline
    currentGame
    lastSeen
  }
}
```

Update presence:
```graphql
mutation {
  updatePresence(
    userId: "user123"
    status: "online"
    isOnline: true
    currentGame: "God of War"
  ) {
    userId
    status
    isOnline
    currentGame
  }
}
```

## WebSocket API

Connect to: `ws://localhost:4000`

### Message Types

Authenticate:
```json
{
  "type": "authenticate",
  "userId": "user123"
}
```

Subscribe to presence updates:
```json
{
  "type": "subscribe",
  "userIds": ["user456", "user789"]
}
```

Presence update notification:
```json
{
  "type": "presence_update",
  "userId": "user456",
  "presence": {
    "status": "online",
    "isOnline": true,
    "currentGame": "Spider-Man"
  }
}
```
