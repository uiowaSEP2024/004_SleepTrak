import React from 'react';
import { render } from '@testing-library/react-native';
import AuthScreen from '../../src/screens/AuthScreen';
import { useAuth0 } from 'react-native-auth0';

jest.mock('react-native-auth0');

describe('AuthScreen', () => {
  it('should display login button and message when user is not authenticated', () => {
    (useAuth0 as jest.Mock).mockReturnValue({ user: null });

    const { getByText } = render(<AuthScreen />);

    expect(getByText('You are not logged in.')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
  });

  it('should display logout button and user email when user is authenticated', () => {
    const user = { email: 'test@example.com' };
    (useAuth0 as jest.Mock).mockReturnValue({ user });

    const { getByText } = render(<AuthScreen />);

    expect(getByText(`You are ${user.email}`)).toBeTruthy();
    expect(getByText('Log Out')).toBeTruthy();
  });
});
