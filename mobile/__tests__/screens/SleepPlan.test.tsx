import React from 'react';
import { render } from '@testing-library/react-native';
import SleepPlanScreen from '../../src/screens/SleepPlan';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
});
