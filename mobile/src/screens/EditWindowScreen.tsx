import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import EditTimePicker from '../components/inputs/EditTimePicker';
import SaveButton from '../components/buttons/SaveButton';

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
      <View style={styles.editTimeGroup}>
        <EditTimePicker
          style={{ marginBottom: 30 }}
          title="Start Time"
          placeholderTime={startTime}
        />
        <EditTimePicker
          title="Stop Time"
          placeholderTime={stopTime}
        />
      </View>
      <SaveButton
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
    alignItems: 'center'
  },
  editTimeGroup: {
    marginVertical: 60
  },
  saveButton: {
    bottom: 30
  }
});

export default EditWindowScreen;
