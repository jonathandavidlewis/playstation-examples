# PlayStation Examples

A full-stack monorepo demonstrating a PlayStation Family Application with microservices architecture.

## Architecture Overview

This project showcases a modern microservices architecture with:

- **Mobile Application**: React Native app with native iOS/Android support
- **Microservices**: Golang, Java (Spring Boot), and Node.js services
- **Infrastructure**: AWS (DynamoDB, EKS, S3, SNS)
- **APIs**: REST and GraphQL with WebSocket support

## Repository Structure

```
playstation-examples/
├── apps/
│   └── playstation-family-app/          # React Native mobile app
│       ├── src/
│       │   ├── components/              # Reusable UI components
│       │   ├── screens/                 # App screens
│       │   ├── navigation/              # Navigation config
│       │   ├── services/                # API clients
│       │   ├── contexts/                # React contexts
│       │   └── hooks/                   # Custom hooks
│       ├── ios/                         # iOS native code (Swift/Objective-C)
│       └── android/                     # Android native code (Java/Kotlin)
│
├── services/
│   ├── accounts-service/                # Golang REST API
│   │   ├── cmd/api/                     # Application entry point
│   │   └── internal/                    # Internal packages
│   │       ├── handlers/                # HTTP handlers
│   │       ├── models/                  # Data models
│   │       ├── repository/              # DynamoDB repository
│   │       └── config/                  # Configuration
│   │
│   ├── auth-service/                    # Java Spring Boot
│   │   └── src/main/java/com/playstation/auth/
│   │       ├── controller/              # REST controllers
│   │       ├── service/                 # Business logic
│   │       ├── model/                   # Domain models
│   │       ├── repository/              # DynamoDB repository
│   │       ├── security/                # JWT & security
│   │       └── config/                  # AWS configuration
│   │
│   └── presence-service/                # Node.js + WebSockets
│       └── src/
│           ├── graphql/                 # GraphQL schema & resolvers
│           ├── websocket/               # WebSocket server
│           └── config/                  # Configuration
│
└── infrastructure/
    ├── kubernetes/                      # EKS deployment configs
    ├── dynamodb/                        # DynamoDB table definitions
    └── s3/                              # S3 bucket configurations
```

## Services

### 1. Playstation Family App (React Native)

Mobile application for iOS and Android.

**Features:**
- User authentication
- Friends list with presence
- Profile management with trophies
- Real-time updates via WebSocket

**Tech Stack:**
- React Native 0.73
- gluestack-ui/themed for UI components
- lucide-react-native for icons
- Apollo Client for GraphQL
- React Navigation

[📖 Read more →](./apps/playstation-family-app/README.md)

### 2. Accounts Service (Golang)

REST API for managing user accounts.

**Endpoints:**
- `POST /api/accounts` - Create account
- `GET /api/accounts/{id}` - Get account
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account
- `GET /api/accounts` - List accounts

**Tech Stack:**
- Go 1.21
- Gorilla Mux
- AWS SDK for DynamoDB & SNS

[📖 Read more →](./services/accounts-service/README.md)

### 3. Auth Service (Java/Spring Boot)

JWT-based authentication service.

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/validate` - Validate token

**Tech Stack:**
- Java 17
- Spring Boot 3.2
- JWT (jjwt)
- AWS SDK for DynamoDB & SNS

[📖 Read more →](./services/auth-service/README.md)

### 4. Presence Service (Node.js)

Real-time presence tracking with GraphQL and WebSocket.

**Features:**
- GraphQL API for presence queries/mutations
- WebSocket server for real-time updates
- Subscription support for presence changes

**Tech Stack:**
- Node.js
- Express
- GraphQL (express-graphql)
- WebSocket (ws)
- AWS SDK for DynamoDB & SNS

[📖 Read more →](./services/presence-service/README.md)

## AWS Infrastructure

### DynamoDB Tables

- **users-table** - Authentication data
- **accounts-table** - User profile information
- **presence-table** - Real-time presence data

### SNS Topics

- **auth-events** - Authentication events
- **account-events** - Account change notifications
- **presence-updates** - Presence change notifications

### S3 Buckets

- **avatars** - User profile pictures
- **game-assets** - Game thumbnails and media
- **logs** - Centralized application logs

### EKS (Kubernetes)

All microservices are containerized and deployed on Amazon EKS:
- Horizontal pod autoscaling
- Health checks and readiness probes
- ConfigMaps and Secrets management
- Load balancers for external access

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- Java 17+
- Docker & Kubernetes (for deployment)
- AWS CLI configured
- React Native development environment

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonathandavidlewis/playstation-examples.git
   cd playstation-examples
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start individual services**

   **Presence Service:**
   ```bash
   cd services/presence-service
   npm install
   npm run dev
   ```

   **Accounts Service:**
   ```bash
   cd services/accounts-service
   go mod download
   go run cmd/api/main.go
   ```

   **Auth Service:**
   ```bash
   cd services/auth-service
   mvn spring-boot:run
   ```

   **Mobile App:**
   ```bash
   cd apps/playstation-family-app
   npm install
   npm start
   # In another terminal:
   npm run ios    # or npm run android
   ```

### Deployment

#### DynamoDB Tables
```bash
aws cloudformation create-stack \
  --stack-name playstation-dynamodb \
  --template-body file://infrastructure/dynamodb/tables.yaml
```

#### SNS Topics
```bash
aws cloudformation create-stack \
  --stack-name playstation-sns \
  --template-body file://infrastructure/dynamodb/sns-topics.yaml
```

#### Kubernetes/EKS
```bash
kubectl apply -f infrastructure/kubernetes/configmap.yaml
kubectl apply -f infrastructure/kubernetes/auth-service-deployment.yaml
kubectl apply -f infrastructure/kubernetes/accounts-service-deployment.yaml
kubectl apply -f infrastructure/kubernetes/presence-service-deployment.yaml
```

## API Documentation

### REST APIs

- **Auth Service**: `http://localhost:8081/api/auth`
- **Accounts Service**: `http://localhost:8080/api/accounts`

### GraphQL

- **Presence Service**: `http://localhost:4000/graphql`
- GraphiQL available in development mode

### WebSocket

- **Presence Service**: `ws://localhost:4000`

## Technology Stack

### Frontend
- React Native
- TypeScript
- gluestack-ui
- Apollo Client
- React Navigation

### Backend
- **Golang** (Accounts Service)
- **Java/Spring Boot** (Auth Service)
- **Node.js** (Presence Service)

### Infrastructure
- **AWS**: DynamoDB, EKS, S3, SNS
- **Kubernetes**: Container orchestration
- **Docker**: Containerization

### Communication
- REST APIs
- GraphQL
- WebSocket

## Contributing

This is an example project for demonstration purposes. Feel free to use it as a reference for your own projects.

## License

ISC