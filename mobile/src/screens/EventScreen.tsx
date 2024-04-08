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
    paddingTop: 8,
    alignContent: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    height: '100%'
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center'
  }
});

export default EventScreen;
