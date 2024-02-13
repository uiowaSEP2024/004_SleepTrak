/**
 * @jest-environment jsdom
 */
// The doc above tells jest to use jsdom instead of node

import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';
import { toggleSidebar } from '../../util/utils';
import '@testing-library/jest-dom';
import '../../util/setupDomTests';

// Mocking the toggleSidebar function
jest.mock('../../util/utils', () => ({
  toggleSidebar: jest.fn()
}));

describe('Header component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Header />);
  });

  test('toggleSidebarButton is present', () => {
    render(<Header />);
    const toggleSidebarButton = screen.getByTestId('toggle-sidebar-button');
    expect(toggleSidebarButton).toBeInTheDocument();
  });

  test('clicking toggleSidebarButton calls toggleSidebar function', () => {
    render(<Header />);
    const toggleSidebarButton = screen.getByTestId('toggle-sidebar-button');
    fireEvent.click(toggleSidebarButton);
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });
});
