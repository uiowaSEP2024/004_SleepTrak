import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import EventsScreen from '../../src/screens/EventsScreen';

const MOCK_CURRENT_DATE_IN_MS = 1466424490000; // This is a specific date (June 20, 2016)
const ONE_DAY_IN_MS = 86400000;

jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('../../src/utils/db', () => ({
  fetchUserData: jest.fn().mockResolvedValue({
    events: [
      {
        startTime: '2016-06-20T17:34:50.000Z',
        endTime: '2016-06-20T18:34:50.000Z',
        type: 'sleep',
        note: 'Nap time went great!'
      },
      {
        startTime: '2016-06-20T19:34:50.000Z',
        endTime: '2016-06-20T20:34:50.000Z',
        type: 'sleep',
        note: 'Nap time went even greater!'
      },
      {
        startTime: '2016-06-19T17:34:50.000Z',
        endTime: '2016-06-19T18:34:50.000Z',
        type: 'sleep',
        note: 'Nap time went great too!'
      },
      {
        startTime: '2016-06-21T17:34:50.000Z',
        endTime: '2016-06-21T18:34:50.000Z',
        type: 'sleep',
        note: 'Nap time went great as well!'
      },
      {
        startTime: '2016-06-20T21:34:50.000Z',
        type: 'feed',
        foodType: 'breastMilk',
        amount: '20',
        unit: 'oz',
        note: 'Great feeding!'
      },
      {
        startTime: '2016-06-21T21:34:50.000Z',
        type: 'feed',
        foodType: 'breastMilk',
        amount: '20',
        unit: 'oz',
        note: 'Great feeding as well!'
      },
      {
        startTime: '2016-06-19T21:34:50.000Z',
        type: 'feed',
        foodType: 'breastMilk',
        amount: '20',
        unit: 'oz',
        note: 'Super feeding as well!'
      }
    ]
  })
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn()
    })
  };
});

describe('Events Screen', () => {
  it('renders correctly', async () => {
    const { findByTestId } = render(<EventsScreen />);
    await waitFor(() => {
      expect(findByTestId('date-header')).toBeDefined();
    });
  });

  it('should render the correct date', async () => {
    const mockDate = new Date(MOCK_CURRENT_DATE_IN_MS);

    const { findByText } = render(<EventsScreen date={mockDate} />);

    // Check that the date is displayed correctly
    await waitFor(() => {
      expect(findByText('Monday, June 20, 2016')).toBeTruthy();
    });
  });

  it('should change the date when the back button is pressed', async () => {
    const mockDate = new Date(MOCK_CURRENT_DATE_IN_MS);

    const { getByTestId } = render(<EventsScreen date={mockDate} />);
    const dateBackButton = getByTestId('date-back-button');

    // Simulate a press on the back button
    fireEvent.press(dateBackButton);

    // Check that the date is displayed correctly
    await waitFor(() => {
      expect(getByTestId('date-header').props.children).toBe(
        'Sunday, June 19, 2016'
      );
    });
  });

  it('should change the date when the forward button is pressed', async () => {
    const mockDate = new Date(MOCK_CURRENT_DATE_IN_MS);
    const nextDate = new Date(MOCK_CURRENT_DATE_IN_MS + ONE_DAY_IN_MS); // This is the day after the specific date

    const { getByTestId } = render(<EventsScreen date={mockDate} />);
    const dateForwardButton = getByTestId('date-forward-button');

    // Simulate a press on the forward button
    fireEvent.press(dateForwardButton);

    // Check that the date is displayed correctly
    await waitFor(() => {
      expect(getByTestId('date-header').props.children).toBe(
        nextDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );
    });
  });

  it('should filter events based on the date', async () => {
    // Mock the Date object to return a specific date
    const mockDate = new Date(MOCK_CURRENT_DATE_IN_MS);

    const { getByTestId } = render(<EventsScreen date={mockDate} />);
    const dateBackButton = getByTestId('date-back-button');

    // Simulate a press on the back button
    fireEvent.press(dateBackButton);

    // Check that the events are displayed correctly
    await waitFor(() => {
      expect(getByTestId('event-0').props.children[0].props.title).toBe('Feed');
      expect(getByTestId('event-1').props.children[0].props.title).toBe(
        'Sleep'
      );
    });
  });
});
