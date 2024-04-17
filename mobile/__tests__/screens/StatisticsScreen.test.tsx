import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StatisticsScreen from '../../src/screens/StatisticsScreen';
import { fetchEvents } from '../../src/utils/db';

// Mock the fetchEvents function
jest.mock('../../src/utils/db', () => ({
  fetchEvents: jest.fn().mockResolvedValue([
    {
      eventId: '1',
      ownerId: '2',
      startTime: new Date('2021-01-01T00:00:00Z'),
      endTime: new Date('2021-01-01T08:00:00Z'),
      type: 'night_sleep'
    },
    {
      eventId: '2',
      ownerId: '2',
      startTime: new Date('2021-01-02T00:00:00Z'),
      endTime: new Date('2021-01-02T08:00:00Z'),
      type: 'nap'
    },
    {
      eventId: '3',
      ownerId: '2',
      startTime: new Date('2021-01-02T03:00:00Z'),
      type: 'feed'
    },
    {
      eventId: '4',
      ownerId: '2',
      startTime: new Date('2021-01-02T09:00:00Z'),
      type: 'feed'
    },
    {
      eventId: '5',
      ownerId: '2',
      startTime: new Date('2021-01-03T09:00:00Z'),
      endTime: new Date('2021-01-03T10:00:00Z'),
      type: 'nap'
    }
  ])
}));

// Mock navigation function
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('<StatisticsScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    const { getByText, findByText } = render(<StatisticsScreen />);

    expect(getByText('Night Sleep')).toBeTruthy();
    expect(getByText('Nap')).toBeTruthy();
    expect(getByText('Feed')).toBeTruthy();

    const nightSleepButton = getByText('Night Sleep');
    fireEvent.press(nightSleepButton);
    await findByText('Night Sleep');
  });

  test('navigation works correctly', async () => {
    const { getByText } = render(<StatisticsScreen />);
    await waitFor(() => {
      expect(fetchEvents).toHaveBeenCalled();
    });
    const nightSleepButton = getByText('Night Sleep');
    const napButton = getByText('Nap');
    const feedButton = getByText('Feed');

    fireEvent.press(nightSleepButton);
    expect(mockNavigate).toHaveBeenCalledWith('StatisticScreen', {
      eventType: 'night_sleep',
      events: [
        {
          eventId: '1',
          ownerId: '2',
          startTime: new Date('2021-01-01T00:00:00Z'),
          endTime: new Date('2021-01-01T08:00:00Z'),
          type: 'night_sleep'
        }
      ]
    });

    fireEvent.press(napButton);
    expect(mockNavigate).toHaveBeenCalledWith('StatisticScreen', {
      eventType: 'nap',
      events: [
        {
          eventId: '2',
          ownerId: '2',
          startTime: new Date('2021-01-02T00:00:00Z'),
          endTime: new Date('2021-01-02T08:00:00Z'),
          type: 'nap'
        },
        {
          eventId: '5',
          ownerId: '2',
          startTime: new Date('2021-01-03T09:00:00Z'),
          endTime: new Date('2021-01-03T10:00:00Z'),
          type: 'nap'
        }
      ]
    });

    fireEvent.press(feedButton);
    expect(mockNavigate).toHaveBeenCalledWith('StatisticScreen', {
      eventType: 'feed',
      events: [
        {
          eventId: '3',
          ownerId: '2',
          startTime: new Date('2021-01-02T03:00:00Z'),
          type: 'feed'
        },
        {
          eventId: '4',
          ownerId: '2',
          startTime: new Date('2021-01-02T09:00:00Z'),
          type: 'feed'
        }
      ]
    });
  });
});
