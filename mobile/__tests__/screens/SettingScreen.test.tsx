import React from 'react';
import { render } from '@testing-library/react-native';
import Setting from '../../src/screens/SettingScreen';

describe('Setting', () => {
  it('renders without crashing', () => {
    render(<Setting />);
  });
});
