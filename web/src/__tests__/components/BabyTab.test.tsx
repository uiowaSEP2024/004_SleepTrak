/**
 * @jest-environment jsdom
 */
// The doc above tells jest to use jsdom instead of node

import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render, fireEvent } from '@testing-library/react';
import BabyTab from '../../components/BabyTab';

describe('BabyTab component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<BabyTab />);
    expect(getByText('Summary')).toBeInTheDocument();
    expect(getByText('Log')).toBeInTheDocument();
    expect(getByText('Docs')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    const { getByText, getByTestId } = render(<BabyTab />);
    fireEvent.click(getByText('Summary'));
    expect(getByTestId('summary-page')).toBeInTheDocument();
    fireEvent.click(getByText('Log'));
    expect(getByTestId('log-page')).toBeInTheDocument();
    fireEvent.click(getByText('Docs'));
    expect(getByTestId('docs-page')).toBeInTheDocument();
  });

  it('renders correct content for active tab', () => {
    const { getByText, queryByTestId } = render(<BabyTab />);
    expect(getByText('Summary')).toBeInTheDocument();
    expect(queryByTestId('summary-page')).toBeInTheDocument();
    expect(queryByTestId('log-page')).toBeNull();
    expect(queryByTestId('docs-page')).toBeNull();
  });
});
