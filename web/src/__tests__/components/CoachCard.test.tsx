import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CoachCard from '../../components/CoachCard';

describe('CoachCard component', () => {
  const mockProps = {
    avatarSrc: '/path/to/avatar.jpg',
    title: 'Coach 1',
    coachId: '1',
    numClients: 1
  };

  it('renders correctly', () => {
    render(
      <Router>
        <CoachCard {...mockProps} />
      </Router>
    );

    expect(screen.getByText(`${mockProps.title}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Clients: ${mockProps.numClients}`)
    ).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('Manage')).toBeInTheDocument();
  });

  it('navigates to correct route when "More" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <CoachCard {...mockProps} />
      </Router>
    );

    const moreButton = getByText('Manage');

    fireEvent.click(moreButton);

    // Assert that the URL has changed to the expected URL
    expect(window.location.pathname).toBe(`/coaches/1`);
  });
});
