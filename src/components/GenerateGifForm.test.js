import React from 'react';
import GenerateGifForm from './GenerateGifForm';
import { render, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('<GenerateGifForm/>', () => {
  it('renders without crashing', () => {
    render(<GenerateGifForm />);
  });

  it('renders appropriate content', () => {
    const { container, getByText } = render(
      <GenerateGifForm transparentBackground={true} />
    );
    expect(container.querySelectorAll('input').length).toBe(2);
    expect(container.querySelector('input[name="name"]')).toBeTruthy();
    expect(getByText('Transparent Background')).toBeTruthy();
    expect(getByText('Download SVG')).toBeTruthy();
    expect(getByText('Download PNG')).toBeTruthy();
  });

  it('has functioning inputs', () => {
    const updateGIFFileName = jest.fn();
    const { container } = render(
      <GenerateGifForm
        updateGIFFileName={updateGIFFileName}
      />
    );
    // change input values
    fireEvent.change(container.querySelector('input[name="name"]'), {
      target: { value: 'name' }
    });

    // check to see that handleInputUpdate dispatches appropriate actions
    expect(updateGIFFileName).toHaveBeenCalled();
  });

  it('allows user to hide color picker', () => {
    const { container } = render(
      <GenerateGifForm transparentBackground={true} />
    );
    expect(container.querySelector('.chrome-picker')).toBeFalsy();
  });

  it('allows user to show color picker', () => {
    const { container } = render(
      <GenerateGifForm transparentBackground={false} />
    );
    expect(container.querySelector('.chrome-picker')).toBeTruthy();
  });

  // The color picker is now shown when transparentBackground = true,
  // which is set exclusively via the action system (unlike states)
  it.skip('allows user to show and hide color picker', () => {
    const updateTransparentBackground = jest.fn();
    const updateAnimationBackground = jest.fn();
    const { container, getByText } = render(
      <GenerateGifForm
        updateTransparentBackground={updateTransparentBackground}
        updateAnimationBackground={updateAnimationBackground}
      />
    );
    expect(container.querySelector('.chrome-picker')).toBeFalsy();
    fireEvent.click(getByText('Transparent Background'));
    expect(container.querySelector('.chrome-picker')).toBeTruthy();
    fireEvent.click(getByText('Transparent Background'));
    expect(container.querySelector('.chrome-picker')).toBeFalsy();
  });

  // We receive an Event instead of a SubmitEvent in handleSubmit
  // (GenerateGifForm.js), which causes 'submitter' to be undefined
  it.skip('has a functioning submit button', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <GenerateGifForm handleGenerateGIF={onSubmit} />
    );
    fireEvent.click(getByText('Download SVG'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
