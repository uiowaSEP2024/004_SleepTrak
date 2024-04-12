import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Divider } from '../components/misc/Divider';
import { colors } from '../../assets/colors';

const columnNames = {
  startTime: 'Start Time',
  endTime: 'End Time',
  type: 'Type',
  amount: 'Amount',
  foodType: 'Food Type',
  note: 'Note',
  unit: 'Unit',
  medicineType: 'Medicine Type',
  owner: 'Owner',
  cribStartTime: 'Crib Start Time',
  cribStopTime: 'Crib Stop Time'
};

const Item = ({ title, value }: { title: string; value: string }) => {
  return (
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}:</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      <Divider />
    </View>
  );
};

const EventScreen: React.FC = ({ route, navigation }) => {
  const { event } = route.params;
  let startTime: any = null;
  let endTime: any = null;
  if (event) {
    startTime = new Date(event.startTime);
    endTime = new Date(event.endTime);
  }

  return event ? (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {event.type[0].toUpperCase() + event.type.slice(1)}
      </Text>
      {Object.keys(event).map((key) => {
        if (
          event[key] === null ||
          key === 'ownerId' ||
          key === 'eventId' ||
          key === 'type'
        ) {
          return <></>;
        } else if (key === 'startTime') {
          return (
            <Item
              key={key}
              title={columnNames[key]}
              value={startTime.toLocaleString()}
            />
          );
        } else if (key === 'endTime') {
          return (
            <Item
              key={key}
              title={columnNames[key]}
              value={endTime.toLocaleString()}
            />
          );
        } else {
          return (
            <Item
              key={key}
              title={columnNames[key as keyof typeof columnNames]}
              value={event[key]}
            />
          );
        }
      })}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>No event found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '7%',
    paddingHorizontal: '7%',
    backgroundColor: 'white',
    height: '100%'
  },
  title: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 32,
    letterSpacing: 2,
    marginBottom: '10%'
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center'
  },
  itemTitle: {
    fontSize: 20,
    color: colors.crimsonRed
  },
  itemValue: {
    fontSize: 20,
    color: colors.textGray
  },
  editButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '6%',
    backgroundColor: colors.crimsonRed,
    width: '70%',
    height: '7%',
    borderRadius: 32
  },
  editButtonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 2
  }
});

export default EventScreen;
