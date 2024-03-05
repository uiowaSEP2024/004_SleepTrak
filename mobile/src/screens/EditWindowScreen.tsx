import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../assets/colors';
import EditTimePicker from '../components/inputs/EditTimePicker';

type RootStackParamList = {
  EditWindowScreen: {
    startTime: Date;
    stopTime: Date;
    isSleep: boolean;
  };
};

type EditWindowScreenRouteProp = RouteProp<
  RootStackParamList,
  'EditWindowScreen'
>;

type Props = {
  route: EditWindowScreenRouteProp;
};

const EditWindowScreen: React.FC<Props> = ({ route }) => {
  const { startTime, stopTime, isSleep } = route.params;

  return (
    <View style={styles.container}>
      <EditTimePicker
        title="Start Time"
        placeholderTime={startTime}
      />
      <Button
        title="Save"
        onPress={() => {
          console.log({ startTime, stopTime, isSleep });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightTan
  }
});

export default EditWindowScreen;
