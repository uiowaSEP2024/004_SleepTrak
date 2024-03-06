import React from 'react';
import { View, Button } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditTimePicker from '../../../src/components/inputs/EditTimePicker';
import DateTimePickerModalMock from '../../../__mocks__/DateTimePickerModalMock';

interface DateTimePickerModalProps {
  isVisible: boolean;
  testID: string;
  children?: React.ReactNode;
  onCancel?: () => void;
}

jest.mock('expo-font');
jest.mock('expo-asset');
jest.doMock('react-native-modal-datetime-picker', () => {
  const DateTimePickerModalMock = ({
    isVisible,
    testID,
    onCancel,
    children
  }: DateTimePickerModalProps) => {
    if (isVisible) {
      return (
        <View testID={testID}>
          {children}
          <Button
            accessibilityLabel="cancelButton"
            onPress={onCancel}
            title="Cancel"
          />
        </View>
      );
    }
    return null;
  };
  return DateTimePickerModalMock;
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

  test('shows the picker when the button is pressed', () => {
    const { getByTestId } = render(
      <EditTimePicker
        title="Test Picker"
        placeholderTime={new Date()}
      />
    );
    fireEvent.press(getByTestId('timePickerButton'));
    expect(getByTestId('time-picker')).toBeTruthy();
  });

  test('hides modal when cancel button is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <EditTimePicker
        title="Test Picker"
        placeholderTime={new Date()}
      />
    );
    fireEvent.press(getByTestId('timePickerButton'));
    expect(getByTestId('time-picker')).toBeTruthy();
    const cancelButton = queryByTestId('cancelButton');
    if (cancelButton) {
      console.log('hellooooooo');
      fireEvent.press(cancelButton);
    }
    expect(queryByTestId('time-picker')).toBeNull();
  });

  // test('hides modal when cancel button is pressed', async () => {
  //   const hidePickerMock = jest.fn();
  //   const { getByTestId, getByText, debug } = render(
  //     <EditTimePicker title="Test Title" placeholderTime={new Date(Date.now())} />
  //   );
  //   fireEvent.press(getByTestId('timePickerButton'));
  //   debug();
  //   await waitFor(() => getByText('Cancel'));
  //   fireEvent.press(getByText('Cancel'));
  //   expect(hidePickerMock).toHaveBeenCalled();
  // });

  // test('handles confirm when handleConfirm is called', () => {
  //   const { getByText } = render(<EditTimePicker title="Test Title" placeholderTime={new Date(Date.now())} />);
  //   fireEvent.press(getByText('10:00 AM'));
  //   fireEvent.press(getByText('Confirm'));
  //   expect(getByText('11:00 AM')).toBeDefined();
  // });
});
