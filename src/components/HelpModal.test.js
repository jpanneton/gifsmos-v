import React from 'react';
import HelpModal from './HelpModal';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('<HelpModal/>', () => {
  it('renders without crashing', () => {
    render(<HelpModal />);
  });

  it('renders appropriate content', () => {
    const { getByText } = render(<HelpModal />);
    expect(getByText('Using GIFsmos V').tagName).toBe('H1');
  });
});
