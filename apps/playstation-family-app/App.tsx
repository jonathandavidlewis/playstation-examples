import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/services/apollo';
import { MainNavigator } from './src/navigation/MainNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

function App(): JSX.Element {
  return (
    <ApolloProvider client={apolloClient}>
      <GluestackUIProvider config={config}>
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </AuthProvider>
      </GluestackUIProvider>
    </ApolloProvider>
  );
}

export default App;
