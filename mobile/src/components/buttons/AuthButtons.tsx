import { useState } from 'react';
import { View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Button, Text } from 'react-native-paper';

const auth0Audience = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE ?? '';

export const LoginButton = () => {
  const { authorize } = useAuth0();

  const onPress = async () => {
    try {
      await authorize({
        audience: auth0Audience
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button
      onPress={() => {
        void onPress();
      }}>
      {' '}
      Log In{' '}
    </Button>
  );
};

export const LogoutButton = () => {
  const { clearSession } = useAuth0();

  const onPress = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button
      onPress={() => {
        void onPress();
      }}>
      {' '}
      Log Out{' '}
    </Button>
  );
};

export const AuthTestButton = () => {
  const { getCredentials, user } = useAuth0();
  const [apiResponse, setApiResponse] = useState('');
  const isAuthenticated = user !== undefined && user !== null;

  const onCallAPI = async () => {
    const credentials = await getCredentials();

    if (credentials?.accessToken) {
      const accessToken = credentials.accessToken;
      const apiResponse = await fetch('http://localhost:3000/users/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setApiResponse(await apiResponse.text());
    }
  };

  return isAuthenticated ? (
    <View>
      <Button
        onPress={() => {
          void onCallAPI();
        }}>
        Get All Users from API
      </Button>
      <Text> {apiResponse ?? 'No data.'} </Text>
    </View>
  ) : (
    <Text> Please log in to call the API. </Text>
  );
};
