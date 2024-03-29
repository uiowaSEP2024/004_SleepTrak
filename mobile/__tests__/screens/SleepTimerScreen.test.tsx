import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SleepTimer from '../../src/screens/SleepTimerScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RenderAPI } from '@testing-library/react-native';

jest.mock('expo-font');
jest.mock('expo-asset');

const Stack = createNativeStackNavigator();
let renderResult: RenderAPI;

describe('SleepTimerScreen', () => {
  // Mock current time
  beforeEach(() => {
    const currentTime = new Date('2022-01-01T10:00:00');
    jest.useFakeTimers();
    jest.setSystemTime(currentTime.getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    renderResult = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SleepTimer"
            component={SleepTimer}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Timer button alternates between Start and Stop accordingly', async () => {
    const { getByText, findByText } = renderResult;
    let button = getByText('Start');

    // On first press button should change to stop
    await act(async () => {
      fireEvent.press(button);
    });
    button = await findByText('Stop');
    expect(button.props.children).toBe('Stop');

    // On second press button should change to start
    await act(async () => {
      fireEvent.press(button);
    });
    expect(button.props.children).toBe('Start');
  });

  test('Start time is correctly displayed when the Start button is pressed', async () => {
    const { getByText, findByText } = renderResult;
    const startButton = getByText('Start');
    await act(async () => {
      fireEvent.press(startButton);
      jest.runAllTimers();
    });
    const stopButton = await findByText('Stop');
    expect(stopButton).toBeDefined();
    const startTimeDisplay = await findByText(/10:00:00 AM/);
    expect(startTimeDisplay).toBeDefined();
  });

  test('Stop time is correctly displayed and new window cell is created when the Stop button is pressed', async () => {
    const { getByText, findByText, getAllByText } = renderResult;
    let startButton = getByText('Start');

    // Press start button
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton = await findByText('Stop');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton);
      jest.runOnlyPendingTimers();
    });
    startButton = await findByText('Start');
    expect(startButton).toBeDefined();
    const startTimeDisplay = getAllByText(/10:00(:0[0-2])? AM/);
    const stopTimeDisplay = getAllByText(/10:30(:0[0-2])? AM/);
    expect(startTimeDisplay.length).toBe(2);
    expect(stopTimeDisplay.length).toBe(2);
  });

  test('Elapsed time is correctly displayed when the timer is stopped', async () => {
    const { getByText, findByText } = renderResult;
    let startButton = getByText('Start');

    // Press start button
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton = await findByText('Stop');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton);
      jest.runOnlyPendingTimers();
    });
    startButton = await findByText('Start');
    expect(startButton).toBeDefined();
    const elapsedTimeDisplay = await findByText(/Elapsed Time: 00:30:0[0-1]/);
    expect(elapsedTimeDisplay).toBeDefined();
  });

  test('Wake window cell is created between each sleep session', async () => {
    const { getByText, findByText, getAllByText } = renderResult;
    let startButton = getByText('Start');

    // Press start button
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton = await findByText('Stop');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton);
      jest.runOnlyPendingTimers();
    });

    // Advance mock time by 30 minutes while the baby is awake
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
    });

    // Press start button again
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton2 = await findByText('Stop');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton2);
      jest.runOnlyPendingTimers();
    });
    startButton = await findByText('Start');
    expect(startButton).toBeDefined();

    // Check all time slots
    const timeDisplay1 = getAllByText(/10:00 AM/);
    const timeDisplay2 = getAllByText(/10:30 AM/);
    const timeDisplay3 = getAllByText(/11:00(:0[0-2])? AM/);
    const timeDisplay4 = getAllByText(/11:30(:0[0-2])? AM/);
    expect(timeDisplay1.length).toBe(1);
    expect(timeDisplay2.length).toBe(2);
    expect(timeDisplay3.length).toBe(3);
    expect(timeDisplay4.length).toBe(2);
  });
});
