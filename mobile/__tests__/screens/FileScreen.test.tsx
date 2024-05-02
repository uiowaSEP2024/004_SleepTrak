import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FileScreen from '../../src/screens/FileScreen';

const Stack = createStackNavigator();
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('react-native-pdf', () => 'Pdf');

describe('FileScreen', () => {
  const renderComponent = (initialParams: Partial<object | undefined>) => {
    return render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="FileScreen"
            component={FileScreen}
            initialParams={initialParams}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  it('renders correctly', () => {
    const { getByText } = renderComponent({
      name: 'Test File',
      fileUrl: 'test_url'
    });

    expect(getByText('Test File')).toBeTruthy();
  });
});
