import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import EditTimePicker from '../components/inputs/EditTimePicker';
import NotesTextInput from '../components/inputs/NotesTextInput';
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
      <NotesTextInput />
      <SaveButton
        title="Save"
        style={styles.saveButton}
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
    marginTop: 60,
    marginBottom: 40
  },
  saveButton: {
    marginBottom: 40
  }
});

export default EditWindowScreen;
