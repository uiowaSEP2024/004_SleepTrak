import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ClientCard from '../../components/ClientCard';

describe('ClientCard component', () => {
  const mockProps = {
    avatarSrc: '/path/to/avatar.jpg',
    clientName: 'Client 1',
    babyNames: 'Baby 1',
    babyId: '1',
    clientId: '1'
  };

  it('renders correctly', () => {
    render(
      <Router>
        <ClientCard {...mockProps} />
      </Router>
    );

    expect(screen.getByText('Client 1')).toBeInTheDocument();
    expect(screen.getByText('Baby 1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('navigates to correct route when "More" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <ClientCard {...mockProps} />
      </Router>
    );

    const moreButton = getByText('More');

    fireEvent.click(moreButton);

    // Assert that the URL has changed to the expected URL
    expect(window.location.pathname).toBe(`/clients/1/babies/1`);
  });
});
