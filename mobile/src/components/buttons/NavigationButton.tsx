import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';

interface Props {
  onPress: () => void;
  title: string;
}

const NavigationButton: React.FC<Props> = ({ onPress, title }) => {
  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.buttonLayout}>
      <Text>{title}</Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  buttonLayout: {
    padding: 10
  }
});

export default NavigationButton;
