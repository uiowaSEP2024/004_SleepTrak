import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../../src/screens/TestScreen';

describe('Home', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  it('renders without crashing', () => {
    const { getByText } = render(<Home navigation={mockNavigation} />);
    expect(getByText).toBeDefined();
  });

  it('should navigate to sleep timer when button is pressed', () => {
    const { getByText } = render(<Home navigation={mockNavigation} />);
    const navigationButton = getByText('Log Sleep');
    if (navigationButton) {
      fireEvent.press(navigationButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('SleepTimer');
    } else {
      throw new Error('Button "Log Sleep" not found');
    }
  });
});
