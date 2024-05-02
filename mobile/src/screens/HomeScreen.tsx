import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { fetchUserData } from '../utils/db';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../assets/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { generateNotifications } from '../utils/notifications';

const latestEventsFilter = (events: any[], numEvents: number) => {
  const currentDayInMs = new Date().setHours(0, 0, 0, 0);
  const endOfDayInMs = new Date().setHours(23, 59, 59, 999);

  const filteredEvents = events.filter((event) => {
    const eventTime = new Date(event.startTime).getTime();
    return endOfDayInMs > eventTime && eventTime > currentDayInMs;
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
        <Text>{event.type[0].toUpperCase() + event.type.slice(1)}</Text>
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
        ? 'Hi, ' + (user as { first_name?: string }).first_name + '!'
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
      mode="contained"
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

const NotificationCard: React.FC<{ title: string; content: any }> = ({
  title,
  content
}) => {
  return (
    <Card
      mode="contained"
      style={styles.notificationCard}>
      <Card.Content
        style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Text style={{ fontSize: 16, letterSpacing: 2 }}>
          {' '}
          {title} scheduled for{' '}
          {content.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          .
        </Text>
      </Card.Content>
    </Card>
  );
};

const Notifications: React.FC<{ user: any }> = (user) => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const noNotificationsNotice = (
    <View style={{ height: 40 }}>
      <Text style={{ color: 'grey', alignSelf: 'center' }}>
        No plan notifications.
      </Text>
    </View>
  );
  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications(await generateNotifications(user));
    };
    void fetchNotifications();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>Next Up</Text>
        <Text
          style={{
            marginRight: 16,
            marginBottom: 16,
            fontSize: 14,
            color: colors.crimsonRed
          }}
          onPress={() => {
            navigation.navigate('SleepPlan');
          }}>
          View Plan
        </Text>
      </View>
      {notifications.length > 0 ? (
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            flexDirection: 'row',
            height: '100%',
            width: '100%'
          }}>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              title={notification.title}
              content={notification.time}
            />
          ))}
        </ScrollView>
      ) : (
        noNotificationsNotice
      )}
    </View>
  );
};

const EventButtonCard: React.FC<{
  title: string;
  icon: string;
  onPress: () => void;
}> = ({ title, icon, onPress }) => {
  return (
    <Card
      style={styles.eventButton}
      mode="contained"
      onPress={onPress}>
      <Card.Content style={styles.eventButtonContent}>
        <Text style={{ fontSize: 24, color: colors.textGray, marginBottom: 8 }}>
          {title}
        </Text>
        <MaterialCommunityIcons
          name={icon}
          size={40}
          color={colors.textGray}
        />
      </Card.Content>
    </Card>
  );
};

const EventButtons: React.FC<{
  user: object;
}> = (user) => {
  const navigation = useNavigation();
  const baby =
    user !== undefined ? (user as { babies?: any[] })?.babies?.[0] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Add Event</Text>
      <View style={styles.eventButtons}>
        <EventButtonCard
          title="Sleep"
          icon="power-sleep"
          onPress={() => {
            navigation.navigate('SleepTimer');
          }}></EventButtonCard>
        <EventButtonCard
          title="Feeding"
          icon="baby-bottle"
          onPress={() => {
            navigation.navigate('FoodTrackingScreen');
          }}></EventButtonCard>
      </View>
      <View style={styles.eventButtons}>
        <EventButtonCard
          title="Medicine"
          icon="medical-bag"
          onPress={() => {
            navigation.navigate('MedicineTrackingScreen');
          }}></EventButtonCard>
        {baby && (
          <EventButtonCard
            title="Files"
            icon="file-document"
            onPress={() => {
              navigation.navigate('FilesScreen', { babyId: baby.babyId });
            }}></EventButtonCard>
        )}
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
    <ScrollView
      style={{ backgroundColor: 'white' }}
      contentInset={{ top: 0, bottom: 250, left: 0, right: 0 }}
      contentContainerStyle={styles.topContainer}>
      <UserWelcomeSign user={user} />
      <HeroBox events={user.events ?? []} />
      <Notifications user={user} />
      <EventButtons user={user} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: '7%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  welcomeSign: {
    fontSize: 32,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: '5%',
    letterSpacing: 0.5,
    paddingLeft: 14,
    color: colors.crimsonRed
  },
  heroBox: {
    width: '100%',
    height: '30%',
    marginBottom: 12,
    borderRadius: 48,
    padding: 16,
    backgroundColor: colors.lightPurple
  },
  container: {
    width: '100%',
    marginBottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  notificationCard: {
    width: '100%',
    backgroundColor: colors.lightTan,
    marginRight: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 48
  },
  sectionHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  sectionHeader: {
    fontSize: 20,
    color: colors.crimsonRed,
    marginTop: 20,
    marginBottom: 16,
    paddingLeft: 14
  },
  eventButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    height: '30%',
    paddingHorizontal: 16
  },
  eventButton: {
    width: '48%',
    height: '90%',
    borderRadius: 0,
    backgroundColor: colors.lightTan,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  eventButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
});

export default HomeScreen;
