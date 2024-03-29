import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, act, render, waitFor } from '@testing-library/react';
import AdminPage from '../../pages/AdminPage';
import { BrowserRouter } from 'react-router-dom';
import API_URL from '../../util/apiURL';

// Mock fetch
const mockUserData = [
  {
    userId: '1',
    coachId: '3',
    first_name: 'John',
    last_name: 'Doe',
    role: 'client',
    babies: [{ name: 'Baby1', babyId: '1' }]
  },
  {
    userId: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'coach',
    clients: []
  },
  {
    userId: '3',
    first_name: 'John',
    last_name: 'Smith',
    role: 'coach',
    clients: ['1']
  },
  {
    userId: '4',
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'client',
    babies: [{ name: 'Baby1', babyId: '1' }]
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
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

describe('AdminPage Component', () => {
  it('fetches data correctly', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <AdminPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`http://${API_URL}/users/all`, {
        headers: {
          Authorization: 'Bearer mocked-access-token'
        }
      });
    });
  });

  it('filters and renders coaches & unassigned clients only', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <AdminPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  // TODO: not working, not sure how to mock the onClicks or check that collapse is working, manually tested
  // it('changes whether the coach dropdown is open when you click the header', async () => {
  //   act(() => {
  //     render(
  //       <BrowserRouter>
  //         <AdminPage />
  //       </BrowserRouter>
  //     );
  //   });
  //
  //   expect(screen.getByText('Authorize New Coach')).toBeVisible();
  //   await waitFor(() => {
  //     const select = screen.getByText('Coaches');
  //     fireEvent.click(select);
  //   });
  //   expect(screen.getByText('Coaches')).toBeVisible();
  //   expect(screen.getByText('Authorize New Coach')).not.toBeVisible();
  //   await waitFor(() => {
  //     const select = screen.getByText('Coaches');
  //     fireEvent.click(select);
  //   });
  //   expect(screen.getByText('Coaches')).toBeVisible();
  //   expect(screen.getByText('Authorize New Coach')).toBeVisible();
  // });
});
