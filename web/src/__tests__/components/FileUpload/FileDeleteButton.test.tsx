import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { fireEvent, render, waitFor } from '@testing-library/react';
import FileDeleteButton from '../../../components/FileUpload/FileDeleteButton';
import { API_URL } from '../../../util/environment';

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

// Mock environment variables
jest.mock('../../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

global.fetch = jest.fn();

const mockFilesListProps = {
  fileId: 'fileId1',
  onChange: jest.fn() // Mocked onChange function
};

describe('FileDeleteButton', () => {
  it('renders delete button', () => {
    const { getByTestId } = render(
      <FileDeleteButton {...mockFilesListProps} />
    );
    const deleteButton = getByTestId('DeleteIcon');
    expect(deleteButton).toBeInTheDocument();
  });

  it('opens the dialog when Delete icon is clicked', () => {
    const { getByTestId, getByRole, getByText } = render(
      <FileDeleteButton {...mockFilesListProps} />
    );
    const deleteButton = getByTestId('DeleteIcon');
    fireEvent.click(deleteButton);
    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByText('Delete this file?')).toBeInTheDocument();
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });

  it('submits the request to delete when click Yes button', async () => {
    const { getByTestId, getByText } = render(
      <FileDeleteButton {...mockFilesListProps} />
    );
    const deleteButton = getByTestId('DeleteIcon');
    fireEvent.click(deleteButton);
    fireEvent.click(getByText('Yes'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/files/${mockFilesListProps.fileId}/delete`,
        {
          method: 'Delete',
          headers: {
            Authorization: `Bearer mocked-access-token`
          }
        }
      );
    });
  });
});
