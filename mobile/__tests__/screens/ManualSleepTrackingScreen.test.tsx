import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ManualSleepTrackingScreen from '../../src/screens/ManualSleepTrackingScreen';
import { saveEvent, saveSleepWindow } from '../../src/utils/localDb';
import { addToSyncQueue, syncData } from '../../src/utils/syncQueue';
import { localize } from '../../src/utils/bridge';
import { useNavigation } from '@react-navigation/native';

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('@react-navigation/native');

jest.mock('../../src/utils/localDb', () => ({
  saveEvent: jest.fn(),
  saveSleepWindow: jest.fn()
}));

jest.mock('../../src/utils/syncQueue', () => ({
  addToSyncQueue: jest.fn(),
  syncData: jest.fn()
}));

jest.mock('../../src/utils/bridge', () => ({
  localize: jest.fn(() => ({ eventId: '1' }))
}));

jest.mock('../../src/utils/auth', () => ({
  getUserCredentials: jest.fn(),
  getAuth0User: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

type MockEditTimePickerProps = {
  title: string;
  onTimeChange: (time: Date) => void;
  testID: string;
};

jest.mock('../../src/components/inputs/EditTimePicker', () => {
  const MockEditTimePicker: React.FC<MockEditTimePickerProps> = ({
    title,
    onTimeChange,
    testID
  }) => {
    const mockTime =
      title === 'Start Time'
        ? new Date(2022, 1, 1, 14, 0)
        : new Date(2022, 1, 1, 15, 0);

    return (
      <button
        onClick={() => {
          onTimeChange(mockTime);
        }}
        data-testid={testID}>
        {title}:{' '}
        {mockTime.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </button>
    );
  };
  return MockEditTimePicker;
});

describe('ManualSleepTrackingScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    useNavigation.mockReturnValue({ goBack: jest.fn() });
  });
  it('should render', () => {
    const { getByText } = render(<ManualSleepTrackingScreen />);
    expect(getByText('Add Window')).toBeTruthy();
    expect(getByText('Save Sleep')).toBeTruthy();
  });

  it('adds a sleep window', async () => {
    const { getByText } = render(<ManualSleepTrackingScreen />);
    fireEvent.press(getByText('Add Window'));
    expect(getByText('SLEEP')).toBeTruthy();
  });

  it('adds a sleep window and a wake window from second time', async () => {
    const { getByText } = render(<ManualSleepTrackingScreen />);
    fireEvent.press(getByText('Add Window'));
    expect(getByText('SLEEP')).toBeTruthy();
    fireEvent.press(getByText('Add Window'));
    expect(getByText('AWAKE')).toBeTruthy();
  });

  it('handleSave calls necessary functions with correct arguments', async () => {
    const navigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate });
    const { getByText } = render(<ManualSleepTrackingScreen />);
    const saveButton = getByText('Save Sleep');
    await act(async () => {
      fireEvent.press(getByText('Add Window'));
    });
    fireEvent.press(saveButton);
    await waitFor(() => {
      expect(saveEvent).toHaveBeenCalled();
      expect(localize).toHaveBeenCalled();
      expect(addToSyncQueue).toHaveBeenCalled();
      expect(saveSleepWindow).toHaveBeenCalled();
      expect(syncData).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('pressing on a window cell should navigate to EditWindowScreen', async () => {
    const navigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate });
    const { getByText } = render(<ManualSleepTrackingScreen />);
    await act(async () => {
      fireEvent.press(getByText('Add Window'));
    });
    fireEvent.press(getByText('SLEEP'));
    expect(navigate).toHaveBeenCalledWith(
      'EditWindowScreen',
      expect.any(Object)
    );
  });
});
