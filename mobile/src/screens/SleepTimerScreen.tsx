import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TimerButton from '../components/buttons/TimerButton';
import TimerDisplay from '../components/views/TimerDisplay';

const SleepTimer: React.FC = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stopTime, setStopTime] = useState<Date | null>(null);

  const handleStart = () => {
    setStartTime(new Date());
    setStopTime(null);
  };

  const handleStop = () => {
    setStopTime(new Date());
  };

  return (
    <View style={styles.container}>
      <TimerDisplay
        title="Start Time:"
        time={startTime?.toLocaleTimeString()}
      />
      <TimerDisplay
        title="Stop Time:"
        time={stopTime?.toLocaleTimeString()}
      />
      <TimerButton
        onStart={handleStart}
        onStop={handleStop}
      />
    </View>
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
