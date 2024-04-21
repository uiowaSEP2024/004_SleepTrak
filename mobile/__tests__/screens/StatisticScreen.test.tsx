import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatisticScreen from '../../src/screens/StatisticScreen';
import type { RemoteEvent } from '../../src/utils/interfaces';

const feedEvents: RemoteEvent[] = [
  {
    eventId: '100',
    ownerId: '2',
    startTime: new Date('2024-04-15T10:00:00Z'),
    type: 'feed'
  },
  {
    eventId: '200',
    ownerId: '2',
    startTime: new Date('2024-04-15T13:00:00Z'),
    type: 'feed'
  },
  {
    eventId: '300',
    ownerId: '2',
    startTime: new Date('2024-04-15T16:00:00Z'),
    type: 'feed'
  },
  {
    eventId: '400',
    ownerId: '2',
    startTime: new Date('2024-04-16T10:00:00Z'),
    type: 'feed'
  },
  {
    eventId: '500',
    ownerId: '2',
    startTime: new Date('2024-04-16T02:00:00Z'),
    type: 'feed'
  }
];

const napEvents: RemoteEvent[] = [
  {
    eventId: '300',
    ownerId: '2',
    startTime: new Date('2024-04-15T13:00:00Z'),
    endTime: new Date('2024-04-15T16:00:00Z'),
    type: 'nap',
    sleepWindows: [
      {
        windowId: '1',
        eventId: '300',
        startTime: new Date('2024-04-15T13:00:00Z'),
        stopTime: new Date('2024-04-15T14:00:00Z'),
        isSleep: true,
        note: ''
      },
      {
        windowId: '2',
        eventId: '300',
        startTime: new Date('2024-04-15T14:00:00Z'),
        stopTime: new Date('2024-04-15T15:00:00Z'),
        isSleep: false,
        note: ''
      },
      {
        windowId: '3',
        eventId: '300',
        startTime: new Date('2024-04-15T15:00:00Z'),
        stopTime: new Date('2024-04-15T16:00:00Z'),
        isSleep: true,
        note: ''
      }
    ]
  },
  {
    eventId: '400',
    ownerId: '2',
    startTime: new Date('2024-04-16T13:00:00Z'),
    endTime: new Date('2024-04-16T16:00:00Z'),
    type: 'nap',
    sleepWindows: [
      {
        windowId: '4',
        eventId: '400',
        startTime: new Date('2024-04-16T13:00:00Z'),
        stopTime: new Date('2024-04-16T14:00:00Z'),
        isSleep: true,
        note: ''
      },
      {
        windowId: '5',
        eventId: '400',
        startTime: new Date('2024-04-16T14:00:00Z'),
        stopTime: new Date('2024-04-16T15:00:00Z'),
        isSleep: false,
        note: ''
      },
      {
        windowId: '6',
        eventId: '400',
        startTime: new Date('2024-04-16T15:00:00Z'),
        stopTime: new Date('2024-04-16T16:00:00Z'),
        isSleep: true,
        note: ''
      }
    ]
  },
  {
    eventId: '500',
    ownerId: '2',
    startTime: new Date('2024-04-16T10:00:00Z'),
    endTime: new Date('2024-04-16T12:00:00Z'),
    type: 'nap',
    sleepWindows: [
      {
        windowId: '4',
        eventId: '500',
        startTime: new Date('2024-04-16T10:00:00Z'),
        stopTime: new Date('2024-04-16T12:00:00Z'),
        isSleep: true,
        note: ''
      }
    ]
  },
  {
    eventId: '600',
    ownerId: '2',
    startTime: new Date('2024-04-17T15:00:00Z'),
    endTime: new Date('2024-04-17T16:00:00Z'),
    type: 'nap',
    sleepWindows: [
      {
        windowId: '4',
        eventId: '600',
        startTime: new Date('2024-04-17T15:00:00Z'),
        stopTime: new Date('2024-04-17T16:00:00Z'),
        isSleep: true,
        note: ''
      }
    ]
  }
];

const nightSleepEvents: RemoteEvent[] = [
  {
    eventId: '300',
    ownerId: '1',
    startTime: new Date('2024-04-14T21:00:00Z'),
    endTime: new Date('2024-04-15T07:00:00Z'),
    type: 'night_sleep',
    sleepWindows: [
      {
        windowId: '1',
        eventId: '300',
        startTime: new Date('2024-04-14T21:00:00Z'),
        stopTime: new Date('2024-04-14T23:00:00Z'),
        isSleep: true,
        note: ''
      },
      {
        windowId: '2',
        eventId: '300',
        startTime: new Date('2024-04-14T23:00:00Z'),
        stopTime: new Date('2024-04-15T01:00:00Z'),
        isSleep: false,
        note: ''
      },
      {
        windowId: '3',
        eventId: '300',
        startTime: new Date('2024-04-15T01:00:00Z'),
        stopTime: new Date('2024-04-15T03:00:00Z'),
        isSleep: true,
        note: ''
      },
      {
        windowId: '4',
        eventId: '300',
        startTime: new Date('2024-04-15T03:00:00Z'),
        stopTime: new Date('2024-04-15T04:00:00Z'),
        isSleep: false,
        note: ''
      },
      {
        windowId: '5',
        eventId: '300',
        startTime: new Date('2024-04-15T04:00:00Z'),
        stopTime: new Date('2024-04-15T07:00:00Z'),
        isSleep: true,
        note: ''
      }
    ]
  },
  {
    eventId: '400',
    ownerId: '1',
    startTime: new Date('2024-04-15T23:00:00Z'),
    endTime: new Date('2024-04-16T06:00:00Z'),
    type: 'night_sleep',
    sleepWindows: [
      {
        windowId: '1',
        eventId: '400',
        startTime: new Date('2024-04-15T23:00:00Z'),
        stopTime: new Date('2024-04-16T6:00:00Z'),
        isSleep: true,
        note: ''
      }
    ]
  }
];

const emptyEvent: RemoteEvent[] = [];

describe('<StatisticScreen />', () => {
  describe('renders', () => {
    it('correctly with empty events', () => {
      const { getByText } = render(<StatisticScreen events={emptyEvent} />);
      expect(getByText('There are no statistics to display yet')).toBeTruthy();
    });
    it('nap statistic screen correctly', () => {
      const { getByText } = render(<StatisticScreen events={napEvents} />);
      expect(getByText('Average Summary')).toBeTruthy();
    });
    it('night sleep statistic screen correctly', () => {
      const { getByText } = render(
        <StatisticScreen events={nightSleepEvents} />
      );
      expect(getByText('Average Summary')).toBeTruthy();
    });
    it('feed statistic screen correctly', () => {
      const { getByText } = render(<StatisticScreen events={feedEvents} />);
      expect(getByText('Average Summary')).toBeTruthy();
    });
  });

  describe('summary card', () => {
    it('renders correctly', () => {
      const { getByText } = render(<StatisticScreen events={napEvents} />);
      expect(getByText('Average Summary')).toBeTruthy();
    });
    it('calculates average nap time correctly', () => {
      const { getByText } = render(<StatisticScreen events={napEvents} />);
      expect(getByText('Nap Time')).toBeTruthy();
      expect(getByText('2 h 15 m')).toBeTruthy();
    });
    it('calculates average nap sleep time correctly', () => {
      const { getByText } = render(<StatisticScreen events={napEvents} />);
      expect(getByText('Nap Time (Sleep)')).toBeTruthy();
      expect(getByText('1 h 45 m')).toBeTruthy();
    });
    it('calculates average number of naps correctly', () => {
      const { getByText } = render(<StatisticScreen events={napEvents} />);
      expect(getByText('Number of Naps per Day')).toBeTruthy();
      expect(getByText('1.3')).toBeTruthy();
    });
    it('calculates average bed time and wake up time correctly', () => {
      const { getByText } = render(
        <StatisticScreen events={nightSleepEvents} />
      );
      expect(getByText('Bed Time')).toBeTruthy();
      expect(getByText('10:00 PM')).toBeTruthy();
    });
    it('calculates average wake up time correctly', () => {
      const { getByText } = render(
        <StatisticScreen events={nightSleepEvents} />
      );
      expect(getByText('Wake Up Time')).toBeTruthy();
      expect(getByText('6:30 AM')).toBeTruthy();
    });
    it('calculates average number of wake up window', () => {
      const { getByText } = render(
        <StatisticScreen events={nightSleepEvents} />
      );
      expect(getByText('Wakings per Night')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });
    it('calculates average number of feeds correctly', () => {
      const { getByText } = render(<StatisticScreen events={feedEvents} />);
      expect(getByText('Number of Feed per Day')).toBeTruthy();
      expect(getByText('2.5')).toBeTruthy();
    });
    it('calculates average number of feeds correctly', () => {
      const { getByText } = render(<StatisticScreen events={feedEvents} />);
      expect(getByText('Number of Feed at Night')).toBeTruthy();
      expect(getByText('0.5')).toBeTruthy();
    });
  });

  describe('chart', () => {
    it('nap chart renders correctly', () => {
      const { getByText } = render(<StatisticScreen events={napEvents} />);
      expect(getByText('Number of Naps per Day')).toBeTruthy();
      fireEvent.press(getByText('Week'));
      expect(getByText('Mon')).toBeTruthy();
      fireEvent.press(getByText('Month'));
      expect(getByText('01')).toBeTruthy();
    });
    it('night sleep chart renders correctly', () => {
      const { getByText } = render(
        <StatisticScreen events={nightSleepEvents} />
      );
      expect(getByText('Number of Wakings per Night')).toBeTruthy();
      fireEvent.press(getByText('Week'));
      expect(getByText('Mon')).toBeTruthy();
      fireEvent.press(getByText('Month'));
      expect(getByText('01')).toBeTruthy();
    });
  });
});
