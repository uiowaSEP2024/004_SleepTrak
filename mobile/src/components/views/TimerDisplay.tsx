/**
 * TimerDisplay
 *
 * This component is a simple display for showing the start and stop times of the sleep timer.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';

interface TimerDisplayProps {
  title: string;
  time: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * TimerDisplay component.
 *
 * @param {string} props.title - The title of the display.
 * @param {string} props.time - The time to display.
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({
  title = '',
  time = '',
  style
}) => {
  return (
    <View style={[styles.container, style]}>
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
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
    flex: 1,
    marginBottom: 5
  },
  time: {
    textAlign: 'right',
    fontSize: 18,
    flex: 1,
    paddingRight: 5,
    marginBottom: 5
  }
});

export default TimerDisplay;
