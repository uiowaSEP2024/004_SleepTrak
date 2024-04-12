import React from 'react';
import { render } from '@testing-library/react-native';
import EventScreen from '../../src/screens/EventScreen';

describe('EventScreen', () => {
  const mockEvent = {
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    type: 'test',
    amount: '5',
    foodType: 'fruit',
    note: 'test note',
    unit: 'kg',
    medicineType: 'pill',
    owner: 'John',
    cribStartTime: new Date().toISOString(),
    cribStopTime: new Date().toISOString()
  };

  const mockRoute = {
    params: {
      event: mockEvent
    }
  };

  const mockNavigation = {
    navigate: jest.fn()
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <EventScreen
        route={mockRoute}
        navigation={mockNavigation}
      />
    );

    expect(getByText('Test')).toBeTruthy();
    expect(getByText('Start Time:')).toBeTruthy();
    expect(getByText('End Time:')).toBeTruthy();
  });

  it('renders "No event found" when event is null', () => {
    const { getByText } = render(
      <EventScreen
        route={{ params: { event: null } }}
        navigation={mockNavigation}
      />
    );

    expect(getByText('No event found')).toBeTruthy();
  });
});
