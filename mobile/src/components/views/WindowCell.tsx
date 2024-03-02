import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors } from '../../../assets/colors';

interface WindowCellProps {
  startTime: string;
  endTime: string;
  style?: StyleProp<ViewStyle>;
  isSleep: boolean;
}

const WindowCell: React.FC<WindowCellProps> = ({
  startTime,
  endTime,
  style,
  isSleep
}) => {
  return (
    <View style={[styles.cell, style, isSleep ? styles.sleep : styles.awake]}>
      <Text style={styles.title}> {isSleep ? 'SLEEP' : 'AWAKE'} </Text>
      <Text style={styles.startTime}> {startTime}</Text>
      <Text> ー </Text>
      <Text style={styles.endTime}> {endTime}</Text>
      <View style={styles.iconContainer}>
        <Icon
          source="pencil"
          size={20}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 35,
    height: 70,
    width: Dimensions.get('window').width * 0.8
  },
  sleep: {
    backgroundColor: colors.peachyOrange
  },
  awake: {
    backgroundColor: colors.lightTan
  },
  title: {
    fontSize: 20,
    paddingLeft: 20
  },
  startTime: {
    fontSize: 16,
    marginLeft: 0
  },
  endTime: {
    fontSize: 16,
    marginLeft: 0
  },
  iconContainer: {
    marginRight: 20
  }
});

export default WindowCell;
