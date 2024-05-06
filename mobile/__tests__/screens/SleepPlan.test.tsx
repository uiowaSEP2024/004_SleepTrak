import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SleepPlanScreen from '../../src/screens/SleepPlan';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fetchPlan } from '../../src/utils/db';

jest.mock('../../src/utils/db', () => ({
  fetchPlan: jest.fn()
}));
const Stack = createStackNavigator();

describe('Setting', () => {
  it('renders without crashing', () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SleepPlan"
            component={SleepPlanScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  });

  it('displays sleep plan when available', async () => {
    const mockPlan = {
      reminders: [
        {
          reminderId: '1',
          description: 'Test Reminder',
          startTime: new Date().getTime()
        }
      ]
    };

    (fetchPlan as jest.Mock).mockResolvedValue({
      mockPlan
    });

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SleepPlan"
            component={SleepPlanScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(fetchPlan).toHaveBeenCalled();
    });
  });

  it('displays "No events found." when there is no sleep plan', async () => {
    (fetchPlan as jest.Mock).mockResolvedValueOnce(null);

    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SleepPlan"
            component={SleepPlanScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('No events found.')).toBeTruthy();
    });
  });
});
