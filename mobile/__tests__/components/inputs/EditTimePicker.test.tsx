import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import type { RenderAPI } from '@testing-library/react-native';
import EditTimePicker from '../../../src/components/inputs/EditTimePicker';
import 'react-native-modal-datetime-picker';

jest.mock('expo-font');
jest.mock('expo-asset');

describe('EditTimePicker', () => {
  let component: RenderAPI;
  // Mock current time
  beforeEach(() => {
    const currentTime = new Date('2022-01-01T10:00:00');
    jest.useFakeTimers();
    jest.setSystemTime(currentTime.getTime());
    component = render(
      <EditTimePicker
        title="Test Title"
        placeholderTime={new Date()}
      />
    );
  });

  afterEach(() => {
    component.unmount();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders correctly', () => {
    const { getByText } = component;
    expect(getByText('Test Title')).toBeDefined();
  });

  test('shows date picker on press', () => {
    const { getByText } = component;
    fireEvent.press(getByText('10:00 AM'));
    expect(getByText('Confirm')).toBeDefined();
    expect(getByText('Cancel')).toBeDefined();
  });

  test('hides date picker on cancel without changing time', async () => {
    const { getByText, queryByText } = component;
    fireEvent.press(getByText('10:00 AM'));
    fireEvent.press(getByText('Cancel'));
    await waitFor(() => {
      expect(queryByText('Confirm')).toBeNull();
      expect(queryByText('Cancel')).toBeNull();
    });
    expect(queryByText('10:00 AM')).toBeDefined();
  });

  test('hides date picker on confirm with changed time', async () => {
    const { getByText } = component;
    fireEvent.press(getByText('10:00 AM'));
    fireEvent.press(getByText('Confirm'));
    expect(getByText('11:00 AM')).toBeTruthy();
  });
});
