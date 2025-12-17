# Architecture Documentation

## System Overview

The PlayStation Family Application is built as a microservices architecture with the following components:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Mobile Application                           │
│                   (React Native iOS/Android)                     │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐    │
│  │   Login/    │  │   Friends   │  │  Profile & Settings  │    │
│  │   Register  │  │   & Chat    │  │   Trophies & Games   │    │
│  └─────────────┘  └─────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ REST / GraphQL / WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway / Load Balancer               │
│                              (EKS/K8s)                           │
└─────────────────────────────────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Auth Service    │  │ Accounts Service │  │ Presence Service │
│  (Java/Spring)   │  │   (Golang)       │  │   (Node.js)      │
│                  │  │                  │  │                  │
│  • JWT Auth      │  │  • Profile CRUD  │  │  • WebSocket     │
│  • Register      │  │  • Avatar Mgmt   │  │  • GraphQL       │
│  • Login         │  │  • Friend Mgmt   │  │  • Real-time     │
│  • Token Refresh │  │  • Trophy Data   │  │  • Presence      │
│                  │  │                  │  │                  │
│  Port: 8081      │  │  Port: 8080      │  │  Port: 4000      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  DynamoDB        │  │  DynamoDB        │  │  DynamoDB        │
│  users-table     │  │  accounts-table  │  │  presence-table  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       SNS Topics      │
                    │  • auth-events       │
                    │  • account-events    │
                    │  • presence-updates  │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    S3 Buckets        │
                    │  • avatars           │
                    │  • game-assets       │
                    │  • logs              │
                    └──────────────────────┘
```

## Component Details

### Mobile Application (React Native)

**Technology Stack:**
- React Native 0.73
- TypeScript
- gluestack-ui (UI Framework)
- lucide-react-native (Icons)
- Apollo Client (GraphQL)
- React Navigation

**Key Features:**
- Cross-platform iOS/Android support
- Native module integration (Camera, Biometrics, Push Notifications)
- Offline-first architecture with AsyncStorage
- Real-time updates via WebSocket
- JWT-based authentication

**Communication:**
- REST API calls to Auth & Accounts services
- GraphQL queries/mutations to Presence service
- WebSocket connection for real-time presence updates

### Auth Service (Java/Spring Boot)

**Technology Stack:**
- Java 17
- Spring Boot 3.2
- JWT (jjwt 0.12)
- AWS SDK v2 (DynamoDB, SNS)
- BCrypt for password hashing

**Responsibilities:**
- User registration and authentication
- JWT token generation and validation
- Refresh token management
- Password security
- Event publishing to SNS

**API Endpoints:**
```
POST /api/auth/register    - Create new user account
POST /api/auth/login       - Authenticate user
POST /api/auth/refresh     - Refresh access token
POST /api/auth/validate    - Validate token
GET  /api/auth/health      - Health check
```

**Data Store:**
- DynamoDB table: `users-table`
- GSI on email for lookups

### Accounts Service (Golang)

**Technology Stack:**
- Go 1.21
- Gorilla Mux (HTTP router)
- AWS SDK for Go (DynamoDB, SNS)

**Responsibilities:**
- User profile management
- Trophy and achievement tracking
- Friend list management
- Avatar storage coordination with S3
- PSN level calculations

**API Endpoints:**
```
POST   /api/accounts       - Create account profile
GET    /api/accounts/{id}  - Get account details
PUT    /api/accounts/{id}  - Update account
DELETE /api/accounts/{id}  - Delete account
GET    /api/accounts       - List accounts (paginated)
GET    /health             - Health check
```

**Data Store:**
- DynamoDB table: `accounts-table`
- GSI on username for lookups

### Presence Service (Node.js)

**Technology Stack:**
- Node.js 18+
- Express.js
- GraphQL (express-graphql)
- WebSocket (ws)
- AWS SDK (DynamoDB, SNS)

**Responsibilities:**
- Real-time presence tracking
- Online/offline status
- Current game tracking
- Friend activity notifications
- WebSocket connection management

**APIs:**
1. **GraphQL API** (`/graphql`)
```graphql
# Queries
query {
  presence(userId: "123") { status, isOnline, currentGame }
  presences { userId, status }
}

# Mutations
mutation {
  updatePresence(userId: "123", status: "online", currentGame: "God of War")
}
```

2. **WebSocket API** (`ws://`)
```json
// Messages
{ "type": "authenticate", "userId": "123" }
{ "type": "subscribe", "userIds": ["456", "789"] }
{ "type": "presence_update", "userId": "456", "presence": {...} }
```

**Data Store:**
- DynamoDB table: `presence-table`
- TTL enabled for auto-cleanup

## Infrastructure

### AWS Services

**DynamoDB Tables:**
1. `users-table` - Authentication credentials
   - Primary Key: id (String)
   - GSI: email
   - Attributes: email, username, passwordHash, accountId, enabled, locked

2. `accounts-table` - User profiles
   - Primary Key: id (String)
   - GSI: username
   - Attributes: email, displayName, avatarUrl, psnLevel, trophies, friends

3. `presence-table` - Real-time presence
   - Primary Key: userId (String)
   - Attributes: status, isOnline, currentGame, lastSeen
   - TTL enabled on ttl attribute

**SNS Topics:**
1. `auth-events` - Authentication events (login, register, logout)
2. `account-events` - Account changes (profile updates, deletions)
3. `presence-updates` - Presence changes (online/offline, game changes)

**S3 Buckets:**
1. `playstation-avatars-{env}` - User profile pictures
2. `playstation-game-assets-{env}` - Game thumbnails and icons
3. `playstation-logs-{env}` - Centralized application logs

**EKS (Kubernetes):**
- 3 deployments (auth, accounts, presence)
- LoadBalancer services for external access
- ConfigMaps for configuration
- Secrets for sensitive data
- Horizontal Pod Autoscaling
- Health checks and readiness probes

### Deployment Strategy

1. **Container Build:**
   ```bash
   docker build -t auth-service:latest services/auth-service
   docker build -t accounts-service:latest services/accounts-service
   docker build -t presence-service:latest services/presence-service
   ```

2. **Push to Registry:**
   ```bash
   docker tag auth-service:latest <registry>/auth-service:latest
   docker push <registry>/auth-service:latest
   # Repeat for other services
   ```

3. **Deploy to EKS:**
   ```bash
   kubectl apply -f infrastructure/kubernetes/
   ```

## Data Flow

### User Registration Flow
```
1. Mobile App → POST /api/auth/register → Auth Service
2. Auth Service → Hash password with BCrypt
3. Auth Service → Create user in DynamoDB (users-table)
4. Auth Service → Publish to SNS (auth-events)
5. Auth Service → Generate JWT tokens
6. Auth Service → Return tokens to Mobile App
7. Mobile App → Store tokens in AsyncStorage
8. Mobile App → POST /api/accounts → Accounts Service
9. Accounts Service → Create profile in DynamoDB (accounts-table)
```

### Login Flow
```
1. Mobile App → POST /api/auth/login → Auth Service
2. Auth Service → Lookup user by email in DynamoDB
3. Auth Service → Verify password with BCrypt
4. Auth Service → Generate JWT tokens
5. Auth Service → Update lastLoginAt
6. Auth Service → Publish to SNS (auth-events)
7. Auth Service → Return tokens
8. Mobile App → Store tokens
9. Mobile App → Connect WebSocket to Presence Service
10. Presence Service → Authenticate WebSocket connection
11. Mobile App → Subscribe to friend presence updates
```

### Presence Update Flow
```
1. User starts playing game
2. Mobile App → GraphQL mutation to Presence Service
3. Presence Service → Update DynamoDB (presence-table)
4. Presence Service → Publish to SNS (presence-updates)
5. Presence Service → Broadcast via WebSocket to subscribed friends
6. Friend's Mobile App → Receive WebSocket notification
7. Friend's Mobile App → Update UI with friend's activity
```

## Security Considerations

1. **Authentication:**
   - JWT tokens with HS256 algorithm
   - 1-hour access token expiration
   - 7-day refresh token expiration
   - Password hashing with BCrypt (cost factor 10)

2. **Authorization:**
   - JWT validation on all protected endpoints
   - User can only access their own resources
   - Service-to-service auth via AWS IAM roles

3. **Data Protection:**
   - DynamoDB encryption at rest
   - S3 encryption for avatars and logs
   - HTTPS/TLS for all API communication
   - WSS (WebSocket Secure) for real-time connections

4. **Network Security:**
   - VPC isolation for EKS cluster
   - Security groups limiting service access
   - NAT gateway for outbound internet access
   - Private subnets for database access

## Scalability

1. **Horizontal Scaling:**
   - Kubernetes HPA based on CPU/memory
   - Auto-scaling for all services
   - Stateless service design

2. **Database Scaling:**
   - DynamoDB on-demand capacity mode
   - Automatic scaling based on traffic
   - Global Secondary Indexes for query optimization

3. **Caching Strategy:**
   - Mobile app caches profile data
   - Service-level caching for frequent queries
   - CDN for static assets (S3)

4. **Load Balancing:**
   - Kubernetes LoadBalancer services
   - AWS Application Load Balancer
   - Round-robin distribution

## Monitoring & Observability

1. **Logging:**
   - Structured JSON logs
   - CloudWatch Logs integration
   - Centralized logging to S3

2. **Metrics:**
   - CloudWatch metrics
   - Custom application metrics
   - DynamoDB metrics

3. **Tracing:**
   - Request ID propagation
   - Service-to-service tracing
   - Error tracking

4. **Alerting:**
   - SNS notifications for critical events
   - CloudWatch alarms for service health
   - Slack/PagerDuty integration (optional)

## Development Workflow

1. **Local Development:**
   ```bash
   # Start DynamoDB Local
   docker-compose up dynamodb-local
   
   # Initialize tables
   ./scripts/init-dynamodb-local.sh
   
   # Start services individually
   cd services/presence-service && npm run dev
   cd services/accounts-service && go run cmd/api/main.go
   cd services/auth-service && mvn spring-boot:run
   
   # Start mobile app
   cd apps/playstation-family-app && npm start
   ```

2. **Testing:**
   - Unit tests for business logic
   - Integration tests with DynamoDB Local
   - E2E tests for critical flows

3. **CI/CD:**
   - GitHub Actions for automated builds
   - Docker image building and pushing
   - Kubernetes deployment automation
   - Automated testing pipeline

## Future Enhancements

1. **Features:**
   - Voice chat integration
   - Game recommendations
   - Trophy comparison
   - Leaderboards
   - In-app messaging

2. **Technical:**
   - Redis for caching
   - ElastiCache for session management
   - API Gateway for rate limiting
   - GraphQL Federation
   - Event sourcing for audit trails

3. **Infrastructure:**
   - Multi-region deployment
   - Disaster recovery
   - Blue-green deployments
   - Canary releases
