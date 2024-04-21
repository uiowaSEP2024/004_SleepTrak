import React from 'react';
import type { ReactNode } from 'react';
import { render } from '@testing-library/react-native';
import StatisticsScreen from '../../src/screens/StatisticsScreen';

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

jest.mock('../../src/components/misc/TransitionHeader', () => ({
  TransitionHeader: ({
    children,
    onBack,
    onForward
  }: {
    children: ReactNode;
    onBack: () => void;
    onForward: () => void;
  }) => (
    <div>
      <button
        data-testid="date-back-button"
        onClick={onBack}>
        Back
      </button>
      <span>{children}</span>
      <button
        data-testid="date-forward-button"
        onClick={onForward}>
        Forward
      </button>
    </div>
  )
}));

describe('<StatisticsScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct title and buttons', async () => {
    const { getByText } = render(<StatisticsScreen />);
    expect(getByText('Night Sleep Statistics')).toBeTruthy();
  });
});
