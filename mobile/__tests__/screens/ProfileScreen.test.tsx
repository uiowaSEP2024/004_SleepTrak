import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

jest.mock('../../src/utils/db', () => ({
  fetchUserData: jest.fn(
    async () =>
      await Promise.resolve({
        userId: '1',
        coachId: '1',
        role: 'test',
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        babies: [],
        events: [],
        medicines: []
      })
  )
}));

describe('ProfileScreen', () => {
  it('renders correctly', async () => {
    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(await findByText('Profile')).toBeTruthy();
    expect(await findByText('First Name:')).toBeTruthy();
    expect(await findByText('Last Name:')).toBeTruthy();
    expect(await findByText('Email:')).toBeTruthy();
    expect(await findByText('Role:')).toBeTruthy();
  });

  it('renders "Looking for data..." when user data is not available', async () => {
    jest.mock('../../src/utils/db', () => ({
      fetchUserData: jest.fn(async () => await Promise.resolve(null))
    }));

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(await findByText('Looking for data...')).toBeTruthy();
  });
});
