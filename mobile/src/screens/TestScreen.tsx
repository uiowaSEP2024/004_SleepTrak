import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import NavigationButton from '../components/buttons/NavigationButton';

function TestScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationButton
        onPress={() => navigation.navigate('SleepTimer')}
        title="Log Sleep"
      />
      <NavigationButton
        onPress={() => navigation.navigate('Login')}
        title="Login test"
      />
      <NavigationButton
        onPress={() => navigation.navigate('Welcome')}
        title="Welcome Screen"
      />
      <NavigationButton
        onPress={() => navigation.navigate('Home')}
        title="Home screen"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default TestScreen;
