/**
 * TimerDisplay
 *
 * This component is a simple display for showing the start and stop times of the sleep timer.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';

interface TimerDisplayProps {
  title: string;
  time: string;
}

/**
 * TimerDisplay component.
 *
 * @param {string} props.title - The title of the display.
 * @param {string} props.time - The time to display.
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({
  title = '',
  time = ''
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

TimerDisplay.propTypes = {
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  },
  title: {
    fontWeight: 'bold',
    flex: 1
  },
  time: {
    textAlign: 'right',
    flex: 1
  }
});

export default TimerDisplay;
