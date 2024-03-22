import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Card, IconButton } from 'react-native-paper';
import { colors } from '../../assets/colors';
import { fetchUserData } from '../utils/db';
import { useNavigation } from '@react-navigation/native';

const ArrowButton: React.FC<{
  direction: string;
  onPress: any;
  testID: string;
}> = ({ direction, onPress, testID }) => {
  return (
    <IconButton
      testID={testID}
      icon={`arrow-${direction}`}
      iconColor={'white'}
      size={24}
      onPress={onPress}
    />
  );
};

const DateHeader: React.FC<{ date: Date; setDate: any }> = ({
  date,
  setDate
}) => {
  const handleDateBack = () => {
    date.setDate(date.getDate() - 1);
    setDate(new Date(date));
  };

  const handleDateForward = () => {
    date.setDate(date.getDate() + 1);
    setDate(new Date(date));
  };

  return (
    <View style={styles.headerContainer}>
      <ArrowButton
        testID="date-back-button"
        direction="left"
        onPress={handleDateBack}
      />
      <Text
        testID="date-header"
        style={styles.dateHeader}>
        {date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      <ArrowButton
        testID="date-forward-button"
        direction="right"
        onPress={handleDateForward}
      />
    </View>
  );
};

const eventsFilter = (events: any[], date: Date) => {
  const startOfDayInMs = date.setHours(0, 0, 0, 0);
  const endOfDayInMs = date.setHours(23, 59, 59, 999);

  const filteredEvents = events.filter((event) => {
    const eventTime = new Date(event.startTime).getTime();
    return eventTime >= startOfDayInMs && eventTime <= endOfDayInMs;
  });
  const sortedEvents = filteredEvents.sort((a, b) => {
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });
  return sortedEvents;
};

const EventCard: React.FC<{ event: any; testID: string | undefined }> = ({
  event,
  testID
}) => {
  const eventDate = new Date(event.startTime);
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate('EventScreen', { event });
  };

  return (
    <Card
      testID={testID}
      style={styles.eventCard}
      onPress={handleCardPress}>
      <Card.Title title={event.type} />
      <Card.Content>
        <Text>{eventDate.toLocaleTimeString()}</Text>
      </Card.Content>
      <Card.Actions>
        <Text style={{ color: colors.crimsonRed }}>View More</Text>
      </Card.Actions>
    </Card>
  );
};

const EventList: React.FC<{ events: any[] }> = ({ events }) => {
  return (
    <View style={styles.eventList}>
      {events.map((event, index) => (
        <EventCard
          key={index}
          testID={'event-' + index}
          event={event}
        />
      ))}
    </View>
  );
};

const EventsScreen: React.FC<{ date?: Date }> = ({ date }) => {
  const [currentDate, setDate] = React.useState(date ?? new Date());
  const [events, setEvents] = React.useState<any[]>([]);

  const fetchEvents = async () => {
    const user = await fetchUserData();
    setEvents(eventsFilter(user.events, currentDate));
  };

  useEffect(() => {
    void fetchEvents();
  }, [currentDate]);

  return (
    <View>
      <DateHeader
        date={currentDate}
        setDate={setDate}
      />
      <EventList events={events} />
    </View>
  );
};
export default EventsScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.crimsonRed
  },
  dateHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  eventCard: {
    margin: 10,
    padding: 10
  },
  eventList: {
    margin: 10
  }
});
