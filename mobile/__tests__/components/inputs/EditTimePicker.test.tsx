import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditTimePicker from '../../../src/components/inputs/EditTimePicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('react-native-modal-datetime-picker', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return null;
    })
  };
});

describe('EditTimePicker', () => {
  // Mock current time
  beforeEach(() => {
    const currentTime = new Date('2022-01-01T10:00:00');
    jest.useFakeTimers();
    jest.setSystemTime(currentTime.getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <EditTimePicker
        title="Test Title"
        placeholderTime={new Date()}
      />
    );
    expect(getByText('Test Title')).toBeTruthy();
  });

  test('shows date picker when pressed', () => {
    const { getByText } = render(
      <EditTimePicker
        title="Test Title"
        placeholderTime={new Date()}
      />
    );
    fireEvent.press(getByText('10:00 AM'));
    expect(DateTimePickerModal).toHaveBeenCalled();
  });

  test('shows modal when button is pressed', () => {
    const { getByText } = render(
      <EditTimePicker
        title="Test Title"
        placeholderTime={new Date(Date.now())}
      />
    );
    fireEvent.press(getByText('10:00 AM'));
    expect(DateTimePickerModal).toHaveBeenCalled();
  });
});
