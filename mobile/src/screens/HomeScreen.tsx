import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { fetchUserData } from '../utils/db';
import { colors } from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';

const UserWelcomeSign: React.FC<{ user: object }> = ({ user }) => {
  return (
    <Text style={styles.welcomeSign}>
      {user
        ? 'Hi ' + (user as { first_name?: string }).first_name + '!'
        : 'Hello!'}
    </Text>
  );
};

const HeroBox: React.FC = () => {
  return (
    <Card style={styles.heroBox}>
      <Card.Title title="Hero Box" />
      <Card.Content>
        <Text>Hero Box Content</Text>
      </Card.Content>
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
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserData();
      setUser(userData);
    };
    void fetchUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.topContainer}>
      <UserWelcomeSign user={user} />
      <HeroBox />
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
