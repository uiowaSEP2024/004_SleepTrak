import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ElapsedTimeDisplayProps {
  isRunning: boolean;
}

const ElapsedTimeDisplay: React.FC<ElapsedTimeDisplayProps> = ({
  isRunning
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRunning) {
      setElapsedTime(0);
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    } else {
      intervalRef.current && clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formattedTime = formatTime(elapsedTime);

  return (
    <View style={styles.container}>
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
