import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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
