# Auth Service

Authentication microservice for the PlayStation Family Application, built with Spring Boot.

## Features

- User registration and login
- JWT-based authentication
- Refresh token support
- DynamoDB integration for user storage
- SNS integration for authentication events
- Password hashing with BCrypt

## Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- AWS credentials configured

### Build

```bash
mvn clean install
```

## Configuration

Edit `src/main/resources/application.properties` or set environment variables:

```properties
server.port=8081
aws.region=us-east-1
aws.dynamodb.users-table=users-table
aws.sns.topic-arn=arn:aws:sns:us-east-1:123456789012:auth-events
jwt.secret=your-secret-key-at-least-256-bits
jwt.expiration=3600000
jwt.refresh.expiration=604800000
```

## Running

```bash
mvn spring-boot:run
```

Or run the JAR:
```bash
java -jar target/auth-service-1.0.0.jar
```

## API Endpoints

### Health Check
```
GET /api/auth/health
```

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "gamer123",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "uuid",
  "accountId": "uuid"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Validate Token
```
POST /api/auth/validate
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Response:
```json
{
  "valid": true
}
```

## Security

- Passwords are hashed using BCrypt
- JWT tokens use HS256 algorithm
- Tokens expire after 1 hour by default
- Refresh tokens expire after 7 days by default
- Change the JWT secret in production!

## Testing

```bash
mvn test
```
