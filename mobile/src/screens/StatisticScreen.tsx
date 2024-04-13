import React from 'react';
import { View, Text } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StatisticStackParamList } from '../navigations/StatisticStack';

type StatisticScreenRouteProp = RouteProp<
  StatisticStackParamList,
  'StatisticScreen'
>;

interface StatisticScreenProps {
  route: StatisticScreenRouteProp;
}

const StatisticScreen: React.FC<StatisticScreenProps> = ({ route }) => {
  const { events } = route.params;
  return (
    <View>
      <Text>Statistic Screen</Text>
      {events.map((event, index) => (
        <Text key={index}>{event.eventId}</Text>
      ))}
    </View>
  );
};

export default StatisticScreen;
