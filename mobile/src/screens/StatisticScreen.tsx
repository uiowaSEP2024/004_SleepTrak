import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StatisticStackParamList } from '../navigations/StatisticStack';
import { Card, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../assets/colors';
import type { RemoteEvent } from '../utils/interfaces';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { format } from 'date-fns';

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

function formatTime(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  let period = 'AM';
  if (hours >= 12) {
    period = 'PM';
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }
  const minutesStr =
    remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes;
  return `${hours}:${minutesStr} ${period}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);

  return `${hours} h ${remainingMinutes} m`;
}

type IntervalSegmentProps = {
  onIntervalChange: (interval: string) => void;
};

const IntervalSegment: React.FC<IntervalSegmentProps> = ({
  onIntervalChange
}) => {
  const [selectedInterval, setSelectedInterval] = React.useState('day');

  useEffect(() => {
    onIntervalChange(selectedInterval);
  }, [selectedInterval, onIntervalChange]);

  return (
    <SegmentedButtons
      value={selectedInterval}
      onValueChange={setSelectedInterval}
      buttons={[
        {
          value: 'day',
          label: 'D'
        },
        {
          value: 'week',
          label: 'W'
        },
        {
          value: 'month',
          label: 'M'
        }
      ]}
      style={styles.segmentButton}
    />
  );
};

type CustomBarChartProps = {
  labels: string[];
  values: number[];
};

const CustomBarChart: React.FC<CustomBarChartProps> = ({ labels, values }) => {
  const data = values.map((value, index) => ({
    value,
    svg: {
      fill: colors.crimsonRed,
      onPress: () => {}
    }
  }));
  if (data.length === 1) {
    data.unshift({
      value: 0,
      svg: { fill: 'transparent', onPress: () => {} }
    });
    data.push({
      value: data[0].value * 2,
      svg: { fill: 'transparent', onPress: () => {} }
    });
    labels.unshift('');
    labels.push('');
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 200,
        width: Dimensions.get('window').width - 20,
        padding: 20
      }}>
      <YAxis
        data={data}
        yAccessor={({ item }) => item.value}
        contentInset={{ top: 10, bottom: 10 }}
        svg={{ fontSize: 10, fill: 'grey' }}
        numberOfTicks={5}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          justifyContent: 'center'
        }}>
        <BarChart
          style={{ flex: 1 }}
          data={data}
          yAccessor={({ item }) => item.value}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.2}
          spacingOuter={0}
          gridMin={0}>
          <Grid svg={{ stroke: 'rgba(0, 0, 0, 0.1)' }} />
        </BarChart>
        <XAxis
          style={{ marginTop: 10 }}
          data={data}
          formatLabel={(value, index) =>
            labels.length > 20
              ? (index + 1) % 5 === 0 || index === 0
                ? labels[index]
                : ''
              : labels[index]
          }
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10, fill: 'grey' }}
        />
      </View>
    </View>
  );
};

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
  const [interval, setInterval] = React.useState('day');
  const { events } = route.params;
  if (!events || events.length === 0) {
    return (
      <View style={styles.container}>
        <Text>There are no events to display</Text>
      </View>
    );
  }
  // Calculation for Bar Chart
  const today = new Date();
  const oneWeekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const awakeWindowLabels: string[] = [];
  const awakeWindowValues: number[] = [];
  // Initialize labels and values
  if (interval === 'week') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      awakeWindowLabels.push(format(date, 'eee'));
      awakeWindowValues.push(0);
    }
  } else if (interval === 'month') {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastDayOfMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      0
    ).getDate();
    for (let i = 0; i < lastDayOfMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
      awakeWindowLabels.push(format(date, 'dd'));
      awakeWindowValues.push(0);
    }
  }
  // Awake Windows for Night Sleeps
  events.forEach((event) => {
    if (event.sleepWindows) {
      event.sleepWindows.forEach((window) => {
        if (!window.isSleep) {
          let windowDate = new Date(window.startTime);
          if (windowDate.getHours() < 7) {
            windowDate = new Date(windowDate.getTime() - 1000 * 60 * 60 * 24);
          }
          let index: number;
          switch (interval) {
            case 'day':
              if (
                format(windowDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
              ) {
                index = awakeWindowLabels.indexOf(format(today, 'yyyy-MM-dd'));
                if (index === -1) {
                  awakeWindowLabels.push(format(today, 'yyyy-MM-dd'));
                  awakeWindowValues.push(1);
                } else {
                  awakeWindowValues[index]++;
                }
              }
              break;
            case 'week':
              if (windowDate >= oneWeekAgo && windowDate <= today) {
                const weekday = format(windowDate, 'eee');
                const index = awakeWindowLabels.indexOf(weekday);
                if (index !== -1) {
                  awakeWindowValues[index]++;
                }
              }
              break;
            case 'month':
              if (windowDate >= startOfMonth && windowDate <= today) {
                const dayOfMonth = format(windowDate, 'dd').padStart(2, '0');
                const index = awakeWindowLabels.indexOf(dayOfMonth);
                if (index !== -1) {
                  awakeWindowValues[index]++;
                }
              }
              break;
          }
        }
      });
    }
  });
  // Calculation for Statistics Summary
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
        return acc + startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
      }, 0) / events.length;
    nightSleepAverageEndTime =
      events.reduce((acc, event) => {
        if (event.endTime) {
          const endTime = new Date(event.endTime);
          return acc + endTime.getUTCHours() * 60 + endTime.getUTCMinutes();
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
      {events?.[0]?.type === 'night_sleep' ? (
        <>
          <Text style={styles.title}>Night Sleep Statistics</Text>
          <IntervalSegment onIntervalChange={setInterval} />
          <CustomBarChart
            values={awakeWindowValues}
            labels={awakeWindowLabels}
          />
          <StatisticCard
            statistics={{
              'Average Bed Time': formatTime(nightSleepAverageStartTime),
              'Average Wake up Time': formatTime(nightSleepAverageEndTime),
              'Average Wakings per Night': Math.round(averageNumberOfWakings)
            }}
          />
        </>
      ) : events[0].type === 'nap' ? (
        <>
          <Text style={styles.title}>Nap Statistics</Text>
          <StatisticCard
            statistics={{
              'Average Nap Time': formatDuration(averageNapTime),
              'Average Nap Time (Sleep)': formatDuration(averageNapSleep),
              'Average Number of Nap per Day': Math.round(averageNumberOfNaps)
            }}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Feed Statistics</Text>
          <StatisticCard
            statistics={{
              'Average Number of Feed per Day': Math.round(averageFeedNumber),
              'Average Number of Feed at Night': Math.round(averageNightFeed)
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
    borderRadius: 48
    // height: '50%'
  },
  statisticType: {}
});

export default StatisticScreen;
