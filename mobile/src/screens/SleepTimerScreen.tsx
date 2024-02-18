import { View, Text, StyleSheet } from 'react-native';

function SleepTimer() {
  return (
    <View style={styles.container}>
      <Text> Sleep Timer </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default SleepTimer;
