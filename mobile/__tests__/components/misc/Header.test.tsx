import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../../../src/components/misc/Header';

jest.mock('expo-font');
jest.mock('expo-asset');

describe('Header', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn()
  };

  const mockRoute = {
    name: 'Home'
  };

  it('renders correctly', () => {
    const { getByTestId } = render(
      <Header
        navigation={mockNavigation}
        route={mockRoute}
        back={false}
      />
    );

    expect(getByTestId('header-container')).toBeTruthy();
    expect(getByTestId('profile-button')).toBeTruthy();
    expect(getByTestId('settings-button')).toBeTruthy();
  });

  it('renders back button when back prop is true and route name is not Home', () => {
    const { getByTestId } = render(
      <Header
        navigation={mockNavigation}
        route={{ name: 'NotHome' }}
        back={true}
      />
    );

    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(
      <Header
        navigation={mockNavigation}
        route={{ name: 'NotHome' }}
        back={true}
      />
    );

    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('navigates to profile when profile button is pressed', () => {
    const { getByTestId } = render(
      <Header
        navigation={mockNavigation}
        route={mockRoute}
        back={false}
      />
    );

    fireEvent.press(getByTestId('profile-button'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  it('navigates to settings when settings button is pressed', () => {
    const { getByTestId } = render(
      <Header
        navigation={mockNavigation}
        route={mockRoute}
        back={false}
      />
    );

    fireEvent.press(getByTestId('settings-button'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Setting');
  });
});
