import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';
import { colors } from '../../../assets/colors';

interface CribButtonProps {
  onStart: () => void;
  onStop: () => void;
  style?: StyleProp<ViewStyle>;
}

const CribButton: React.FC<CribButtonProps> = ({ onStart, onStop, style }) => {
  const [didSleepStart, setDidSleepStart] = useState(false);

  const handlePress = () => {
    if (didSleepStart) {
      onStop();
    } else {
      onStart();
    }
    setDidSleepStart((prev) => !prev);
  };
  return (
    <TouchableRipple
      onPress={handlePress}
      style={[styles.container, style]}>
      <View style={styles.buttonContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {didSleepStart ? 'Take out of crib' : 'Put in Crib'}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: Dimensions.get('window').width * 0.5
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepBlue
  }
});

export default CribButton;
