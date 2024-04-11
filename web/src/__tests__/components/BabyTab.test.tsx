import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render, fireEvent } from '@testing-library/react';
import BabyTab from '../../components/BabyTab';

// Mock the Summary page
jest.mock('../../pages/SummaryPage', () => () => (
  <div data-testid="mocked-summary-page">Mocked Summary</div>
));

// Mock the LogPage page
jest.mock('../../pages/LogPage', () => () => (
  <div data-testid="mocked-log-page">Mocked Log</div>
));

// Mock the DocsPage page
jest.mock('../../pages/DocsPage', () => () => (
  <div data-testid="mocked-docs-page">Mocked Docs</div>
));

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
    expect(getByTestId('mocked-summary-page')).toBeInTheDocument();
    fireEvent.click(getByText('Log'));
    expect(getByTestId('mocked-log-page')).toBeInTheDocument();
    fireEvent.click(getByText('Docs'));
    expect(getByTestId('mocked-docs-page')).toBeInTheDocument();
  });
});
