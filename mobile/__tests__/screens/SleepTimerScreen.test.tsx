import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SleepTrackerScreen from '../../src/screens/SleepTimerScreen';

describe('SleepTrackerScreen', () => {
  test('Timer button alternates between Start and Stop accordingly', () => {
    const { getByText } = render(<SleepTrackerScreen />);
    const button = getByText('Start');

    // On first press button should change to stop
    fireEvent.press(button);
    expect(button.props.children).toBe('Stop');

    // On second press button should change to start
    fireEvent.press(button);
    expect(button.props.children).toBe('Start');
  });
});
