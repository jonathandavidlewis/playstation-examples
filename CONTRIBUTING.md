# Contributing Guide

Thank you for your interest in contributing to the PlayStation Examples project! This document provides guidelines and information for contributors.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/playstation-examples.git
   cd playstation-examples
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the coding standards below
   - Write tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Run service-specific tests
   cd services/auth-service && mvn test
   cd services/accounts-service && go test ./...
   cd services/presence-service && npm test
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes

## Coding Standards

### General Guidelines

- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle
- Write meaningful commit messages

### React Native / TypeScript

```typescript
// Use functional components
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
};

// Use TypeScript types
interface Props {
  name: string;
  age: number;
}

// Use hooks appropriately
const [state, setState] = useState<string>('');

// Style with StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

**Standards:**
- Use functional components with hooks
- Define TypeScript interfaces for props
- Use ESLint and Prettier
- Follow React Native best practices
- Use StyleSheet for styles (no inline styles)

### Go (Accounts Service)

```go
// Package documentation
package handlers

// Function documentation
// CreateAccount handles account creation
func (h *Handler) CreateAccount(w http.ResponseWriter, r *http.Request) {
    // Implementation
}

// Use error handling
if err != nil {
    return fmt.Errorf("failed to create account: %w", err)
}
```

**Standards:**
- Follow official Go style guide
- Use `gofmt` for formatting
- Write package and function documentation
- Handle errors explicitly
- Use meaningful variable names

### Java (Auth Service)

```java
/**
 * Service for handling user authentication
 */
@Service
public class AuthService {
    
    private final UserRepository userRepository;
    
    /**
     * Authenticate user with credentials
     * @param request authentication request
     * @return authentication response with tokens
     */
    public AuthResponse login(AuthRequest request) {
        // Implementation
    }
}
```

**Standards:**
- Follow Spring Boot conventions
- Use constructor injection
- Write Javadoc comments
- Use Lombok for boilerplate reduction
- Follow Java naming conventions

### Node.js (Presence Service)

```javascript
/**
 * Initialize WebSocket server
 * @param {http.Server} server - HTTP server instance
 * @returns {WebSocket.Server} WebSocket server
 */
function initWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  // Implementation
  return wss;
}

// Use async/await
async function fetchData() {
  try {
    const data = await dynamodb.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
```

**Standards:**
- Use JSDoc comments
- Prefer async/await over callbacks
- Use const/let (never var)
- Handle promises properly
- Follow Node.js best practices

## Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality

Implement password reset via email with token verification.
Tokens expire after 1 hour.

Closes #123
```

```
fix(presence): resolve WebSocket connection leak

Fixed memory leak caused by not properly closing WebSocket
connections when clients disconnect.
```

## Testing Guidelines

### Unit Tests

Write unit tests for:
- Business logic functions
- Data transformations
- Utility functions
- Service methods

### Integration Tests

Write integration tests for:
- API endpoints
- Database operations
- External service interactions

### Example Test Structures

**React Native (Jest):**
```typescript
describe('AuthContext', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

**Go:**
```go
func TestCreateAccount(t *testing.T) {
    repo := NewMockRepository()
    handler := NewHandler(repo)
    
    req := httptest.NewRequest("POST", "/api/accounts", body)
    w := httptest.NewRecorder()
    
    handler.CreateAccount(w, req)
    
    assert.Equal(t, http.StatusCreated, w.Code)
}
```

**Java (JUnit):**
```java
@Test
public void testLogin_Success() {
    AuthRequest request = new AuthRequest("test@example.com", "password");
    when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
    
    AuthResponse response = authService.login(request);
    
    assertNotNull(response.getToken());
    assertEquals("user123", response.getUserId());
}
```

**Node.js (Jest):**
```javascript
describe('Presence Service', () => {
  test('should update presence', async () => {
    const result = await updatePresence('user123', {
      status: 'online',
      currentGame: 'God of War'
    });
    
    expect(result.status).toBe('online');
  });
});
```

## Documentation

### Code Documentation

- Write clear function/method documentation
- Document complex algorithms
- Add inline comments for non-obvious code
- Keep documentation up to date

### README Updates

When adding features:
- Update relevant README.md files
- Add usage examples
- Document configuration options
- Update API documentation

### Architecture Documentation

For significant changes:
- Update ARCHITECTURE.md
- Add diagrams if helpful
- Document design decisions

## Pull Request Guidelines

### PR Title

Use clear, descriptive titles:
- ✅ "feat: Add password reset functionality"
- ✅ "fix: Resolve WebSocket memory leak"
- ❌ "Update code"
- ❌ "Fixes"

### PR Description

Include:
1. **What**: What changes were made
2. **Why**: Why these changes are needed
3. **How**: How the changes were implemented
4. **Testing**: How to test the changes
5. **Screenshots**: For UI changes

**Template:**
```markdown
## Description
Brief description of changes

## Motivation
Why this change is needed

## Changes
- Change 1
- Change 2
- Change 3

## Testing
Steps to test:
1. Step 1
2. Step 2

## Screenshots
(if applicable)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows coding standards
```

### Review Process

- All PRs require at least one approval
- Address review comments promptly
- Be open to feedback
- Update PR based on feedback

## Project Structure

When adding new features, follow existing structure:

```
apps/
  playstation-family-app/
    src/
      components/    # Reusable UI components
      screens/       # Screen components
      services/      # API clients
      contexts/      # React contexts
      hooks/         # Custom hooks
      utils/         # Utility functions

services/
  {service-name}/
    cmd/           # Application entry (Go)
    internal/      # Internal packages (Go)
    src/           # Source code (Java/Node)
      main/        # Main source (Java)
      test/        # Tests (Java)

infrastructure/
  kubernetes/      # K8s manifests
  dynamodb/        # DynamoDB configs
  s3/             # S3 configs
```

## Issue Reporting

When reporting issues:

1. **Check existing issues** first
2. **Use issue templates** if available
3. **Provide details:**
   - Description of the issue
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots/logs if applicable

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Thank You!

Your contributions help make this project better for everyone. Thank you for taking the time to contribute! 🎮🎉
