import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ClientAdminOptions from '../../components/ClientAdminOptions';

describe('ClientAdminOptions component', () => {
  const mockProps = {
    userId: '1'
  };
  it('renders correctly', () => {
    render(
      <Router>
        <ClientAdminOptions {...mockProps} />
      </Router>
    );

    expect(screen.getByText('Reassign Client')).toBeInTheDocument();
  });

  it('navigates to correct route when "More" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <ClientAdminOptions {...mockProps} />
      </Router>
    );

    const button = getByText('Reassign Client');

    fireEvent.click(button);

    // Assert that the URL has changed to the expected URL
    expect(window.location.pathname).toBe(
      `/clients/${mockProps.userId}/assign`
    );
  });
});
