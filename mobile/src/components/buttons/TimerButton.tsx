/**
 * TimerButton
 *
 * A button that starts and stops the timer.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableRipple, Icon } from 'react-native-paper';
import { colors } from '../../../assets/colors';

interface TimerButtonProps {
  onStart: () => void;
  onStop: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * TimerButton component.
 *
 * @param {function} props.onStart - The function to call when the timer starts.
 * @param {function} props.onStop - The function to call when the timer stops.
 */
const TimerButton: React.FC<TimerButtonProps> = ({
  onStart,
  onStop,
  style
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handlePress = () => {
    if (isTimerRunning) {
      onStop();
    } else {
      onStart();
    }
    setIsTimerRunning((prev) => !prev);
  };

  return (
    <TouchableRipple
      onPress={handlePress}
      style={[styles.container, style]}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Icon
              source={isTimerRunning ? 'stop' : 'play'}
              size={96}
              color="white"
            />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.crimsonRed
  },
  innerContainer: {
    width: 160,
    height: 160,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  buttonContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 120,
    backgroundColor: colors.crimsonRed,
    borderWidth: 3,
    borderColor: 'white'
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  title: {
    fontSize: 16,
    textAlign: 'center'
  },
  iconContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TimerButton;
