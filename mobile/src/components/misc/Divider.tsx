import { View, StyleSheet } from 'react-native';

export const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 8,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  }
});
