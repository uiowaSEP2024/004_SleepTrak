import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import NotesTextInput from '../../../src/components/inputs/NotesTextInput';

describe('NotesTextInput', () => {
  test('should update value when text is entered', async () => {
    const { getByTestId } = render(<NotesTextInput />);
    const textInput = getByTestId('notesTextInput');
    await act(async () => {
      fireEvent.changeText(textInput, 'Test note');
    });
    await waitFor(() => {
      expect(textInput.props.value).toBe('Test note');
    });
  });
});
