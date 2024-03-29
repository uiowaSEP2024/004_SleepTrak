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
  FlatList,
  TouchableOpacity
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
import BasicButton from '../components/buttons/SaveButton';
import { createSleepEvent } from '../utils/db';
import { saveEvent, saveSleepWindow } from '../utils/localDb';
import { v4 as uuidv4 } from 'uuid';

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
        isSleep: isSleep,
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
        isSleep: isSleep,
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

  const saveSleepSession = () => {
    const newSleepData = {
      ...sleepData,
      startTime: cribStartTime ?? windows[0].startTime,
      endTime: cribStopTime ?? windows[windows.length - 1].stopTime,
      type: isNap ? 'nap' : 'night_sleep'
    };
    setSleepData(newSleepData);
    const sleepDataLocal = {
      ...newSleepData,
      eventId: uuidv4(),
      startTime: newSleepData.startTime.toISOString(),
      endTime: newSleepData.endTime.toISOString()
    };
    saveEvent(sleepDataLocal);
    for (const window of windows) {
      saveSleepWindow({
        ...window,
        windowId: window.id,
        eventId: sleepDataLocal.eventId,
        startTime: window.startTime.toISOString(),
        stopTime: window.stopTime.toISOString()
      });
    }
    void createSleepEvent(newSleepData, windows);
    setWindows([]);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
      <View style={styles.timerContainer}>
        <SleepTypeSelector
          onValueChange={handleSleepTypeChange}
          style={{ marginVertical: 40 }}
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
            style={{ marginBottom: 35 }}
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
          style={{ marginVertical: 20 }}
        />
        <CribButton
          onStart={handleCribStart}
          onStop={handleCribStop}
          style={{ marginTop: 0, marginBottom: 40 }}
        />
        <ShowMoreButton
          onPress={handleShowLog}
          title="Show Log"
          style={{ marginTop: 20 }}
        />
      </View>
      <View style={styles.logContainer}>
        <FlatList
          data={windows}
          renderItem={({ item: { id, startTime, stopTime, isSleep } }) => (
            <TouchableOpacity
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
          )}
          keyExtractor={(window) => window.id}
        />
        <BasicButton
          onPress={() => {
            saveSleepSession();
          }}
          title="Save Log"
          style={{ marginTop: 20, marginBottom: 40 }}
        />
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
    alignItems: 'center',
    marginVertical: 20
  },
  logContainer: {
    alignItems: 'center'
  }
});

export default SleepTimer;
