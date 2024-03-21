import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MedicineTrackingScreen from '../../src/screens/MedicineTrackingScreen';
import { useNavigation } from '@react-navigation/native';
import { fetchUserData, createMedicine, createEvent } from '../../src/utils/db';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('../../src/utils/db', () => ({
  fetchUserData: jest.fn(),
  createMedicine: jest.fn(),
  createEvent: jest.fn()
}));

describe('MedicineTrackingScreen', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue({ goBack: jest.fn() });
    fetchUserData.mockResolvedValue({ medicines: [], userId: '1' });
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<MedicineTrackingScreen />);
    expect(getByTestId('date-time-picker-button')).toBeTruthy();
    expect(getByTestId('medicine-type-picker')).toBeTruthy();
    expect(getByTestId('unit-picker')).toBeTruthy();
    expect(getByTestId('numeric-input')).toBeTruthy();
  });

  it('handles save button press', async () => {
    const { getByText } = render(<MedicineTrackingScreen />);
    fireEvent.press(getByText('Save'));
    await waitFor(() => {
      expect(createEvent).toHaveBeenCalled();
    });
  });

  it('handles medicine type input', () => {
    const { getByTestId } = render(<MedicineTrackingScreen />);
    fireEvent.changeText(getByTestId('medicine-type-input'), 'New Medicine');
    expect(getByTestId('medicine-type-input').props.value).toBe('New Medicine');
  });

  it('handles numeric input', () => {
    const { getByTestId } = render(<MedicineTrackingScreen />);
    fireEvent.changeText(getByTestId('numeric-input'), '10');
    expect(getByTestId('numeric-input').props.value).toBe('10');
  });

  it('changes the medicine type when a new medicine is input', async () => {
    const { getByTestId } = render(<MedicineTrackingScreen />);
    const medicineTypeInput = getByTestId('medicine-type-input');

    await act(async () => {
      fireEvent.changeText(medicineTypeInput, 'New Medicine');
      await waitFor(() => {
        expect(medicineTypeInput._fiber.memoizedProps.value).toBe(
          'New Medicine'
        );
      });
    });
  });
  it('calls createMedicine when a new medicine is input', async () => {
    const { getByTestId } = render(<MedicineTrackingScreen />);
    const medicineTypeInput = getByTestId('medicine-type-input');

    await act(async () => {
      fireEvent.changeText(medicineTypeInput, 'New Medicine');
      await waitFor(() => {
        expect(createMedicine).toHaveBeenCalled();
      });
    });
  });
  it('fetches user data on mount', async () => {
    render(<MedicineTrackingScreen />);
    await waitFor(() => {
      expect(fetchUserData).toHaveBeenCalled();
    });
  });
  it('opens date-time picker when date-time picker button is pressed', async () => {
    const { getByTestId, getByText } = render(<MedicineTrackingScreen />);
    const dateTimePickerButton = getByTestId('date-time-picker-button');

    await act(async () => {
      fireEvent.press(dateTimePickerButton);
      await waitFor(() => {
        expect(getByText('Mock DateTimePickerModal')).toBeTruthy();
      });
    });
  });
  it('calls createEvent  when save button is pressed', async () => {
    const { getByText, getByTestId } = render(<MedicineTrackingScreen />);
    const medicineTypeInput = getByTestId('medicine-type-input');
    const numericInput = getByTestId('numeric-input');

    await act(async () => {
      fireEvent.changeText(medicineTypeInput, 'New Medicine');
      fireEvent.changeText(numericInput, '10');
      fireEvent.press(getByText('Save'));
      await waitFor(() => {
        expect(createEvent).toHaveBeenCalled();
      });
    });
  });
});
