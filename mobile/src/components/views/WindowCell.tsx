import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface CustomCellProps {
  item: string;
}

const CustomCell: React.FC<CustomCellProps> = ({ item }) => {
  return (
    <View style={styles.cell}>
      <Text>{item}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {}
});

export default CustomCell;
