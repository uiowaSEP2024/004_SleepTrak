import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../assets/colors';

const EditWindowScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>EditWindowScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightTan
  }
});

export default EditWindowScreen;
