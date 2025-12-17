# PlayStation Family App

React Native mobile application for PlayStation family management.

## Features

- User authentication (login/register)
- Friend management and presence
- Profile with trophies and PSN level
- Real-time presence updates via WebSocket
- GraphQL integration with backend services

## Tech Stack

- **React Native** 0.73
- **gluestack-ui/themed** - UI component library
- **lucide-react-native** - Icon library
- **React Navigation** - Navigation
- **Apollo Client** - GraphQL client
- **AsyncStorage** - Local storage
- **Axios** - HTTP client

## Prerequisites

- Node.js 18+
- React Native CLI
- iOS: Xcode 14+ (macOS only)
- Android: Android Studio

## Setup

```bash
npm install
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

### Android Setup

Ensure Android SDK is properly configured.

## Running

### Start Metro Bundler
```bash
npm start
```

### Run on iOS
```bash
npm run ios
```

### Run on Android
```bash
npm run android
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── services/        # API and WebSocket services
├── contexts/        # React contexts
├── hooks/          # Custom hooks
└── utils/          # Utility functions
```

## Native Modules

### iOS (Swift/Objective-C)

Native modules for device features can be added in `ios/` directory:
- Camera access
- Push notifications
- Biometric authentication
- Device info

### Android (Java/Kotlin)

Native modules for device features can be added in `android/app/src/main/java/`:
- Camera access
- Push notifications
- Biometric authentication
- Device info

## API Configuration

Update the API URLs in `src/services/api.ts` and `src/services/apollo.ts`:

```typescript
const AUTH_SERVICE_URL = 'https://your-auth-service.com/api/auth';
const ACCOUNTS_SERVICE_URL = 'https://your-accounts-service.com/api/accounts';
const GRAPHQL_URL = 'https://your-presence-service.com/graphql';
```

## Building for Production

### iOS

```bash
npm run ios -- --configuration Release
```

### Android

```bash
cd android
./gradlew assembleRelease
```

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```
