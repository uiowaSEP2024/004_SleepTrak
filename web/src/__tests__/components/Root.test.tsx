import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import Root from '../../components/Root';
import { BrowserRouter } from 'react-router-dom';

describe('Root component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    );
  });
});
