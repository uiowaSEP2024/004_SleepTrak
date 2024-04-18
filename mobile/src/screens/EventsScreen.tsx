import { ScrollView, View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Card } from 'react-native-paper';
import { colors } from '../../assets/colors';
import { fetchUserData } from '../utils/db';
import { useNavigation } from '@react-navigation/native';
import { TransitionHeader } from '../components/misc/TransitionHeader';

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
    <TransitionHeader
      onBack={handleDateBack}
      onForward={handleDateForward}>
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
    </TransitionHeader>
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
  const eventStartDate = new Date(event.startTime);
  const eventEndDate = new Date(event.endTime);
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate('EventScreen', { event });
  };

  return (
    <Card
      testID={testID}
      style={styles.eventCard}
      onPress={handleCardPress}>
      <Card.Title
        title={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      />
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>
            {new Intl.DateTimeFormat('default', {
              hour: '2-digit',
              minute: '2-digit'
            }).format(eventStartDate)}{' '}
            {event.type === 'sleep' || event.type === 'nap'
              ? ' - ' +
                new Intl.DateTimeFormat('default', {
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(eventEndDate)
              : ' '}
          </Text>
          <Text style={{ color: colors.crimsonRed }}>View More</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const EventList: React.FC<{ events: any[] }> = ({ events }) => {
  return (
    <ScrollView style={styles.eventList}>
      {events.map((event, index) => (
        <EventCard
          key={index}
          testID={'event-' + index}
          event={event}
        />
      ))}
    </ScrollView>
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
      {events.length !== 0 ? (
        <EventList events={events} />
      ) : (
        <Text style={{ alignSelf: 'center', marginTop: '5%', color: 'gray' }}>
          No events today
        </Text>
      )}
    </View>
  );
};
export default EventsScreen;

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: 'white',
    height: '100%'
  },
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
    padding: 0
  },
  eventList: {
    margin: 10,
    height: '100%'
  }
});
