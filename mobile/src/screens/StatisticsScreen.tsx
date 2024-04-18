import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransitionHeader } from '../components/misc/TransitionHeader';
import { fetchEvents } from '../utils/db';
import type { RemoteEvent } from '../utils/interfaces';
import StatisticScreen from './StatisticScreen';

type StatisticHeaderProps = {
  events: RemoteEvent[] | null;
  setFilteredEvents: (events: RemoteEvent[]) => void;
};

const StatisticsHeader: React.FC<StatisticHeaderProps> = ({
  events,
  setFilteredEvents
}) => {
  const statsTitle = [
    'Night Sleep Statistics',
    'Nap Statistics',
    'Feed Statistics'
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const nightSleepEvents =
    events?.filter((event) => event.type === 'night_sleep') ?? [];
  const napEvents = events?.filter((event) => event.type === 'nap') ?? [];
  const feedEvents = events?.filter((event) => event.type === 'feed') ?? [];
  const [currentEvents, setCurrentEvents] = useState(nightSleepEvents);

  useEffect(() => {
    switch (currentIndex) {
      case 0:
        setCurrentEvents(nightSleepEvents);
        break;
      case 1:
        setCurrentEvents(napEvents);
        break;
      case 2:
        setCurrentEvents(feedEvents);
        break;
      default:
        setCurrentEvents(nightSleepEvents);
    }
  }, [currentIndex]);

  useEffect(() => {
    setFilteredEvents(currentEvents);
  }, [currentEvents]);

  const handleDateBack = () => {
    setCurrentIndex((currentIndex - 1 + statsTitle.length) % statsTitle.length);
  };
  const handleDateForward = () => {
    setCurrentIndex((currentIndex + 1) % statsTitle.length);
  };

  return (
    <TransitionHeader
      onBack={handleDateBack}
      onForward={handleDateForward}>
      <Text style={styles.statsHeader}>{statsTitle[currentIndex]}</Text>
    </TransitionHeader>
  );
};

const StatisticsScreen: React.FC = () => {
  const [events, setEvents] = useState<RemoteEvent[] | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<RemoteEvent[]>([]);

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

  return (
    <View>
      <StatisticsHeader
        events={events}
        setFilteredEvents={setFilteredEvents}
      />
      <StatisticScreen events={filteredEvents} />
    </View>
  );
};

const styles = StyleSheet.create({
  statsHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default StatisticsScreen;
