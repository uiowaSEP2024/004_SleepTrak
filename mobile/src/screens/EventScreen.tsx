import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const EventScreen: React.FC = ({ route, navigation }) => {
  const { event } = route.params;
  return event ? (
    <View style={styles.container}>
      <Text style={styles.title}>{event.type}</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>No event found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontWeight: 'bold',
    color: 'black'
  }
});

export default EventScreen;
