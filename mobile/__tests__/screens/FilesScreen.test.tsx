import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FilesScreen from '../../src/screens/FilesScreen';
import { fetchFiles } from '../../src/utils/db';

jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('../../src/utils/db', () => ({
  fetchFiles: jest.fn()
}));

const Stack = createStackNavigator();

describe('FilesScreen', () => {
  const mockFiles = [
    { fileId: '1', filename: 'File 1', url: 'url1' },
    { fileId: '2', filename: 'File 2', url: 'url2' }
  ];

  beforeEach(() => {
    fetchFiles.mockClear();
  });

  const renderComponent = (initialParams) => {
    return render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="FilesScreen"
            component={FilesScreen}
            initialParams={initialParams}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  it('renders correctly', async () => {
    fetchFiles.mockResolvedValueOnce(mockFiles);

    const { getByText } = renderComponent({ babyId: '1' });

    await waitFor(() => {
      expect(getByText('Files')).toBeTruthy();
    });
  });

  it('displays no files found when there are no files', async () => {
    fetchFiles.mockResolvedValueOnce([]);

    const { getByText } = renderComponent({ babyId: '1' });

    await waitFor(() => {
      expect(getByText('No files found')).toBeTruthy();
    });
  });

  it('displays files when there are files', async () => {
    fetchFiles.mockResolvedValueOnce(mockFiles);

    const { getByText } = renderComponent({ babyId: '1' });

    await waitFor(() => {
      expect(getByText('File 1')).toBeTruthy();
      expect(getByText('File 2')).toBeTruthy();
    });
  });

  it('calls fetchFiles with the correct babyId', () => {
    fetchFiles.mockResolvedValueOnce(mockFiles);

    renderComponent({ babyId: '1' });

    expect(fetchFiles).toHaveBeenCalledWith('1');
  });
});
