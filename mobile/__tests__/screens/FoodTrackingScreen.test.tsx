import React from 'react';
// import { NumericInput, DateTimePicker, FoodTypePicker, UnitPicker, FoodTrackingScreen } from '../../src/screens/FoodTrackingScreen';
import FoodTrackingScreen from '../../src/screens/FoodTrackingScreen';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { saveEvent } from '../../src/utils/localDb';

jest.mock('../../src/utils/localDb', () => ({
  saveEvent: jest.fn()
}));

jest.mock('../../src/utils/syncQueue', () => ({
  addToSyncQueue: jest.fn(),
  syncData: jest.fn()
}));

jest.mock('../../src/utils/auth', () => ({
  getUserCredentials: jest.fn(),
  getAuth0User: jest.fn()
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));
jest.mock('../../src/utils/auth', () => ({
  getUserCredentials: jest.fn(),
  getAuth0User: jest.fn()
}));

describe('FoodTrackingScreen', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue({ navigate: jest.fn() });
    saveEvent.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<FoodTrackingScreen />);

    expect(getByText('Save')).toBeTruthy();
  });

  it('handles save button press', async () => {
    const { getByText } = render(<FoodTrackingScreen />);

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(saveEvent).toHaveBeenCalledTimes(1);
    });
  });

  it('NumericInput responds to input', async () => {
    const { getByTestId } = render(<FoodTrackingScreen />);
    const input = getByTestId('numeric-input');
    fireEvent.changeText(input, '5');
    await waitFor(() => {
      expect(input.props.value).toBe('5');
    });
  });

  it('DateTimePicker responds to input', async () => {
    const { findByTestId } = render(<FoodTrackingScreen />);
    const button = await findByTestId('date-time-picker-button');
    fireEvent.press(button);
    await waitFor(() => {
      expect(findByTestId('date-time-picker-modal')).toBeTruthy();
    });
  });

  it('UnitPicker responds to input', async () => {
    const { getByTestId } = render(<FoodTrackingScreen />);
    const button = getByTestId('unit-picker-button-ml');
    fireEvent.press(button);
    await waitFor(() => {
      expect(getByTestId('unit-picker').props.children.props.value).toBe('ml');
    });
  });
});
