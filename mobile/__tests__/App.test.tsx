import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';
// import { Auth0Provider } from 'react-native-auth0';

jest.mock('react-native-auth0', () => ({
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children
}));

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
