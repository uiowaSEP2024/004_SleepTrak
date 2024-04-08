import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../../assets/colors';
import { LogoutButton } from '../components/buttons/AuthButtons';

function Setting() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <LogoutButton style={styles.logoutButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: '7%',
    paddingVertical: '2%'
  },
  title: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 32,
    letterSpacing: 2
  },
  logoutButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '6%',
    backgroundColor: colors.crimsonRed,
    width: '70%',
    height: '7%',
    fontSize: 20,
    color: 'white',
    borderRadius: 32
  }
});

export default Setting;
