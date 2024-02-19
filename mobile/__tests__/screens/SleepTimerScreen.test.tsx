import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SleepTimer from '../../src/screens/SleepTimerScreen';

describe('SleepTimerScreen', () => {
  // Mock current time
  beforeAll(() => {
    const currentTime = new Date('2022-01-01T10:00:00');
    jest.useFakeTimers();
    jest.setSystemTime(currentTime.getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Timer button alternates between Start and Stop accordingly', () => {
    const { getByText } = render(<SleepTimer />);
    const button = getByText('Start');

    // On first press button should change to stop
    fireEvent.press(button);
    expect(button.props.children).toBe('Stop');

    // On second press button should change to start
    fireEvent.press(button);
    expect(button.props.children).toBe('Start');
  });

  test('Start time is correctly displayed when the Start button is pressed', () => {
    const { getByText } = render(<SleepTimer />);
    expect(getByText('Start time:')).toBeDefined();
    const startButton = getByText('Start');
    fireEvent.press(startButton);
    expect(getByText('Start time: 10:00:00 AM')).toBeDefined();
  });

  test('Stop time is correctly displayed when the Stop button is pressed', () => {
    const { getByText } = render(<SleepTimer />);
    const startButton = getByText('Start');
    fireEvent.press(startButton);

    // Advance the mocked time by 30 minutes
    jest.advanceTimersByTime(30 * 60 * 1000);

    const stopButton = getByText('Stop');
    fireEvent.press(stopButton);
    expect(getByText('Stop time: 10:30:00 AM')).toBeDefined();
  });

  test('stops timer when stop button is pressed', () => {
    const { getByText } = render(<SleepTimer />);
    const startButton = getByText('Start');
    fireEvent.press(startButton);
    const stopButton = getByText('Stop');
    fireEvent.press(stopButton);
    expect(getByText(/Stop time:/)).toBeDefined();
  });
});
