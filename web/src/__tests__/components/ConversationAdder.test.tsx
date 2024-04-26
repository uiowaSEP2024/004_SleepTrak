import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConversationAdder from '../../components/ConversationAdder';
import { UserWithBabies } from '../../types/schemaExtensions';

// Mock fetch
const mockUserData: UserWithBabies[] = [
  {
    userId: '1',
    coachId: '3',
    first_name: 'John',
    last_name: 'Doe',
    role: 'client',
    email: 'johndoe@test.com',
    babies: [
      {
        dob: new Date('2023-01-01'),
        babyId: '1',
        name: 'Baby A',
        parentId: '12345',
        weight: 8,
        medicine: ''
      }
    ]
  },
  {
    userId: '2',
    coachId: null,
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'coach',
    email: 'janesmith@test.com',
    babies: []
  },
  {
    userId: '3',
    coachId: null,
    first_name: 'John',
    last_name: 'Smith',
    role: 'coach',
    email: 'johnsmith@test.com',
    babies: []
  },
  {
    userId: '4',
    coachId: null,
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'client',
    email: 'janedoe@test.com',
    babies: [
      {
        dob: new Date('2023-01-01'),
        babyId: '1',
        name: 'Baby A',
        parentId: '12345',
        weight: 8,
        medicine: ''
      }
    ]
  }
];
global.fetch = jest.fn().mockResolvedValue({
  json: async () => mockUserData
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
import { Client as ConversationsClient } from '@twilio/conversations';

const mockClient = new ConversationsClient('mocked-twilio-token');

describe('ConversationAdder Component', () => {
  it('contains a form with a ConversationAdder', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ConversationAdder conversationsClient={mockClient} />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('ConversationAdderForm')).toBeInTheDocument();
    });
  });
  it('renders a UserSearch component', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ConversationAdder conversationsClient={mockClient} />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('UserSearch')).toBeInTheDocument();
    });
  });
});
