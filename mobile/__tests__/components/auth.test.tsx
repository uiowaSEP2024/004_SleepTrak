import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  LoginButton,
  LogoutButton
} from '../../src/components/buttons/AuthButtons';
import { useAuth0 } from 'react-native-auth0';

jest.mock('react-native-auth0');

describe('AuthButtons', () => {
  it('should call authorize when LoginButton is pressed', async () => {
    const authorize = jest.fn();
    (useAuth0 as jest.Mock).mockReturnValue({ authorize });

    const { getByText } = render(<LoginButton />);

    fireEvent.press(getByText('Log In'));

    expect(authorize).toHaveBeenCalled();
  });

  it('should call clearSession when LogoutButton is pressed', async () => {
    const clearSession = jest.fn();
    (useAuth0 as jest.Mock).mockReturnValue({ clearSession });

    const { getByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Log Out'));

    expect(clearSession).toHaveBeenCalled();
  });
});
