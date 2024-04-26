import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

jest.mock('../../src/utils/db', () => ({
  fetchUserData: jest.fn(async () => ({
    userId: '1',
    coachId: '1',
    role: 'test',
    email: 'test@test.com',
    first_name: 'John',
    last_name: 'Doe',
    babies: [
      { babyId: '1', name: 'Baby1' },
      { babyId: '2', name: 'Baby2' }
    ],
    events: [],
    medicines: []
  })),
  fetchOnboardingAnswers: jest.fn(async () => [
    { answerId: '1', questionId: '5', answer_text: 'answer1' },
    { answerId: '2', questionId: '6', answer_text: 'answer2' }
  ]),
  fetchOnboardingQuestions: jest.fn(async () => [
    { questionId: '5', description: 'question1' },
    { questionId: '6', description: 'question2' }
  ]),
  updateOnboardingAnswer: jest.fn()
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

    expect(await findByText('John Doe')).toBeTruthy();
  });

  it('renders "Looking for data..." when user data is not available', async () => {
    jest.mock('../../src/utils/db', () => ({
      fetchUserData: jest.fn(async () => await Promise.resolve(null)),
      fetchOnboardingAnswers: jest.fn(async () => await Promise.resolve([])),
      fetchOnboardingQuestions: jest.fn(async () => await Promise.resolve([])),
      updateOnboardingAnswer: jest.fn(async () => {
        await Promise.resolve();
      })
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

  it('updates onboarding answer when text input changes', async () => {
    const { findByDisplayValue } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const input = await findByDisplayValue('answer1');
    fireEvent.changeText(input, 'New Answer');

    expect(await findByDisplayValue('New Answer')).toBeTruthy();
  });

  it('calls updateOnboardingAnswer when save button is pressed', async () => {
    const { findByText, findByDisplayValue } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const input = await findByDisplayValue('answer1');
    fireEvent.changeText(input, 'New Answer');

    const saveButton = await findByText('Save');
    fireEvent.press(saveButton);
    const { updateOnboardingAnswer } = require('../../src/utils/db');
    expect(updateOnboardingAnswer).toHaveBeenCalled();
  });
});
