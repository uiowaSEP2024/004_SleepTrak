import React from 'react';
import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../assets/colors';
import { IconButton } from 'react-native-paper';

const ArrowButton: React.FC<{
  direction: string;
  onPress: any;
  testID: string;
}> = ({ direction, onPress, testID }) => {
  return (
    <IconButton
      testID={testID}
      icon={`arrow-${direction}`}
      iconColor={'white'}
      size={24}
      onPress={onPress}
    />
  );
};

interface TransitionHeaderProps {
  onBack: () => void;
  onForward: () => void;
  children?: ReactNode;
}

export const TransitionHeader: React.FC<TransitionHeaderProps> = ({
  onBack,
  onForward,
  children
}) => {
  return (
    <View style={styles.headerContainer}>
      <ArrowButton
        testID="date-back-button"
        direction="left"
        onPress={onBack}
      />
      {children}
      <ArrowButton
        testID="date-forward-button"
        direction="right"
        onPress={onForward}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.crimsonRed
  },
  dateHeader: {
    color: 'white',
    fontSize: 16
  }
});
