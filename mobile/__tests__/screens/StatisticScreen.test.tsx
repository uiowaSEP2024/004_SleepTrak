import React from 'react';
import { render } from '@testing-library/react-native';
import StatisticScreen from '../../src/screens/StatisticScreen';
import type { StatisticStackParamList } from '../../src/navigations/StatisticStack';
import type { RouteProp } from '@react-navigation/native';
// import type { RemoteEvent, RemoteSleepWindow } from '../../src/utils/interfaces';

// function generateEvent(eventId: string, type: string, startTime: Date, endTime?: Date | null, sleepWindows?: RemoteSleepWindow[] | null): RemoteEvent {
//   return {
//     eventId: eventId,
//     ownerId: '100',
//     startTime: startTime,
//     endTime: endTime,
//     type: type,
//     sleepWindows: sleepWindows
//   }
// }

const feedRoute: RouteProp<StatisticStackParamList, 'StatisticScreen'> = {
  key: 'StatisticScreen',
  name: 'StatisticScreen',
  params: {
    eventType: 'feed',
    events: [
      {
        eventId: '1',
        ownerId: '2',
        startTime: new Date(),
        type: 'feed'
      },
      {
        eventId: '2',
        ownerId: '2',
        startTime: new Date(),
        type: 'feed'
      }
    ]
  }
};
const napRoute: RouteProp<StatisticStackParamList, 'StatisticScreen'> = {
  key: 'StatisticScreen',
  name: 'StatisticScreen',
  params: {
    eventType: 'nap',
    events: [
      {
        // NAP FROM 13:00 TO 16:00 (3 HOURS) ON 4/15
        eventId: '300',
        ownerId: '2',
        startTime: new Date('2024-04-15T13:00:00'),
        endTime: new Date('2024-04-15T16:00:00'),
        type: 'nap',
        sleepWindows: [
          {
            windowId: '1',
            eventId: '300',
            startTime: new Date('2024-04-15T13:00:00'),
            stopTime: new Date('2024-04-15T14:00:00'),
            isSleep: true,
            note: ''
          },
          {
            windowId: '2',
            eventId: '300',
            startTime: new Date('2024-04-15T14:00:00'),
            stopTime: new Date('2024-04-15T15:00:00'),
            isSleep: false,
            note: ''
          },
          {
            windowId: '3',
            eventId: '300',
            startTime: new Date('2024-04-15T15:00:00'),
            stopTime: new Date('2024-04-15T16:00:00'),
            isSleep: true,
            note: ''
          }
        ]
      },
      {
        // NAP FROM 13:00 TO 16:00 (3 HOURS) ON 4/16
        eventId: '400',
        ownerId: '2',
        startTime: new Date('2024-04-16T13:00:00'),
        endTime: new Date('2024-04-16T16:00:00'),
        type: 'nap',
        sleepWindows: [
          {
            windowId: '4',
            eventId: '400',
            startTime: new Date('2024-04-16T13:00:00'),
            stopTime: new Date('2024-04-16T14:00:00'),
            isSleep: true,
            note: ''
          },
          {
            windowId: '5',
            eventId: '400',
            startTime: new Date('2024-04-15T14:00:00'),
            stopTime: new Date('2024-04-15T15:00:00'),
            isSleep: false,
            note: ''
          },
          {
            windowId: '6',
            eventId: '400',
            startTime: new Date('2024-04-15T15:00:00'),
            stopTime: new Date('2024-04-15T16:00:00'),
            isSleep: true,
            note: ''
          }
        ]
      },
      {
        // NAP FROM 10:00 TO 12:00 (2 HOURS) ON 4/16
        eventId: '500',
        ownerId: '2',
        startTime: new Date('2024-04-16T10:00:00'),
        endTime: new Date('2024-04-16T12:00:00'),
        type: 'nap',
        sleepWindows: [
          {
            windowId: '4',
            eventId: '500',
            startTime: new Date('2024-04-16T10:00:00'),
            stopTime: new Date('2024-04-16T12:00:00'),
            isSleep: true,
            note: ''
          }
        ]
      },
      {
        // NAP FROM 15:00 TO 16:00 (1 HOUR) ON 4/17
        eventId: '600',
        ownerId: '2',
        startTime: new Date('2024-04-16T17:00:00'),
        endTime: new Date('2024-04-16T17:00:00'),
        type: 'nap',
        sleepWindows: [
          {
            windowId: '4',
            eventId: '600',
            startTime: new Date('2024-04-17T15:00:00'),
            stopTime: new Date('2024-04-17T16:00:00'),
            isSleep: true,
            note: ''
          }
        ]
      }
    ]
  }
};
const nightSleepRoute: RouteProp<StatisticStackParamList, 'StatisticScreen'> = {
  key: 'StatisticScreen',
  name: 'StatisticScreen',
  params: {
    eventType: 'night_sleep',
    events: [
      {
        eventId: '1',
        ownerId: '2',
        startTime: new Date(),
        type: 'night_sleep'
      },
      {
        eventId: '2',
        ownerId: '2',
        startTime: new Date(),
        type: 'night_sleep'
      }
    ]
  }
};

const emptyRoute: RouteProp<StatisticStackParamList, 'StatisticScreen'> = {
  key: 'StatisticScreen',
  name: 'StatisticScreen',
  params: {
    eventType: 'feed',
    events: []
  }
};

describe('<StatisticScreen />', () => {
  describe('renders', () => {
    it('correctly with empty events', () => {
      const { getByText } = render(<StatisticScreen route={emptyRoute} />);
      expect(getByText('There are no statistics to display yet')).toBeTruthy();
    });
    it('nap statistic screen correctly', () => {
      const { getByText } = render(<StatisticScreen route={napRoute} />);
      expect(getByText('Nap Statistics')).toBeTruthy();
    });
    it('night sleep statistic screen correctly', () => {
      const { getByText } = render(<StatisticScreen route={nightSleepRoute} />);
      expect(getByText('Night Sleep Statistics')).toBeTruthy();
    });
    it('feed statistic screen correctly', () => {
      const { getByText } = render(<StatisticScreen route={feedRoute} />);
      expect(getByText('Feed Statistics')).toBeTruthy();
    });
  });

  describe('summary card', () => {
    it('renders correctly', () => {
      const { getByText } = render(<StatisticScreen route={napRoute} />);
      expect(getByText('Average Summary')).toBeTruthy();
    });
    it('calculates average nap time correctly', () => {
      const { getByText } = render(<StatisticScreen route={napRoute} />);
      expect(getByText('Nap Time')).toBeTruthy();
      expect(getByText('2 h 15 m')).toBeTruthy();
    });
    it('calculates average nap sleep time correctly', () => {
      const { getByText } = render(<StatisticScreen route={napRoute} />);
      expect(getByText('Nap Time (Sleep)')).toBeTruthy();
      expect(getByText('1 h 45 m')).toBeTruthy();
    });
    it('calculates average number of naps correctly', () => {
      const { getByText } = render(<StatisticScreen route={napRoute} />);
      expect(getByText('Number of Naps')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });
  });
});
