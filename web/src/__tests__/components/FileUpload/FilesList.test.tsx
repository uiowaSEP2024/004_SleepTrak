import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import FilesList from '../../../components/FileUpload/FilesList';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the FileDeleteButton component
jest.mock('../../../components/FileUpload/FileDeleteButton', () => {
  return jest.fn().mockImplementation(() => {
    return (
      <div data-testid={`file-delete-button`}>Mocked File Delete Button</div>
    );
  });
});

const mockFiles = [
  {
    fileId: '1',
    filename: 'File 1',
    url: '/url1',
    babyId: 'baby1'
  },
  {
    fileId: '2',
    filename: 'File 2',
    url: '/url2',
    babyId: 'baby1'
  }
];

const mockFilesListProps = {
  files: mockFiles,
  onChange: jest.fn() // Mocked onChange function
};

describe('FilesList', () => {
  it('renders the FilesList with correct title and buttons', () => {
    const { getAllByTestId, getByText } = render(
      <Router>
        <FilesList {...mockFilesListProps} />
      </Router>
    );

    expect(getByText('Upload PDF Files')).toBeInTheDocument();
    mockFiles.forEach((mockFile) => {
      expect(getByText(mockFile.filename)).toBeInTheDocument();
    });
    const deleteButtons = getAllByTestId('file-delete-button');
    expect(deleteButtons).toHaveLength(2);
  });

  it('the filenames shown in FilesList has correct url', () => {
    const { getByText } = render(
      <Router>
        <FilesList {...mockFilesListProps} />
      </Router>
    );

    mockFiles.forEach((file) => {
      const curFile = getByText(file.filename);
      expect(curFile.getAttribute('href')).toBe(file.url);
    });
  });
});
