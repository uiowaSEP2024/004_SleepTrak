import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { colors } from '../../../assets/colors';

interface SleepTypeSelectorProps {
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const SleepTypeSelector: React.FC<SleepTypeSelectorProps> = (props) => {
  const { style } = props;
  const [value, setValue] = React.useState('');

  return (
    <SegmentedButtons
      style={[styles.container, style]}
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue);
        props.onValueChange(newValue);
      }}
      buttons={[
        {
          value: 'nap',
          label: 'Nap',
          style: {
            backgroundColor: value === 'nap' ? colors.lightTan : 'transparent'
          }
        },
        {
          value: 'nightSleep',
          label: 'Night Sleep',
          style: {
            backgroundColor:
              value === 'nightSleep' ? colors.lightTan : 'transparent'
          }
        }
      ]}
      theme={{ colors: { primary: 'green' } }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 30
  }
});

export default SleepTypeSelector;
