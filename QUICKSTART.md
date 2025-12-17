# Quick Start Guide

This guide will help you get the PlayStation Family Application running locally in under 10 minutes.

## Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Go** 1.21+ ([Download](https://golang.org/))
- **Java** 17+ ([Download](https://adoptium.net/))
- **Maven** 3.6+ ([Download](https://maven.apache.org/))
- **Docker** ([Download](https://www.docker.com/))
- **AWS CLI** ([Download](https://aws.amazon.com/cli/))

For mobile development:
- **React Native CLI** (`npm install -g react-native-cli`)
- **iOS**: Xcode 14+ (macOS only)
- **Android**: Android Studio with SDK

## Step 1: Clone Repository

```bash
git clone https://github.com/jonathandavidlewis/playstation-examples.git
cd playstation-examples
```

## Step 2: Start DynamoDB Local

Using Docker Compose:

```bash
docker-compose up -d dynamodb-local
```

Wait a few seconds, then initialize tables:

```bash
./scripts/init-dynamodb-local.sh
```

Verify tables were created:

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1
```

## Step 3: Start Backend Services

### Option A: Using Docker Compose (Recommended)

Start all services at once:

```bash
docker-compose up --build
```

Services will be available at:
- Auth Service: http://localhost:8081
- Accounts Service: http://localhost:8080
- Presence Service: http://localhost:4000

### Option B: Run Services Individually

**Terminal 1 - Presence Service:**
```bash
cd services/presence-service
npm install
npm run dev
```

**Terminal 2 - Accounts Service:**
```bash
cd services/accounts-service
cp .env.example .env
go mod download
go run cmd/api/main.go
```

**Terminal 3 - Auth Service:**
```bash
cd services/auth-service
mvn spring-boot:run
```

## Step 4: Test Backend Services

### Test Auth Service

Register a user:
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

Login:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response for next steps.

### Test Accounts Service

Create account:
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User"
  }'
```

Get account (use ID from previous response):
```bash
curl http://localhost:8080/api/accounts/{account-id}
```

### Test Presence Service

Open GraphiQL in browser:
```
http://localhost:4000/graphql
```

Run a query:
```graphql
mutation {
  updatePresence(
    userId: "user123"
    status: "online"
    isOnline: true
    currentGame: "God of War Ragnarök"
  ) {
    userId
    status
    isOnline
    currentGame
  }
}
```

## Step 5: Start Mobile App

### Install Dependencies

```bash
cd apps/playstation-family-app
npm install
```

### iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### Update API URLs

Edit `src/services/api.ts` and `src/services/apollo.ts` if needed to point to your services:

```typescript
// For iOS simulator
const AUTH_SERVICE_URL = 'http://localhost:8081/api/auth';

// For Android emulator
const AUTH_SERVICE_URL = 'http://10.0.2.2:8081/api/auth';
```

### Run the App

**Start Metro Bundler:**
```bash
npm start
```

**In another terminal, run on iOS:**
```bash
npm run ios
```

**Or run on Android:**
```bash
npm run android
```

## Step 6: Test the Full Flow

1. **Register a New User**
   - Open the app
   - Tap "Register"
   - Enter email, username, and password
   - Tap "Register"

2. **View Profile**
   - After registration, you'll be logged in
   - Navigate to "Profile" tab
   - See your PSN level and trophies

3. **Check Friends**
   - Navigate to "Friends" tab
   - View mock friends list
   - See online/offline status

4. **Update Settings**
   - Navigate to "Settings" tab
   - Explore settings options
   - Logout when done

## Troubleshooting

### DynamoDB Connection Issues

If services can't connect to DynamoDB:

```bash
# Check if DynamoDB Local is running
docker ps | grep dynamodb

# Restart if needed
docker-compose restart dynamodb-local
```

### Port Conflicts

If ports are already in use:

```bash
# Check what's using the port
lsof -i :8080
lsof -i :8081
lsof -i :4000

# Kill the process or change port in service config
```

### React Native Build Issues

**iOS:**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Android:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### JWT Secret Errors

Ensure the JWT secret is at least 256 bits. Update in:
- `services/auth-service/src/main/resources/application.properties`

### Module Not Found Errors

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# For Go
go mod tidy

# For Maven
mvn clean install
```

## Next Steps

- Read the [Architecture Documentation](./ARCHITECTURE.md)
- Explore individual service READMEs:
  - [Auth Service](./services/auth-service/README.md)
  - [Accounts Service](./services/accounts-service/README.md)
  - [Presence Service](./services/presence-service/README.md)
  - [Mobile App](./apps/playstation-family-app/README.md)
- Review Kubernetes deployment in [infrastructure/](./infrastructure/)
- Set up AWS services for production deployment

## Common Development Tasks

### Add a New API Endpoint

**Go (Accounts Service):**
```go
// internal/handlers/handlers.go
func (h *Handler) NewEndpoint(w http.ResponseWriter, r *http.Request) {
    // Implementation
}

// cmd/api/main.go
r.HandleFunc("/api/new-endpoint", h.NewEndpoint).Methods("GET")
```

**Java (Auth Service):**
```java
// controller/AuthController.java
@PostMapping("/new-endpoint")
public ResponseEntity<Object> newEndpoint(@RequestBody Request request) {
    // Implementation
}
```

**Node.js (Presence Service):**
```javascript
// src/index.js
app.get('/new-endpoint', (req, res) => {
    // Implementation
});
```

### Add a New Screen to Mobile App

```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

export const NewScreen = () => {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
};

// src/navigation/MainNavigator.tsx
import { NewScreen } from '../screens/NewScreen';

// Add to TabNavigator or Stack
<Tab.Screen name="New" component={NewScreen} />
```

### Test WebSocket Connection

```javascript
const ws = new WebSocket('ws://localhost:4000');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'authenticate',
    userId: 'user123'
  }));
};

ws.onmessage = (event) => {
  console.log('Message:', JSON.parse(event.data));
};
```

## Production Deployment Checklist

- [ ] Update JWT secret to a strong random value
- [ ] Configure AWS credentials
- [ ] Create DynamoDB tables in AWS
- [ ] Create SNS topics
- [ ] Create S3 buckets
- [ ] Build and push Docker images
- [ ] Deploy to EKS cluster
- [ ] Configure domain names and SSL certificates
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline

## Getting Help

- Check service-specific README files
- Review the [ARCHITECTURE.md](./ARCHITECTURE.md) document
- Open an issue on GitHub
- Review error logs in service output

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Go Documentation](https://golang.org/doc/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [AWS DynamoDB](https://docs.aws.amazon.com/dynamodb/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
