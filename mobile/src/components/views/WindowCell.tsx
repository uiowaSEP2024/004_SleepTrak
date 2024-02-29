import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';

interface WindowCellProps {
  startTime: string;
  endTime: string;
}

const WindowCell: React.FC<WindowCellProps> = ({ startTime, endTime }) => {
  return (
    <View style={styles.cell}>
      <Text>{startTime}</Text>
      <Text>{endTime}</Text>
      <Icon
        source="pencil"
        size={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray'
  }
});

export default WindowCell;
