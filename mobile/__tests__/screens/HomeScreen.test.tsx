import React from 'react';
import { render } from '@testing-library/react-native';
import Home from '../../src/screens/HomeScreen';

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });
});
