import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditWindowScreen from '../../src/screens/EditWindowScreen';

jest.mock('expo-font');
jest.mock('expo-asset');

describe('EditWindowScreen', () => {
  const mockRoute = {
    key: 'mockKey',
    name: 'EditWindowScreen' as const,
    params: {
      startTime: new Date('2022-01-01T10:00:00'),
      stopTime: new Date('2022-01-01T12:00:00'),
      isSleep: false
    }
  };

  test('should render the start time and stop time', () => {
    const { getByText } = render(<EditWindowScreen route={mockRoute} />);

    expect(getByText('Start Time')).toBeTruthy();
    expect(getByText('Stop Time')).toBeTruthy();
  });

  test('should render the NotesTextInput component', () => {
    const { getByTestId } = render(<EditWindowScreen route={mockRoute} />);

    expect(getByTestId('notesTextInput')).toBeTruthy();
  });

  test('should call the onPress function when the save button is pressed', () => {
    const { getByText } = render(<EditWindowScreen route={mockRoute} />);

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
  });
});
