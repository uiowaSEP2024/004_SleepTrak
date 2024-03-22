import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render, fireEvent } from '@testing-library/react';
import BabyTab from '../../components/BabyTab';

// Mock the RecommendedSchedules component
jest.mock(
  '../../components/RecommendedSchedule/RecommendedSchedules',
  () => () => (
    <div data-testid="mocked-recommended-schedules">
      Mocked RecommendedSchedules
    </div>
  )
);

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
    expect(getByTestId('mocked-recommended-schedules')).toBeInTheDocument();
    fireEvent.click(getByText('Log'));
    expect(getByTestId('log-page')).toBeInTheDocument();
    fireEvent.click(getByText('Docs'));
    expect(getByTestId('docs-page')).toBeInTheDocument();
  });
});
