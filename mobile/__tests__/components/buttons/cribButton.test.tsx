import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CribButton from '../../../src/components/buttons/CribButton';

describe('CribButton', () => {
  it('changes text on press', () => {
    const onStart = jest.fn();
    const onStop = jest.fn();

    const { getByText } = render(
      <CribButton
        onStart={onStart}
        onStop={onStop}
      />
    );

    const button = getByText('Put in Crib');
    fireEvent.press(button);

    expect(onStart).toHaveBeenCalled();
    expect(getByText('Take out of crib')).toBeTruthy();

    fireEvent.press(button);

    expect(onStop).toHaveBeenCalled();
    expect(getByText('Put in Crib')).toBeTruthy();
  });
});
