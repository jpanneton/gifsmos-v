import React from 'react';
import Frame from './Frame';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('<Frame/>', () => {
  it('renders without crashing', () => {
    render(<Frame />);
  });

  it('renders appropriate content', () => {
    const { container } = render(<Frame imageSrc='<svg viewBox="0 0 0 0"></svg>' />);
    expect(container.querySelector('.Frame-image').firstChild.tagName).toBe(
      'svg'
    );
  });

  it('shows pause symbol when playing', () => {
    const { container } = render(<Frame imageSrc="test" playing />);
    expect(
      container.querySelector('.Frame').firstChild.nextSibling.textContent
    ).toBe('\u275a \u275a');
  });

  it('shows play symbol when paused', () => {
    const { container } = render(<Frame imageSrc="test" playing={false} />);
    expect(
      container.querySelector('.Frame').firstChild.nextSibling.textContent
    ).toBe('\u25b6');
  });
});
