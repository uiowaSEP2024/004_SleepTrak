import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventScreen from '../../src/screens/EventScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

jest.mock('../../src/utils/db', () => {
  const updateEvent = jest.fn();
  return { updateEvent };
});

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
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Event"
            component={() => (
              <EventScreen
                route={mockRoute}
                navigation={mockNavigation}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('Test')).toBeTruthy();
  });

  it('renders "No event found" when event is null', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Event"
            component={() => (
              <EventScreen
                route={{ params: { event: null } }}
                navigation={mockNavigation}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('No event found')).toBeTruthy();
  });

  it('renders input fields correctly', () => {
    const { getByTestId, queryAllByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Event"
            component={() => (
              <EventScreen
                route={mockRoute}
                navigation={mockNavigation}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByTestId('numeric-input')).toBeTruthy();
    expect(queryAllByTestId('picker')).not.toBeNull();
  });

  it('calls updateEvent when save button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Event"
            component={() => (
              <EventScreen
                route={mockRoute}
                navigation={mockNavigation}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    fireEvent.press(getByText('Save'));
    const { updateEvent } = require('../../src/utils/db');
    expect(updateEvent).toHaveBeenCalled();
  });
});
