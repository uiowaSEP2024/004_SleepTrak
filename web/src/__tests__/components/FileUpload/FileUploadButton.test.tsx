import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import FileUploadButton from '../../../components/FileUpload/FileUploadButton';
import { render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

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

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ babyId: '1' })
}));

global.fetch = jest.fn();

describe('FileUploadButton', () => {
  it('renders the create schedule dialog with correct elements', () => {
    const { getByText } = render(<FileUploadButton onUpload={jest.fn()} />);
    expect(getByText('Upload file')).toBeInTheDocument();
  });

  it('submits the form correctly when upload the file', async () => {
    const { container, getByText } = render(
      <FileUploadButton onUpload={jest.fn()} />
    );

    // Mock file uploading
    const fileInput = container.querySelector<HTMLInputElement>(
      'input.css-1bigxrc[type="file"][accept=".pdf"]'
    );
    expect(fileInput).toBeInTheDocument();
    const file = new File(['mock file content'], 'mockFile.pdf', {
      type: 'application/pdf'
    });
    if (fileInput) {
      user.upload(fileInput, file);
    }

    // Wait for file upload process to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/files/create`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mocked-access-token'
        },
        body: expect.any(FormData)
      });
    });

    // Assert that success dialog is shown
    expect(
      getByText('File has been successfully uploaded!')
    ).toBeInTheDocument();
  });

  // TODO: Add a test for when the file upload fails
});
