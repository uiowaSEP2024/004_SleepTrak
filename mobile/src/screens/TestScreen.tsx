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
        onPress={() => navigation.navigate('FoodTrackingScreen')}
        title="Log food"
      />
      <NavigationButton
        onPress={() => navigation.navigate('MedicineTrackingScreen')}
        title="Log medicine"
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
      <NavigationButton
        onPress={() => navigation.navigate('ManualSleepTracking')}
        title="Manual Sleep Track"
      />
      <NavigationButton
        onPress={() => navigation.navigate('StatisticsScreen')}
        title="Statistics Screen"
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
