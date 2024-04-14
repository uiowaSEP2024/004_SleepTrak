import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchEvents } from '../utils/db';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StatisticStackParamList } from '../navigations/StatisticStack';
import type { RemoteEvent } from '../utils/interfaces';
import { colors } from '../../assets/colors';

const StatisticsScreen: React.FC = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<StatisticStackParamList, 'StatisticsScreen'>
    >();
  const [events, setEvents] = useState<RemoteEvent[] | null>(null);

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchAndSetEvents();
  }, []);

  // filter events into their types
  const nightSleepEvents =
    events?.filter((event) => event.type === 'night_sleep') ?? [];
  const napEvents = events?.filter((event) => event.type === 'nap') ?? [];
  const feedEvents = events?.filter((event) => event.type === 'feed') ?? [];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navigationButton}
          onPress={() => {
            navigation.navigate('StatisticScreen', {
              eventType: 'night_sleep',
              events: nightSleepEvents
            });
          }}>
          <Text>Night Sleep</Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => {
          navigation.navigate('StatisticScreen', {
            eventType: 'nap',
            events: napEvents
          });
        }}>
        <Text>Nap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => {
          navigation.navigate('StatisticScreen', {
            eventType: 'feed',
            events: feedEvents
          });
        }}>
        <Text>Feed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50
  },
  navigationButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.softLavender,
    padding: 10,
    margin: 10,
    borderRadius: 48,
    width: '80%',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 4
  }
});

export default StatisticsScreen;
