import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditWindowScreen from '../../src/screens/EditWindowScreen';
import { useNavigation } from '@react-navigation/native';

jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

describe('EditWindowScreen', () => {
  const mockRoute = {
    key: 'mockKey',
    name: 'EditWindowScreen' as const,
    params: {
      id: '1',
      startTime: new Date('2022-01-01T10:00:00'),
      stopTime: new Date('2022-01-01T12:00:00'),
      isSleep: false,
      onWindowEdit: () => {},
      onWindowDelete: () => {}
    }
  };

  beforeEach(() => {
    useNavigation.mockReturnValue({ goBack: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the start time and stop time', () => {
    const { getByText } = render(<EditWindowScreen route={mockRoute} />);

    expect(getByText('Start Time')).toBeTruthy();
    expect(getByText('Stop Time')).toBeTruthy();
  });

  test('should render the NotesTextInput component', () => {
    const { getByTestId } = render(<EditWindowScreen route={mockRoute} />);

    expect(getByTestId('notesTextInput')).toBeTruthy();
  });

  test('should render the save and delete button', () => {
    const { getByText } = render(<EditWindowScreen route={mockRoute} />);

    expect(getByText('Save')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  test('should call the onPress function when the save button is pressed', () => {
    const { getByText } = render(<EditWindowScreen route={mockRoute} />);

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
    // Write logic to test the onPress function once database is set
  });

  test('should call the onPress function when the Delete button is pressed', () => {
    const { getByText } = render(<EditWindowScreen route={mockRoute} />);

    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);
    // Write logic to test the onPress function once database is set
  });
});
