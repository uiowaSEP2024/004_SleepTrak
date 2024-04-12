import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  LoginButton,
  LogoutButton
} from '../../src/components/buttons/AuthButtons';
import { useAuth0 } from 'react-native-auth0';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();
jest.mock('react-native-auth0');

describe('AuthButtons', () => {
  it('should call authorize when LoginButton is pressed', async () => {
    const authorize = jest.fn();
    (useAuth0 as jest.Mock).mockReturnValue({ authorize });

    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LoginButton}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    fireEvent.press(getByText('Log In'));

    expect(authorize).toHaveBeenCalled();
  });

  it('should call clearSession when LogoutButton is pressed', async () => {
    const clearSession = jest.fn();
    (useAuth0 as jest.Mock).mockReturnValue({ clearSession });

    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LogoutButton}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    fireEvent.press(getByText('Log Out'));

    expect(clearSession).toHaveBeenCalled();
  });
});
