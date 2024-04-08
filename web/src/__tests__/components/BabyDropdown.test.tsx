import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { fireEvent, render } from '@testing-library/react';
import BabyDropdown from '../../components/BabyDropdown';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Baby } from '@prisma/client';

// Mock navigate and useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const navigateMock: jest.Mock = jest.fn();

(useNavigate as jest.Mock).mockImplementation(() => navigateMock);

describe('BabyDropdown component', () => {
  const babies: Baby[] = [
    {
      dob: new Date('2023-01-15'),
      babyId: '1',
      name: 'Baby 1',
      parentId: '101',
      weight: 8,
      medicine: ''
    },
    {
      dob: new Date('2023-05-20'),
      babyId: '2',
      name: 'Baby 2',
      parentId: '101',
      weight: 8,
      medicine: ''
    },
    {
      dob: new Date('2023-09-10'),
      babyId: '3',
      name: 'Baby 3',
      parentId: '102',
      weight: 8,
      medicine: ''
    }
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
    expect(navigateMock).toHaveBeenCalledWith('/clients/101/babies/2');
  });
});
