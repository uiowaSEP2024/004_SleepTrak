import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SleepTimer from '../../src/screens/SleepTimerScreen';
import { useNavigation } from '@react-navigation/native';
import type { RenderAPI } from '@testing-library/react-native';

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('../../src/utils/localDb', () => ({
  saveEvent: jest.fn(),
  saveSleepWindow: jest.fn()
}));

jest.mock('../../src/utils/syncQueue', () => ({
  addToSyncQueue: jest.fn(),
  syncData: jest.fn()
}));

jest.mock('../../src/utils/auth', () => ({
  getUserCredentials: jest.fn(),
  getAuth0User: jest.fn()
}));

// const Stack = createNativeStackNavigator();
let renderResult: RenderAPI;
describe('SleepTimerScreen', () => {
  // Mock current time
  beforeEach(() => {
    renderResult = render(<SleepTimer />);
    useNavigation.mockReturnValue({ navigate: jest.fn() });
    const currentTime = new Date('2022-01-01T10:00:00');
    jest.useFakeTimers();
    jest.setSystemTime(currentTime.getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Timer button alternates between Start and Stop accordingly', async () => {
    const { findByTestId, getByTestId } = renderResult;
    let button = getByTestId('start-button');

    // On first press button should change to stop
    await act(async () => {
      fireEvent.press(button);
    });
    button = await findByTestId('stop-button');
    expect(button).toBeDefined();

    // On second press button should change to start
    await act(async () => {
      fireEvent.press(button);
    });
    button = getByTestId('start-button');
    expect(button).toBeDefined();
  });

  test('Start time is correctly displayed when the Start button is pressed', async () => {
    const { getByTestId, findByTestId, findAllByText } = renderResult;
    const startButton = getByTestId('start-button');
    await act(async () => {
      fireEvent.press(startButton);
      jest.runAllTimers();
    });
    const stopButton = await findByTestId('stop-button');
    expect(stopButton).toBeDefined();
    const startTimeDisplay = await findAllByText(/10:00 AM/);
    expect(startTimeDisplay.length).toBe(2);
  });

  test('Stop time is correctly displayed and new window cell is created when the Stop button is pressed', async () => {
    const { getByTestId, findByTestId, getAllByText } = renderResult;
    let startButton = getByTestId('start-button');

    // Press start button
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton = await findByTestId('stop-button');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton);
      jest.runOnlyPendingTimers();
    });
    startButton = await findByTestId('start-button');
    expect(startButton).toBeDefined();
    const startTimeDisplay = getAllByText(/10:00(:0[0-2])? AM/);
    const stopTimeDisplay = getAllByText(/10:30(:0[0-2])? AM/);
    expect(startTimeDisplay.length).toBe(2);
    expect(stopTimeDisplay.length).toBe(2);
  });

  test('Elapsed time is correctly displayed when the timer is stopped', async () => {
    const { getByTestId, findByTestId, findByText } = renderResult;
    let startButton = getByTestId('start-button');

    // Press start button
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton = await findByTestId('stop-button');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton);
      jest.runOnlyPendingTimers();
    });
    startButton = await findByTestId('start-button');
    expect(startButton).toBeDefined();
    const elapsedTimeDisplay = await findByText(/00:30:0[0-1]/);
    expect(elapsedTimeDisplay).toBeDefined();
  });

  test('Wake window cell is created between each sleep session', async () => {
    const { getByTestId, findByTestId, getAllByText } = renderResult;
    let startButton = getByTestId('start-button');

    // Press start button
    await act(async () => {
      fireEvent.press(startButton);
      jest.runOnlyPendingTimers();
    });
    const stopButton = await findByTestId('stop-button');

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
    const stopButton2 = await findByTestId('stop-button');

    // Advance the mocked time by 30 minutes and press stop button
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireEvent.press(stopButton2);
      jest.runOnlyPendingTimers();
    });
    startButton = await findByTestId('start-button');
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
