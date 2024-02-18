import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import NavigationButton from '../components/buttons/NavigationButton';

function Home({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationButton
        onPress={() => navigation.navigate('SleepTimer')}
        title="Log Sleep"
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

export default Home;
