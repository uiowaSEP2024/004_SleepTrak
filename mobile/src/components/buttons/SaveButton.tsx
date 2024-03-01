/**
 * SaveButton
 *
 * A button for saving or logging things
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../../../assets/colors';

interface SaveButtonProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onPress, title, style }) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={[styles.container, style]}
      labelStyle={styles.label}>
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: colors.crimsonRed
  },
  label: {
    color: 'white',
    fontSize: 20
  }
});

export default SaveButton;
