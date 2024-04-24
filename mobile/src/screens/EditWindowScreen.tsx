import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import EditTimePicker from '../components/inputs/EditTimePicker';
import NotesTextInput from '../components/inputs/NotesTextInput';
import BasicButton from '../components/buttons/SaveButton';
import { colors } from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  EditWindowScreen: {
    id: string;
    startTime: Date;
    stopTime: Date;
    isSleep: boolean;
    onWindowEdit: (window: {
      id: string;
      startTime: Date;
      stopTime: Date;
      isSleep: boolean;
      note: string;
    }) => void;
    onWindowDelete: (id: string) => void;
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
  const navigation = useNavigation();
  const { id, startTime, stopTime, isSleep, onWindowEdit, onWindowDelete } =
    route.params;
  const [windowNote, setWindowNote] = useState('');
  const [newStartTime, setStartTime] = useState(startTime);
  const [newStopTime, setStopTime] = useState(stopTime);

  const handleSave = () => {
    if (newStartTime >= newStopTime) {
      Alert.alert('', 'Start time must be before stop time');
      return;
    }
    const duration =
      (newStopTime.getTime() - newStartTime.getTime()) / (1000 * 60);
    if (duration < 0.59) {
      Alert.alert('', 'Please log at least 1 minute of sleep');
      return;
    }
    onWindowEdit({
      id,
      startTime: newStartTime,
      stopTime: newStopTime,
      isSleep,
      note: windowNote
    });
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleDelete = () => {
    onWindowDelete(id);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };
  return (
    <View style={styles.container}>
      <View style={styles.editTimeGroup}>
        <EditTimePicker
          style={{ marginBottom: 30 }}
          title="Start Time"
          placeholderTime={startTime}
          onTimeChange={(newTime) => {
            setStartTime(newTime);
          }}
        />
        <EditTimePicker
          title="Stop Time"
          placeholderTime={stopTime}
          onTimeChange={(newTime) => {
            setStopTime(newTime);
          }}
        />
      </View>
      <NotesTextInput
        onValueChange={(value) => {
          setWindowNote(value);
        }}
      />
      <BasicButton
        title="Save"
        style={styles.saveButton}
        onPress={() => {
          handleSave();
        }}
      />
      <BasicButton
        title="Delete"
        style={styles.deleteButton}
        onPress={() => {
          handleDelete();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  editTimeGroup: {
    marginTop: 60,
    marginBottom: 40
  },
  saveButton: {
    marginBottom: 20
  },
  deleteButton: {
    backgroundColor: colors.skyBlue,
    marginBottom: 20
  }
});

export default EditWindowScreen;
