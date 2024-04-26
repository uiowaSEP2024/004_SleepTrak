import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import DocsPage from '../../pages/DocsPage';
import { act, render, waitFor } from '@testing-library/react';
import { File } from '@prisma/client';
import API_URL from '../../util/apiURL';

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

// Mock environment variables
jest.mock('../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

// Mock the FileUploadButton component
jest.mock('../../components/FileUpload/FileUploadButton', () => {
  return jest.fn().mockImplementation(() => {
    return (
      <div data-testid={`file-upload-button`}>Mocked File Upload Button</div>
    );
  });
});

// Mock environment variables
jest.mock('../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

const mockFiles = [
  {
    fileId: '1',
    filename: 'File 1',
    url: 'url 1',
    babyId: 'baby1'
  },
  {
    fileId: '2',
    filename: 'File 2',
    url: 'url 2',
    babyId: 'baby1'
  }
];

// Mock useParams
const useParamsMock = jest.fn().mockReturnValue({ babyId: 'baby1' });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => useParamsMock()
}));

// Mock the FilesList component
jest.mock('../../components/FileUpload/FilesList', () => {
  return jest.fn().mockImplementation(() => {
    return (
      <>
        {mockFiles.map((file: File) => (
          <div data-testid={`files-list`}>{file.filename}</div>
        ))}
      </>
    );
  });
});

// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve(mockFiles)
});

describe('DocsPage', () => {
  it('fetches and renders Files List', async () => {
    const { getByText } = render(<DocsPage />);

    // Wait for the fetch function to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if the file names are rendered
    mockFiles.forEach((file) => {
      expect(getByText(file.filename)).toBeInTheDocument();
    });
  });

  it('fetches data correctly with params', async () => {
    act(() => {
      render(<DocsPage />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/files/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mocked-access-token'
        },
        body: JSON.stringify(useParamsMock())
      });
    });
  });
});
