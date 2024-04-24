import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { act, render, waitFor } from '@testing-library/react';
import ChatPage from '../../pages/ChatPage';
import { BrowserRouter } from 'react-router-dom';
import API_URL from '../../util/apiURL';

const mockData = {};
const mockUser = {
  sub: 'mockUser'
};

global.fetch = jest.fn().mockResolvedValue({
  json: async () => mockData
});

// Mock environment variables
jest.mock('../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token'),
    user: {
      sub: 'mockUser'
    }
  })
}));

describe('ChatPage Component', () => {
  it('fetchs a twilio access token', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ChatPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        encodeURI(`http://${API_URL}/twilio/token?identity=${mockUser.sub}`),
        {
          headers: {
            Authorization: 'Bearer mocked-access-token'
          }
        }
      );
    });
  });
});
