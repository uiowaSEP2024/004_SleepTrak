import React, { useEffect, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Auth0Provider } from 'react-native-auth0';
import { initializeDatabase } from './src/utils/localDb';
import { SafeAreaView } from 'react-native';
import { colors } from './assets/colors';
import MainStack from './src/navigations/MainStack';

const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? '';
const auth0ClientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? '';

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);
  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.crimsonRed }}>
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </Auth0Provider>
      </SafeAreaView>
    </Fragment>
  );
}
