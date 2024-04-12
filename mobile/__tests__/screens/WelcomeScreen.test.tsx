import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth0 } from 'react-native-auth0';
import { hasOnboarded, hasValidCredentials } from '../../src/utils/auth';
import WelcomeScreen from '../../src/screens/WelcomeScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('react-native-auth0', () => ({
  useAuth0: jest.fn()
}));

jest.mock('../../src/utils/auth', () => ({
  hasOnboarded: jest.fn(),
  hasValidCredentials: jest.fn()
}));

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    useNavigation.mockReturnValue({ navigate: jest.fn() });
    useAuth0.mockReturnValue({ user: {} });
    hasOnboarded.mockResolvedValue(false);
    hasValidCredentials.mockResolvedValue(true);

    const { getByTestId } = render(<WelcomeScreen />);

    expect(getByTestId('welcome-screen')).toBeTruthy();
  });

  it('navigates to Home if user has onboarded', async () => {
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    useAuth0.mockReturnValue({ user: {} });
    hasOnboarded.mockResolvedValue(true);
    hasValidCredentials.mockResolvedValue(true);

    render(<WelcomeScreen />);

    await act(async () => {});

    expect(navigate).toHaveBeenCalledWith('BottomTabs');
  });

  it('navigates to Onboarding if user has not onboarded', async () => {
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    useAuth0.mockReturnValue({ user: {} });
    hasOnboarded.mockResolvedValue(false);
    hasValidCredentials.mockResolvedValue(true);

    render(<WelcomeScreen />);

    await act(async () => {});

    expect(navigate).toHaveBeenCalledWith('Onboarding');
  });

  it('does not navigate if user has not valid credentials', async () => {
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    useAuth0.mockReturnValue({ user: {} });
    hasOnboarded.mockResolvedValue(false);
    hasValidCredentials.mockResolvedValue(false);

    render(<WelcomeScreen />);

    await act(async () => {});

    expect(navigate).not.toHaveBeenCalled();
  });
});
