import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigations/MainNavigator';
import { Auth0Provider } from 'react-native-auth0';
import { initializeDatabase } from './src/utils/localDb';

const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? '';
const auth0ClientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? '';

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);
  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </Auth0Provider>
  );
}
