import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StatisticStackParamList } from '../navigations/StatisticStack';
import { Card } from 'react-native-paper';
import { colors } from '../../assets/colors';
import type { RemoteEvent } from '../utils/interfaces';

type StatisticScreenRouteProp = RouteProp<
  StatisticStackParamList,
  'StatisticScreen'
>;
interface StatisticScreenProps {
  route: StatisticScreenRouteProp;
}

function calculateDurationInMinutes(date1: Date, date2: Date): number {
  const oneMinute = 60 * 1000;
  const diffMinutes = Math.round(
    Math.abs((date1.getTime() - date2.getTime()) / oneMinute)
  );
  return diffMinutes;
}

// const IntervalSegment: React.FC = () => {
//   const [selectedInterval, setSelectedInterval] = React.useState('day');
//   return (
//       <SegmentedButtons
//         value={selectedInterval}
//         onValueChange={setSelectedInterval}
//         buttons={[
//           {
//             value: 'day',
//             label: 'D',
//           },
//           {
//             value: 'week',
//             label: 'W',
//           },
//           {
//             value: 'month',
//             label: 'M'
//           }
//         ]}
//         style={styles.segmentButton}
//       />
//   );
// };

type StatisticCardProps = {
  statistics: Record<string, string | number>;
  style?: {
    card?: StyleProp<ViewStyle>;
    title?: StyleProp<TextStyle>;
    content?: StyleProp<ViewStyle>;
    label?: StyleProp<TextStyle>;
    value?: StyleProp<TextStyle>;
  };
};

const StatisticCard: React.FC<StatisticCardProps> = ({ statistics, style }) => (
  <Card
    style={[styles.card, style?.card]}
    mode="contained">
    <Card.Title
      title="Summary"
      titleStyle={[{ fontSize: 20 }, style?.title]}
    />
    <Card.Content style={[{ justifyContent: 'space-between' }, style?.content]}>
      {Object.entries(statistics).map(([label, value]) => (
        <View
          key={label}
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={style?.label}>{label}</Text>
          <Text style={style?.value}>{value}</Text>
        </View>
      ))}
    </Card.Content>
  </Card>
);

const StatisticScreen: React.FC<StatisticScreenProps> = ({ route }) => {
  const { events } = route.params;
  if (!events || events.length === 0) {
    return (
      <View style={styles.container}>
        <Text>There are no events to display</Text>
      </View>
    );
  }
  let nightSleepAverageStartTime = 0;
  let nightSleepAverageEndTime = 0;
  let averageNumberOfWakings = 0;
  let averageNapTime = 0;
  let averageNapSleep = 0;
  let averageNumberOfNaps = 0;
  let averageFeedNumber = 0;
  let averageNightFeed = 0;
  // Night Sleep Stats
  if (events[0].type === 'night_sleep') {
    nightSleepAverageStartTime =
      events.reduce((acc, event) => {
        const startTime = new Date(event.startTime);
        return acc + startTime.getHours() * 60 + startTime.getMinutes();
      }, 0) / events.length;
    nightSleepAverageEndTime =
      events.reduce((acc, event) => {
        if (event.endTime) {
          const endTime = new Date(event.endTime);
          return acc + endTime.getHours() * 60 + endTime.getMinutes();
        }
        return acc;
      }, 0) / events.length;
    averageNumberOfWakings =
      events.reduce((acc, event) => {
        if (event.sleepWindows) {
          const awakeWindows = event.sleepWindows.filter(
            (window) => !window.isSleep
          );
          return acc + awakeWindows.length;
        }
        return acc;
      }, 0) / events.length;
  } else if (events[0].type === 'nap') {
    // Nap Stats
    averageNapTime =
      events.reduce((acc, event) => {
        if (event.endTime) {
          const startTime = new Date(event.startTime);
          const endTime = new Date(event.endTime);
          return acc + calculateDurationInMinutes(startTime, endTime);
        }
        return acc;
      }, 0) / events.length;
    averageNapSleep =
      events.reduce((acc, event) => {
        if (event.sleepWindows) {
          const sleepWindows = event.sleepWindows.filter(
            (window) => window.isSleep
          );
          for (let i = 0; i < sleepWindows.length; i++) {
            const startTime = new Date(sleepWindows[i].startTime);
            const endTime = new Date(sleepWindows[i].stopTime);
            acc += calculateDurationInMinutes(startTime, endTime);
          }
        }
        return acc;
      }, 0) / events.length;
    const eventsByDay = events.reduce<Record<string, RemoteEvent[]>>(
      (acc, event: RemoteEvent) => {
        const eventDate = new Date(event.startTime).toDateString();
        if (!acc[eventDate]) {
          acc[eventDate] = [];
        }
        acc[eventDate].push(event);
        return acc;
      },
      {}
    );
    const numberOfNaps = Object.values(eventsByDay).map(
      (events) => events.length
    );
    averageNumberOfNaps =
      numberOfNaps.reduce((acc, num) => acc + num, 0) / numberOfNaps.length;
  } else {
    // Feed Stats
    const eventsByDay = events.reduce<Record<string, RemoteEvent[]>>(
      (acc, event: RemoteEvent) => {
        const eventDate = new Date(event.startTime).toDateString();
        if (!acc[eventDate]) {
          acc[eventDate] = [];
        }
        acc[eventDate].push(event);
        return acc;
      },
      {}
    );
    const numberOfFeeds = Object.values(eventsByDay).map(
      (events) => events.length
    );
    averageFeedNumber =
      numberOfFeeds.reduce((acc, num) => acc + num, 0) / numberOfFeeds.length;
    const eventsByNight = events.reduce<Record<string, RemoteEvent[]>>(
      (acc, event: RemoteEvent) => {
        const eventDate = new Date(event.startTime);
        const hour = eventDate.getHours();
        // Only consider events that occurred between 7 PM and 7 AM
        if (hour >= 19 || hour < 7) {
          const dateKey = eventDate.toDateString();
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(event);
        }
        return acc;
      },
      {}
    );
    const numberOfNightFeeds = Object.values(eventsByNight).map(
      (events) => events.length
    );
    averageNightFeed =
      numberOfNightFeeds.reduce((acc, num) => acc + num, 0) /
      numberOfNightFeeds.length;
  }

  return (
    <View>
      {/* <Text>Statistic Screen</Text>
      {events.map((event, index) => (
        <Text key={index}>{event.startTime}</Text>
      ))} */}
      {events?.[0]?.type === 'night_sleep' ? (
        <>
          <Text style={styles.title}>Night Sleep Statistics</Text>
          <StatisticCard
            statistics={{
              'Average Bed Time': nightSleepAverageEndTime,
              'Average Wake up Time': nightSleepAverageStartTime,
              'Average Wakings per Night': averageNumberOfWakings
            }}
          />
        </>
      ) : events[0].type === 'nap' ? (
        <>
          <Text style={styles.title}>Nap Statistics</Text>
          <StatisticCard
            statistics={{
              'Average Nap Time': averageNapTime,
              'Average Nap Time (Sleep)': averageNapSleep,
              'Average Number of Nap per Day': averageNumberOfNaps
            }}
          />
        </>
      ) : (
        <>
          <Text>Feed Statistics</Text>
          <StatisticCard
            statistics={{
              'Average Number of Feed per Day': averageFeedNumber,
              'Average Number of Feed at Night': averageNightFeed
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  segmentButton: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 100,
    marginVertical: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: '5%',
    paddingLeft: 20,
    paddingTop: 16,
    color: colors.crimsonRed
  },
  card: {
    marginTop: 16,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 48,
    height: '50%'
  },
  statisticType: {}
});

export default StatisticScreen;
