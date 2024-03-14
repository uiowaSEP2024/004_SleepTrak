import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { fetchUserData } from '../utils/db';
import { colors } from '../../assets/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const latestEventsFilter = (events: any[], numEvents: number) => {
  const currentDayInMs = new Date().setHours(0, 0, 0, 0);

  const filteredEvents = events.filter((event) => {
    return new Date(event.startTime).getTime() > currentDayInMs;
  });
  const sortedEvents = filteredEvents.sort((a, b) => {
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });
  return sortedEvents.slice(0, numEvents);
};

const EventCard: React.FC<{ event: any }> = ({ event }) => {
  const date = new Date(event.startTime);

  return (
    <Card
      style={{ width: '100%', marginBottom: 8 }}
      mode="contained">
      <Card.Content
        style={{
          flexDirection: 'row',
          height: 'auto',
          justifyContent: 'space-between'
        }}>
        <Text>{event.type}</Text>
        <Text>
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Card.Content>
    </Card>
  );
};

const UserWelcomeSign: React.FC<{ user: object }> = ({ user }) => {
  return (
    <Text style={styles.welcomeSign}>
      {user
        ? 'Hi ' + (user as { first_name?: string }).first_name + '!'
        : 'Hello!'}
    </Text>
  );
};

const HeroBox: React.FC<{ events: any[] }> = ({ events }) => {
  const noEventsSign = (
    <Text
      key="no_events"
      style={{
        color: 'grey',
        alignSelf: 'center',
        marginTop: '10%',
        fontSize: 14
      }}>
      No events today.
    </Text>
  );
  const [shownEvents, setShownEvents] = React.useState<React.ReactNode>([
    noEventsSign
  ]);
  const navigation = useNavigation();
  const today = new Date();

  useEffect(() => {
    let latestEvents: any[] = [];
    if (events.length > 0) {
      latestEvents = latestEventsFilter(events, 2);
      const eventObjects = latestEvents.map((value, index) => (
        <React.Fragment key={'event_' + index}>
          <EventCard event={value} />
        </React.Fragment>
      ));
      setShownEvents(eventObjects ?? noEventsSign);
    }
  }, [events]);

  return (
    <Card
      style={styles.heroBox}
      onPress={() => {
        navigation.navigate('Events');
      }}>
      <Card.Title
        title={today.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        titleStyle={{ fontSize: 16 }}
      />
      <Card.Content style={{ flexDirection: 'column' }}>
        {shownEvents}
      </Card.Content>
      <Card.Actions
        style={{
          justifyContent: 'space-between',
          paddingTop: 16,
          paddingHorizontal: 24,
          position: 'absolute',
          top: 0,
          right: 0
        }}>
        <Text style={{ color: colors.crimsonRed }}>View all</Text>
      </Card.Actions>
    </Card>
  );
};

const NotificationCard: React.FC<{ title: string; content: string }> = ({
  title,
  content
}) => {
  return (
    <Card style={styles.notificationCard}>
      <Card.Title title={title} />
      <Card.Content>
        <Text>{content}</Text>
      </Card.Content>
    </Card>
  );
};

const Notifications: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Notifications</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ flexDirection: 'row', height: '40%' }}>
        <NotificationCard
          title="Notification 1"
          content="This is the first notification"
        />
        <NotificationCard
          title="Notification 2"
          content="This is the second notification"
        />
      </ScrollView>
    </View>
  );
};

const EventButtons: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Add Event</Text>
      <View style={styles.eventButtons}>
        <Card
          style={styles.eventButton}
          onPress={() => {
            navigation.navigate('SleepTimer');
          }}>
          <Card.Content style={styles.eventButtonContent}>
            <Text>Sleep</Text>
          </Card.Content>
        </Card>
        <Card
          style={styles.eventButton}
          onPress={() => {
            navigation.navigate('FoodTrackingScreen');
          }}>
          <Card.Content style={styles.eventButtonContent}>
            <Text>Feeding</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const [user, setUser] = React.useState<{ events: any[] | undefined }>({
    events: undefined
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const userData = await fetchUserData();
        setUser(userData);
      };
      void fetchUser();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.topContainer}>
      <UserWelcomeSign user={user} />
      <HeroBox events={user.events ?? []} />
      <Notifications />
      <EventButtons />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  welcomeSign: {
    fontSize: 36,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: '10%',
    letterSpacing: 0.5,
    color: colors.crimsonRed
  },
  heroBox: {
    width: '95%',
    height: '30%',
    marginBottom: 24
  },
  container: {
    width: '100%',
    height: 'auto',
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  notificationCard: {
    width: '60%',
    backgroundColor: colors.lightTan,
    marginRight: 16
  },
  sectionHeader: {
    fontSize: 24,
    color: colors.crimsonRed,
    marginTop: 20,
    marginBottom: 16
  },
  eventButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '40%'
  },
  eventButton: {
    width: '45%',
    height: '100%'
  },
  eventButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
});

export default HomeScreen;
