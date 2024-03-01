import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LoginButton } from '../components/buttons/AuthButtons';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camila Sleep</Text>
      <LoginButton />
    </View>
  );
};

LoginScreen.propTypes = {};

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

export default LoginScreen;
