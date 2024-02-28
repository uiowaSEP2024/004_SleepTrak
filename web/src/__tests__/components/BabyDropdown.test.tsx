import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { fireEvent, render } from '@testing-library/react';
import BabyDropdown from '../../components/BabyDropdown';
import { BrowserRouter, useNavigate } from 'react-router-dom';

// Mock navigate and useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const navigateMock: jest.Mock = jest.fn();

(useNavigate as jest.Mock).mockImplementation(() => navigateMock);

describe('BabyDropdown component', () => {
  const babies = [
    { name: 'Baby 1', dob: '2020-01-01', babyId: '1' },
    { name: 'Baby 2', dob: '2021-02-02', babyId: '2' }
  ];

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <BabyDropdown babies={babies} />
      </BrowserRouter>
    );
  });

  it('displays the correct default value', () => {
    const { getByDisplayValue } = render(
      <BrowserRouter>
        <BabyDropdown babies={babies} />
      </BrowserRouter>
    );
    expect(getByDisplayValue('Baby 1')).toBeInTheDocument();
  });

  it('navigates when an option is selected', async () => {
    const { getByDisplayValue } = render(
      <BrowserRouter>
        <BabyDropdown babies={babies} />
      </BrowserRouter>
    );

    // Select Baby 2 from Dropdown
    const select = getByDisplayValue('Baby 1');
    fireEvent.change(select, { target: { value: 'Baby 2' } });

    expect(getByDisplayValue('Baby 2')).toBeInTheDocument();
    expect(navigateMock).toHaveBeenCalledWith('/babies/2');
  });
});
