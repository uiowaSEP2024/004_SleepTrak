import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import SleepTypeSelector from '../components/selectors/SleepTypeSelector';
import EditTimePicker from '../components/inputs/EditTimePicker';
import WindowCell from '../components/views/WindowCell';
import type { RootStackParamList } from '../navigations/HomeStack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../assets/colors';
import { Button } from 'react-native-paper';
import { saveEvent, saveSleepWindow } from '../utils/localDb';
import { addToSyncQueue, syncData } from '../utils/syncQueue';
import { localize } from '../utils/bridge';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManualSleepTrackingScreen'
>;

const ManualSleepTrackingScreen = () => {
  const [sleepData, setSleepData] = useState({
    startTime: new Date(),
    endTime: new Date(),
    type: 'nap'
  });
  const [isNap, setIsNap] = useState<boolean>(true);
  const [sleepStartTime, setSleepStartTime] = useState(new Date());
  const [sleepStopTime, setSleepStopTime] = useState(new Date());
  const [windows, setWindows] = useState<
    Array<{
      id: string;
      startTime: Date;
      stopTime: Date;
      isSleep: boolean;
      note: string;
    }>
  >([]);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  const handleSleepTypeChange = (newValue: string) => {
    setIsNap(newValue === 'nap');
  };

  const handleSleepStartTimeChange = (selectedTime: Date) => {
    setSleepStartTime(selectedTime);
  };

  const handleSleepStopTimeChange = (selectedTime: Date) => {
    setSleepStopTime(selectedTime);
  };

  const navigation = useNavigation<NavigationProp>();

  const handleWindowEdit = (editedWindow: {
    id: string;
    startTime: Date;
    stopTime: Date;
    isSleep: boolean;
    note: string;
  }) => {
    const windowIndex = windows.findIndex(
      (window) => window.id === editedWindow.id
    );

    if (windowIndex !== -1) {
      const newWindows = [...windows];
      newWindows[windowIndex] = editedWindow;
      setWindows(newWindows);
    }
  };

  const handleWindowDelete = (windowId: string) => {
    setWindows(windows.filter((window) => window.id !== windowId));
  };

  const updateWindows = () => {
    if (sleepStartTime > sleepStopTime) {
      Alert.alert('', 'Start time must be before stop time');
      return;
    }
    if (
      windows.length > 0 &&
      sleepStartTime < windows[windows.length - 1].stopTime
    ) {
      Alert.alert('', 'Sleep windows must be in chronological order');
      return;
    }
    setWindows((prevWindows) => {
      let updatedWindows = [...prevWindows];
      if (updatedWindows.length > 0) {
        const awakeWindow = {
          id: updatedWindows[updatedWindows.length - 1].stopTime
            .getTime()
            .toString(),
          startTime: updatedWindows[updatedWindows.length - 1].stopTime,
          stopTime: sleepStartTime,
          isSleep: false,
          note: ''
        };
        updatedWindows = [...updatedWindows, awakeWindow];
      }
      const newWindow = {
        id: sleepStartTime.getTime().toString(),
        startTime: sleepStartTime,
        stopTime: sleepStopTime,
        isSleep: true,
        note: ''
      };
      updatedWindows = [...updatedWindows, newWindow];
      return updatedWindows;
    });
  };

  const handleSave = async () => {
    if (windows.length === 0) {
      Alert.alert('', 'Please log at least one sleep window');
      return;
    }
    const newSleepData = {
      ...sleepData,
      startTime: windows[0].startTime,
      endTime: windows[windows.length - 1].stopTime,
      type: isNap ? 'nap' : 'night_sleep'
    };
    setSleepData(newSleepData);
    try {
      const sleepDataLocal = localize(newSleepData);
      await saveEvent(sleepDataLocal);
      addToSyncQueue({
        id: sleepDataLocal.eventId,
        operation: 'insert',
        data: sleepDataLocal,
        status: 'pending'
      });

      const windowPromises = windows.map(async (window) => {
        const windowData = {
          ...window,
          windowId: window.id,
          eventId: sleepDataLocal.eventId,
          startTime: window.startTime.toISOString(),
          stopTime: window.stopTime.toISOString()
        };
        try {
          addToSyncQueue({
            id: windowData.windowId,
            operation: 'insert',
            data: windowData,
            status: 'pending'
          });
        } catch (error) {
          console.error('Error in addToSyncQueue (window):', error);
        }
        await saveSleepWindow(windowData);
      });

      try {
        await Promise.all(windowPromises);
      } catch (error) {
        console.error('Error in saveSleepWindow:', error);
      }
      await syncData();
    } catch (error) {
      console.error('Error in saveEvent:', error);
    } finally {
      setWindows([]);
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: '7%'
      }}>
      <SleepTypeSelector
        onValueChange={handleSleepTypeChange}
        style={{ marginTop: 20, marginBottom: 10 }}
      />
      <EditTimePicker
        title="Start Time"
        placeholderTime={sleepStartTime}
        onTimeChange={handleSleepStartTimeChange}
        style={{ marginTop: 30 }}
      />
      <EditTimePicker
        title="Stop Time"
        placeholderTime={sleepStopTime}
        onTimeChange={handleSleepStopTimeChange}
      />
      <Button
        mode="contained"
        onPress={updateWindows}
        style={styles.saveButtonContainer}
        labelStyle={styles.saveButtonLabel}>
        Add Window
      </Button>
      {windows.map(({ id, startTime, stopTime, isSleep }) => (
        <TouchableOpacity
          key={id + '_' + Math.random().toString()}
          onPress={() => {
            navigation.navigate('EditWindowScreen', {
              id,
              startTime,
              stopTime,
              isSleep,
              onWindowEdit: handleWindowEdit,
              onWindowDelete: handleWindowDelete
            });
          }}>
          <WindowCell
            startTime={startTime.toLocaleTimeString(undefined, options)}
            endTime={stopTime.toLocaleTimeString(undefined, options)}
            isSleep={isSleep}
          />
        </TouchableOpacity>
      ))}
      <Button
        mode="contained"
        onPress={() => {
          void handleSave();
        }}
        style={styles.saveButtonContainer}
        labelStyle={styles.saveButtonLabel}>
        Save Sleep
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  label: {
    marginRight: 10,
    fontSize: 16
  },
  saveButtonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: colors.crimsonRed,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  saveButtonLabel: {
    color: 'white',
    fontSize: 20
  }
});

export default ManualSleepTrackingScreen;
