import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';

interface Props {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
}

const NavigationButton: React.FC<Props> = ({ onPress, title, style }) => {
  return (
    <TouchableRipple
      onPress={onPress}
      style={[styles.buttonLayout, style]}>
      <Text>{title}</Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  buttonLayout: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'gray',
    width: Dimensions.get('window').width * 0.8,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default NavigationButton;
