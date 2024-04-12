import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingScreen from '../../src/screens/OnboardingScreen';
import {
  fetchOnboardingQuestionsForScreen,
  createUser,
  createBaby,
  createOnboardingAnswers
} from '../../src/utils/db';
import { useNavigation } from '@react-navigation/native';

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('../../src/utils/db', () => ({
  createUser: jest.fn(),
  createBaby: jest.fn(),
  createOnboardingAnswers: jest.fn(),
  fetchOnboardingQuestionsForScreen: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue({ navigate: jest.fn() });
  });

  it('renders correctly', async () => {
    fetchOnboardingQuestionsForScreen.mockResolvedValueOnce([
      { description: 'Test question 1', type: 'yes-no', questionId: 1 }
    ]);

    const { findByText } = render(<OnboardingScreen />);
    await findByText('Test question 1');
  });

  it('navigates to the next screen when the next button is pressed', async () => {
    fetchOnboardingQuestionsForScreen.mockImplementation((input) => {
      switch (input) {
        case 1:
          return [
            { description: 'Test question 1', type: 'yes-no', questionId: 1 }
          ];
        case 2:
          return [
            { description: 'Test question 2', type: 'yes-no', questionId: 1 }
          ];
        default:
          return [];
      }
    });

    const { findByTestId, findByText } = render(<OnboardingScreen />);
    const nextButton = await findByTestId('next-button');

    await findByText('Test question 1');
    fireEvent.press(nextButton);
    await findByText('Test question 2');
  });

  it('renders the correct question component based on the question type', async () => {
    fetchOnboardingQuestionsForScreen.mockResolvedValueOnce([
      { description: 'Test question 1', type: 'yes-no', questionId: 1 },
      { description: 'Test question 2', type: 'date', questionId: 2 },
      { description: 'Test question 3', type: 'number', questionId: 3 },
      { description: 'Test question 4', type: 'small-text', questionId: 4 },
      { description: 'Test question 5', type: 'large-text', questionId: 5 }
    ]);

    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <OnboardingScreen />
    );

    await waitFor(() => getByPlaceholderText('Enter number'));
    await waitFor(() => getByText('Yes'));
    await waitFor(() => getByText('No'));
    await waitFor(() => getAllByPlaceholderText('Enter text'));
    await waitFor(() => getByText('Press to select date'));
  });

  it('updates the progress bar as the user progresses through the screens', async () => {
    fetchOnboardingQuestionsForScreen.mockResolvedValueOnce([
      { description: 'Test question 1', type: 'yes-no', questionId: 1 }
    ]);

    const { queryByTestId, findByTestId } = render(<OnboardingScreen />);

    const progressBar = await findByTestId('progress-bar');
    expect(progressBar.props.accessibilityValue.now).toBe(0);

    let nextButton = queryByTestId('next-button');
    let submitButton = queryByTestId('submit-button');

    while (!submitButton && nextButton) {
      fireEvent.press(nextButton);
      nextButton = queryByTestId('next-button');
      submitButton = queryByTestId('submit-button');
    }

    await waitFor(() => {
      expect(progressBar.props.accessibilityValue.now).toBeGreaterThan(0);
    });
  });

  it('displays an activity indicator while the onboarding wrap up is in progress', async () => {
    const { findByTestId, queryByTestId } = render(<OnboardingScreen />);

    const onboardingWrapUp = jest.fn();
    OnboardingScreen.prototype.onboardingWrapUp = onboardingWrapUp;

    fetchOnboardingQuestionsForScreen.mockResolvedValueOnce([
      { description: 'Test question 1', type: 'yes-no', questionId: 1 }
    ]);

    let nextButton = queryByTestId('next-button');
    let submitButton = queryByTestId('submit-button');

    while (!submitButton && nextButton) {
      fireEvent.press(nextButton);
      nextButton = queryByTestId('next-button');
      submitButton = queryByTestId('submit-button');
    }

    if (submitButton) {
      fireEvent.press(submitButton);
    }

    await findByTestId('activity-indicator');
  });
  it('calls onboardingWrapUp when screenNumber > TOTAL_SCREENS', async () => {
    // Mock the onboardingWrapUp function
    const { queryByTestId } = render(<OnboardingScreen />);

    let nextButton = queryByTestId('next-button');
    let submitButton = queryByTestId('submit-button');

    while (!submitButton && nextButton) {
      fireEvent.press(nextButton);
      nextButton = queryByTestId('next-button');
      submitButton = queryByTestId('submit-button');
    }

    if (submitButton) {
      fireEvent.press(submitButton);
    }

    // Check that the createUser, createBaby, and createOnboardingAnswers functions were called
    await waitFor(() => {
      expect(createUser).toHaveBeenCalled();
      expect(createBaby).toHaveBeenCalled();
      expect(createOnboardingAnswers).toHaveBeenCalled();
    });
  });
});
