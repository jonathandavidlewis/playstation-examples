# Accounts Service

REST API microservice for managing PlayStation user accounts, built with Go.

## Features

- RESTful API for account management (CRUD operations)
- DynamoDB integration for persistent storage
- SNS integration for event notifications
- S3 integration for avatar uploads (future)

## Setup

```bash
go mod download
```

## Configuration

Create a `.env` file:

```env
PORT=8080
AWS_REGION=us-east-1
DYNAMODB_TABLE=accounts-table
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:account-events
```

## Running

```bash
go run cmd/api/main.go
```

## Building

```bash
go build -o accounts-service cmd/api/main.go
```

## API Endpoints

### Health Check
```
GET /health
```

### Create Account
```
POST /api/accounts
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "gamer123",
  "displayName": "Gamer123"
}
```

### Get Account
```
GET /api/accounts/{id}
```

### Update Account
```
PUT /api/accounts/{id}
Content-Type: application/json

{
  "displayName": "NewName",
  "avatarUrl": "https://s3.amazonaws.com/avatars/123.jpg",
  "isPsPlus": true
}
```

### Delete Account
```
DELETE /api/accounts/{id}
```

### List Accounts
```
GET /api/accounts?limit=50
```

## Account Model

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "gamer123",
  "displayName": "Gamer123",
  "avatarUrl": "https://...",
  "psnLevel": 25,
  "trophies": 1500,
  "friendCount": 42,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isVerified": true,
  "isPsPlus": true
}
```
