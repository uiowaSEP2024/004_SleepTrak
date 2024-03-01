/**
 * ElapsedTimeDisplay
 *
 * This component displays the elapsed time in hours, minutes, and seconds.
 */

import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

interface ElapsedTimeDisplayProps {
  isRunning: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * ElapsedTimeDisplay component.
 *
 * @param {boolean} props.isRunning - A boolean value that indicates whether the timer is running.
 */
const ElapsedTimeDisplay: React.FC<ElapsedTimeDisplayProps> = ({
  isRunning,
  style
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Use a ref to store the interval ID so that it can be cleared when the component is unmounted.
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRunning) {
      setElapsedTime(0);
      // Start a new interval that increments the elapsed time every second
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    } else {
      intervalRef.current && clearInterval(intervalRef.current);
    }

    // This is the cleanup function that runs when the component unmounts or before the effect runs again.
    // It clears the interval to prevent memory leaks.
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formattedTime = formatTime(elapsedTime);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>Elapsed Time: {formattedTime}</Text>
    </View>
  );
};

const formatTime = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  }
});

export default ElapsedTimeDisplay;
