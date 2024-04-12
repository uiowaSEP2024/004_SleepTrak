import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../src/screens/HomeScreen';
import { fetchUserData } from '../../src/utils/db';
import { Text } from 'react-native';

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('../../src/utils/db', () => {
  return {
    fetchUserData: jest.fn()
  };
});

jest.mock('../../src/utils/notifications', () => {
  return {
    generateNotifications: jest.fn(async () => await Promise.resolve([]))
  };
});

const Stack = createStackNavigator();

describe('HomeScreen', () => {
  beforeEach(() => {
    fetchUserData.mockClear();
  });

  const mockUserData = {
    events: [
      {
        type: 'Event 1',
        startTime: new Date().toISOString()
      },
      {
        type: 'Event 2',
        startTime: new Date().toISOString()
      }
    ]
  };

  it('renders correctly with user data', async () => {
    fetchUserData.mockResolvedValueOnce(mockUserData);

    const { getByText, findAllByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await act(async () => {
      expect(fetchUserData).toHaveBeenCalledTimes(1);
      expect(getByText('View all')).toBeTruthy();
      expect(getByText('Next Up')).toBeTruthy();
      expect(getByText('Add Event')).toBeTruthy();
      expect(getByText('Sleep')).toBeTruthy();
      expect(getByText('Feeding')).toBeTruthy();
      const events = await findAllByText(/Event/);
      expect(events.length).toBeGreaterThan(0);
    });
  });

  it('navigates to Events screen on View all press', async () => {
    fetchUserData.mockResolvedValueOnce(mockUserData);

    const { findByText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Events"
            component={() => <Text>Events Screen</Text>}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    const button = await findByText('View all');
    fireEvent.press(button);

    await act(async () => {
      expect(getByText('Events Screen')).toBeTruthy();
    });
  });

  it('navigates to SleepTimer screen on Sleep button press', async () => {
    fetchUserData.mockResolvedValueOnce(mockUserData);

    const { findByText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="SleepTimer"
            component={() => <Text>SleepTimer Screen</Text>}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    const button = await findByText('Sleep');
    fireEvent.press(button);

    await act(async () => {
      expect(getByText('SleepTimer Screen')).toBeTruthy();
    });
  });

  it('navigates to FoodTrackingScreen screen on Feeding button press', async () => {
    fetchUserData.mockResolvedValueOnce(mockUserData);

    const { findByText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="FoodTrackingScreen"
            component={() => <Text>FoodTrackingScreen Screen</Text>}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    const button = await findByText('Feeding');
    fireEvent.press(button);
    await act(async () => {
      expect(getByText('FoodTrackingScreen Screen')).toBeTruthy();
    });
  });
});
