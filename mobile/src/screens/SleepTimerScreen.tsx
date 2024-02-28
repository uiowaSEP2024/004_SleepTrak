/**
 * SleepTimerScreen
 *
 * This screen is the main screen for logging the sleep time using a stop watch.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TimerButton from '../components/buttons/TimerButton';
import TimerDisplay from '../components/views/TimerDisplay';
import ElapsedTimeDisplay from '../components/views/ElapsedTimeDisplay';

const SleepTimer: React.FC = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stopTime, setStopTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleStart = () => {
    setStartTime(new Date());
    setStopTime(null);
    setIsRunning(true);
  };

  const handleStop = () => {
    setStopTime(new Date());
    setIsRunning(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <TimerDisplay
          title="Start Time:"
          time={startTime ? startTime.toLocaleTimeString() : ''}
        />
        <TimerDisplay
          title="Stop Time:"
          time={stopTime ? stopTime.toLocaleTimeString() : ''}
        />
        <ElapsedTimeDisplay isRunning={isRunning} />
        <TimerButton
          onStart={handleStart}
          onStop={handleStop}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default SleepTimer;
