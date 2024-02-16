import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import NavigationButton from '../components/buttons/NavigationButton';

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationButton
        onPress={() => console.log('Pressed')}
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
