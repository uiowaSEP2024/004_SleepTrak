import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import Setting from '../../src/screens/SettingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('../../src/utils/db', () => ({
  fetchUserData: jest.fn().mockResolvedValue({ babies: [{ id: 1 }] })
}));

describe('Setting', () => {
  it('renders without crashing', () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Setting"
            component={Setting}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  });

  it('navigates to Files screen on files button press', async () => {
    const { findByText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Setting"
            component={Setting}
          />
          <Stack.Screen
            name="FilesScreen"
            component={() => <Text>Files Screen</Text>}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    const button = await findByText('View Documents');
    fireEvent.press(button);

    await act(async () => {
      expect(getByText('Files Screen')).toBeTruthy();
    });
  });
});
