import React from 'react';
import { Text, Linking } from 'react-native';
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
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should call onPress when pressed', async () => {
    jest.mock('react-native', () => {
      const rn = jest.requireActual('react-native');
      rn.Linking = {
        ...rn.Linking,
        openURL: jest.fn(),
        canOpenURL: jest.fn(async () => await Promise.resolve(true))
      };
      return rn;
    });
    const url =
      'https://team4wiki.notion.site/User-Manual-for-Mobile-434e715c87bb4194b10d0fd9d812a47d?pvs=74';
    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Setting"
            component={Setting}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    const button = await findByText('User Manual');
    fireEvent.press(button);
    await act(async () => {
      await Promise.resolve();
    });
    expect((Linking.openURL as jest.Mock).mock.calls[0][0]).toBe(url);
  });
});
