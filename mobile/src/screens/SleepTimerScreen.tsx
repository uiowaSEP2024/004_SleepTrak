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
import TimerDisplay from '../components/views/TimerDisplay';
import ElapsedTimeDisplay from '../components/views/ElapsedTimeDisplay';
import ShowMoreButton from '../components/buttons/ShowMoreButton';
import WindowCell from '../components/views/WindowCell';
import SleepTypeSelector from '../components/selectors/SleepTypeSelector';
import BasicButton from '../components/buttons/SaveButton';

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
  const [windows, setWindows] = useState<
    Array<{ id: string; startTime: Date; stopTime: Date; isSleep: boolean }>
  >([]);
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
        isSleep: isSleep
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
        isSleep: isSleep
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

  const saveSleepSession = () => {
    console.log('Save button pressed');
    const sleepBegin = windows[0].startTime;
    const sleepEnd = windows[windows.length - 1].stopTime;
    console.log('Type of Sleep:', isNap ? 'Nap' : 'Night Sleep');
    console.log('Sleep Start Time: ', sleepBegin);
    console.log('Sleep Stop Time: ', sleepEnd);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.timerContainer}>
        <SleepTypeSelector
          onValueChange={handleSleepTypeChange}
          style={{ marginVertical: 40 }}
        />
        <View style={styles.timerGroup}>
          <TimerDisplay
            style={{ marginBottom: 40 }}
            title="Start Time:"
            time={sleepStartTime ? sleepStartTime.toLocaleTimeString() : ''}
          />
          <TimerDisplay
            title="Stop Time:"
            time={SleepStopTime ? SleepStopTime.toLocaleTimeString() : ''}
          />
        </View>
        <ElapsedTimeDisplay
          isRunning={isRunning}
          style={{ marginVertical: 20 }}
        />
        <TimerButton
          onStart={handleStart}
          onStop={handleStop}
          style={{ marginVertical: 40 }}
        />
        <ShowMoreButton
          onPress={handleShowLog}
          title="Show Log"
          style={{ marginVertical: 30 }}
        />
      </View>
      <View style={styles.logContainer}>
        <FlatList
          data={windows}
          renderItem={({ item: { startTime, stopTime, isSleep } }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditWindowScreen', {
                  startTime,
                  stopTime,
                  isSleep
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
