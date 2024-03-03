import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import {
  LoginButton,
  AuthTestButton,
  LogoutButton
} from '../components/buttons/AuthButtons';
import { useAuth0 } from 'react-native-auth0';

const AuthScreen: React.FC = () => {
  const { user } = useAuth0();
  const isAuthenticated = user !== undefined && user !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camila Sleep</Text>
      {isAuthenticated ? (
        <Text>
          {' '}
          You are {user.email} with {user.sub}{' '}
        </Text>
      ) : (
        <Text>You are not logged in.</Text>
      )}
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      <AuthTestButton />
    </View>
  );
};

AuthScreen.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around',
    margin: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  },
  title: {
    fontWeight: 'bold',
    flex: 1
  }
});

export default AuthScreen;
