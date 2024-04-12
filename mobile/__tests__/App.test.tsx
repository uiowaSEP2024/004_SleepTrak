import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('react-native-auth0', () => ({
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock('../src/utils/localDb', () => ({
  initializeDatabase: jest.fn()
}));

jest.mock('../src/navigations/MainStack', () => () => 'MainStack');

jest.mock('expo-sqlite', () => {
  const mockDB = {
    transaction: jest.fn()
  };
  return {
    openDatabase: () => mockDB
  };
});

jest.mock('../src/navigations/MainNavigator', () => {
  return {
    __esModule: true,
    default: () => <div>Mock BottomTabs</div>
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
