import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home!</Text>
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
