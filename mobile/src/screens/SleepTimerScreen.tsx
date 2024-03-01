/**
 * SleepTimerScreen
 *
 * This screen is the main screen for logging the sleep time using a stop watch.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import TimerButton from '../components/buttons/TimerButton';
import TimerDisplay from '../components/views/TimerDisplay';
import ElapsedTimeDisplay from '../components/views/ElapsedTimeDisplay';
import ShowMoreButton from '../components/buttons/ShowMoreButton';
import WindowCell from '../components/views/WindowCell';

const SleepTimer: React.FC = () => {
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [SleepStopTime, setSleepStopTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [windows, setWindows] = useState<
    Array<{ id: string; startTime: string; stopTime: string }>
  >([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const handleStart = () => {
    setSleepStartTime(new Date());
    setSleepStopTime(null);
    setIsRunning(true);
  };

  const handleStop = () => {
    const stopTimeForLog = new Date();
    setSleepStopTime(new Date());
    setIsRunning(false);
    if (sleepStartTime && stopTimeForLog) {
      const newWindow = {
        id: sleepStartTime.getTime().toString(),
        startTime: sleepStartTime.toLocaleTimeString(undefined, options),
        stopTime: stopTimeForLog.toLocaleTimeString(undefined, options)
      };
      setWindows([...windows, newWindow]);
      console.log(windows);
    }
  };

  const handleShowLog = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.timerGroup}>
          <TimerDisplay
            style={{ marginBottom: 40 }}
            title="Start Time:"
            time={sleepStartTime ? sleepStartTime.toLocaleTimeString() : ''}
          />
          <TimerDisplay
            title="Stop Time:"
            time={SleepStopTime ? SleepStopTime.toLocaleTimeString() : ''}
          />
        </View>
        <ElapsedTimeDisplay
          isRunning={isRunning}
          style={{ marginBottom: 40 }}
        />
        <TimerButton
          onStart={handleStart}
          onStop={handleStop}
          style={{ marginBottom: 80 }}
        />
        <ShowMoreButton
          onPress={handleShowLog}
          title="Show Log"
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={windows}
          renderItem={({ item: { startTime, stopTime } }) => (
            <WindowCell
              startTime={startTime}
              endTime={stopTime}
            />
          )}
          keyExtractor={(window) => window.id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: Dimensions.get('window').height
  },
  timerGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40
  },
  listContainer: {
    marginTop: 100,
    justifyContent: 'flex-start'
  }
});

export default SleepTimer;
