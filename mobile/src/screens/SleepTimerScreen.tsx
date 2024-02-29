/**
 * SleepTimerScreen
 *
 * This screen is the main screen for logging the sleep time using a stop watch.
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import TimerButton from '../components/buttons/TimerButton';
import TimerDisplay from '../components/views/TimerDisplay';
import ElapsedTimeDisplay from '../components/views/ElapsedTimeDisplay';
import ShowMoreButton from '../components/buttons/ShowMoreButton';
import WindowCell from '../components/views/WindowCell';

const SleepTimer: React.FC = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stopTime, setStopTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const data = ['Item 1', 'Item 2', 'Item 3'];
  const scrollViewRef = useRef<ScrollView>(null);

  const handleStart = () => {
    setStartTime(new Date());
    setStopTime(null);
    setIsRunning(true);
  };

  const handleStop = () => {
    setStopTime(new Date());
    setIsRunning(false);
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
            title="Start Time:"
            time={startTime ? startTime.toLocaleTimeString() : ''}
          />
          <TimerDisplay
            title="Stop Time:"
            time={stopTime ? stopTime.toLocaleTimeString() : ''}
          />
        </View>
        <ElapsedTimeDisplay isRunning={isRunning} />
        <TimerButton
          onStart={handleStart}
          onStop={handleStop}
        />
        <ShowMoreButton
          onPress={handleShowLog}
          title="Show Log"
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => <WindowCell item={item} />}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timerGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 60
  },
  listContainer: {
    marginTop: 100
  }
});

export default SleepTimer;
