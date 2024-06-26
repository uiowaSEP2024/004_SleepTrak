/**
 * SleepTimerScreen
 *
 * This screen is the main screen for logging the sleep time using a stop watch.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigations/HomeStack';
import TimerButton from '../components/buttons/TimerButton';
import CribButton from '../components/buttons/CribButton';
import TimerDisplay from '../components/views/TimerDisplay';
import ElapsedTimeDisplay from '../components/views/ElapsedTimeDisplay';
import ShowMoreButton from '../components/buttons/ShowMoreButton';
import WindowCell from '../components/views/WindowCell';
import SleepTypeSelector from '../components/selectors/SleepTypeSelector';
import { saveEvent, saveSleepWindow } from '../utils/localDb';
import { addToSyncQueue, syncData } from '../utils/syncQueue';
import { localize } from '../utils/bridge';
import { Button } from 'react-native-paper';
import { colors } from '../../assets/colors';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SleepTimerScreen'
>;

const SleepTimer: React.FC = () => {
  const [isNap, setIsNap] = useState<boolean>(true);
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [SleepStopTime, setSleepStopTime] = useState<Date | null>(null);
  const [wakeStartTime, setWakeStartTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSleep, setIsSleep] = useState<boolean>(true);
  const [cribStartTime, setCribStartTime] = useState<Date | null>(null);
  const [cribStopTime, setCribStopTime] = useState<Date | null>(null);
  const [windows, setWindows] = useState<
    Array<{
      id: string;
      startTime: Date;
      stopTime: Date;
      isSleep: boolean;
      note: string;
    }>
  >([]);
  const [sleepData, setSleepData] = useState({
    startTime: new Date(),
    endTime: new Date(),
    type: 'nap'
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  const navigation = useNavigation<NavigationProp>();

  const handleStart = () => {
    const stopTimeForLog = new Date();
    setSleepStartTime(new Date());
    setSleepStopTime(null);
    setIsRunning(true);
    setIsSleep(true);
    if (wakeStartTime) {
      setIsSleep(true);
      const newWindow = {
        id: wakeStartTime.getTime().toString(),
        startTime: wakeStartTime,
        stopTime: stopTimeForLog,
        isSleep,
        note: ''
      };
      setWindows([...windows, newWindow]);
    }
  };

  const handleStop = () => {
    const stopTimeForLog = new Date();
    setSleepStopTime(new Date());
    setIsRunning(false);
    // When sleep is stopped, set awake session begins
    setWakeStartTime(new Date());
    if (sleepStartTime && stopTimeForLog) {
      const newWindow = {
        id: sleepStartTime.getTime().toString(),
        startTime: sleepStartTime,
        stopTime: stopTimeForLog,
        isSleep,
        note: ''
      };
      setWindows([...windows, newWindow]);
    }
    setIsSleep(false);
  };

  const handleShowLog = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSleepTypeChange = (newValue: string) => {
    setIsNap(newValue === 'nap');
  };

  const handleCribStart = () => {
    setCribStartTime(new Date());
  };

  const handleCribStop = () => {
    setCribStopTime(new Date());
  };

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

  const saveSleepSession = async () => {
    if (isRunning) {
      Alert.alert('', 'Please stop the timer before saving the log');
      return;
    }
    const sleepDuration =
      (windows[windows.length - 1].stopTime.getTime() -
        windows[0].startTime.getTime()) /
      (1000 * 60);
    if (sleepDuration < 1) {
      Alert.alert('', 'Please log at least 1 minute of sleep');
      return;
    }
    const newSleepData = {
      ...sleepData,
      startTime: windows[0].startTime,
      endTime: windows[windows.length - 1].stopTime,
      type: isNap ? 'nap' : 'night_sleep',
      cribStartTime,
      cribStopTime
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
      navigation.goBack();
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: 'white',
        paddingHorizontal: '7%'
      }}>
      <View style={styles.timerContainer}>
        <TouchableOpacity
          style={styles.manualNavButton}
          onPress={() => {
            navigation.navigate('ManualSleepTracking');
          }}>
          <Text style={styles.manualNavLabel}>
            Switch to Manual Sleep Tracking
          </Text>
        </TouchableOpacity>
        <SleepTypeSelector
          onValueChange={handleSleepTypeChange}
          style={{ marginTop: 4, marginBottom: 10 }}
        />
        <View style={styles.timerGroup}>
          <TimerDisplay
            style={{ marginBottom: 35 }}
            title="Start Time:"
            time={
              sleepStartTime
                ? sleepStartTime.toLocaleTimeString(undefined, options)
                : new Date().toLocaleTimeString(undefined, options)
            }
          />
          <TimerDisplay
            style={{ marginBottom: 45 }}
            title="Stop Time:"
            time={
              SleepStopTime
                ? SleepStopTime.toLocaleTimeString(undefined, options)
                : new Date().toLocaleTimeString(undefined, options)
            }
          />
          <ElapsedTimeDisplay isRunning={isRunning} />
        </View>
        <TimerButton
          onStart={handleStart}
          onStop={handleStop}
          style={{ marginTop: '14%' }}
        />
        <CribButton
          onStart={handleCribStart}
          onStop={handleCribStop}
          style={{ marginTop: 0, marginBottom: 10, marginLeft: '60%' }}
        />
        <Button
          testID="save-button"
          mode="contained"
          onPress={() => {
            void saveSleepSession();
          }}
          style={styles.saveButtonContainer}
          labelStyle={styles.saveButtonLabel}>
          Save Log
        </Button>
        <ShowMoreButton
          onPress={handleShowLog}
          title="Show Log"
          style={{ marginTop: 20 }}
        />
      </View>
      <View style={styles.logContainer}>
        {windows.map(({ id, startTime, stopTime, isSleep }) => (
          <TouchableOpacity
            key={id}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center'
  },
  timerGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 16
  },
  logContainer: {
    alignItems: 'center',
    marginBottom: '10%'
  },
  saveButtonContainer: {
    width: '100%',
    height: '7%',
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: colors.crimsonRed,
    alignSelf: 'center'
  },
  saveButtonLabel: {
    color: 'white',
    fontSize: 20
  },
  manualNavButton: {
    marginTop: 10,
    marginBottom: 10
  },
  manualNavLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.deepBlue
  }
});

export default SleepTimer;
