import React from 'react';
import ColorPicker from './ColorPicker';
import { cleanup, fireEvent, render } from '@testing-library/react';

afterEach(cleanup);

describe('<ColorPicker/>', () => {
  it('renders without crashing', () => {
    render(<ColorPicker />);
  });

  it('renders separate sections of picker', () => {
    const { container } = render(<ColorPicker />);
    expect(container.querySelector('.chrome-picker')).toBeTruthy();
    expect(container.querySelector('.saturation-white')).toBeTruthy();
    expect(container.querySelector('.hue-horizontal')).toBeTruthy();
    expect(container.querySelector('.flexbox-fix')).toBeTruthy();
  });

  // This test only works with the Sketch color picker (now using Chrome)
  it.skip('dispatches action to change color on change', async () => {
    const updateAnimationBackground = jest.fn();
    const { container } = render(
      <ColorPicker updateAnimationBackground={updateAnimationBackground} />
    );
    // The Sketch color picker allowed to select preset colors, unlike Chrome
    fireEvent.click(container.querySelector('div[title="#7ED321"]'));
    expect(updateAnimationBackground).toHaveBeenCalled();
  });
});
