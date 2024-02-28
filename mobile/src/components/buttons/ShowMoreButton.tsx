import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple, Icon, Text } from 'react-native-paper';

interface Props {
  onPress: () => void;
  title: string;
}

const ShowMoreButton: React.FC<Props> = ({ onPress, title }) => {
  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.container}>
      <View style={styles.buttonContent}>
        <Text style={styles.title}>{title}</Text>
        <Icon
          source="chevron-down"
          size={30}
        />
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  buttonContent: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontSize: 16
  }
});

export default ShowMoreButton;
