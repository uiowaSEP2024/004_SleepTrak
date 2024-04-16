import React from 'react';
import { render } from '@testing-library/react-native';
import StatisticScreen from '../src/screens/StatisticScreen';
import type { StatisticStackParamList } from '../src/navigations/StatisticStack';
import type { RouteProp } from '@react-navigation/native';

describe('StatisticScreen', () => {
  const route: RouteProp<StatisticStackParamList, 'StatisticScreen'> = {
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

  it('renders correctly', () => {
    const { getByText } = render(<StatisticScreen route={route} />);
    expect(getByText('Statistic Screen')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });
});
