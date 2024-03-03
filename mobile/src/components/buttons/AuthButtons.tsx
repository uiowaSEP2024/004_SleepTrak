import { useState } from 'react';
import { View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Button, Text } from 'react-native-paper';
import { colors } from '../../../../common_styles/colors';

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
      style={{
        borderRadius: 12,
        padding: 12,
        backgroundColor: colors.crimsonRed,
        width: '65%'
      }}
      onPress={() => {
        void onPress();
      }}>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
        Log In
      </Text>
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

/* istanbul ignore next */
export const AuthTestButton = () => {
  const { getCredentials, user } = useAuth0();
  const [apiResponse, setApiResponse] = useState('');
  const isAuthenticated = user !== undefined && user !== null;

  const onCallAPI = async () => {
    const credentials = await getCredentials();

    if (credentials?.accessToken) {
      const accessToken = credentials.accessToken;
      const apiResponse = await fetch(
        process.env.EXPO_PUBLIC_API_URL + '/users/all',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
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
