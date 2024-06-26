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

// Mock Twilio
jest.mock('@twilio/conversations', () => ({
  ...jest.requireActual('@twilio/conversations'),
  Client: jest.fn().mockImplementation(() => ({
    getSubscribedConversations: jest.fn(),
    on: jest.fn()
  }))
}));
import { useAuth0 } from '@auth0/auth0-react';

describe('ChatPage Component', () => {
  it('fetchs a auth0 access token', async () => {
    const { getAccessTokenSilently } = useAuth0();
    act(() => {
      render(
        <BrowserRouter>
          <ChatPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(getAccessTokenSilently).toHaveBeenCalled();
    });
  });
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
        encodeURI(`${API_URL}/twilio/token?identity=${mockUser.sub}`),
        {
          headers: {
            Authorization: 'Bearer mocked-access-token'
          }
        }
      );
    });
  });
  it('fetches the users', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ChatPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/users/all`, {
        headers: {
          Authorization: 'Bearer mocked-access-token'
        }
      });
    });
  });
});
