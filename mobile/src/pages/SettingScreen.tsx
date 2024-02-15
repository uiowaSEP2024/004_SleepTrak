import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';

function Setting() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Setting!</Text>
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

export default Setting;
