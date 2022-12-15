import React from 'react';
import Burst from './Burst';
import * as calcHelpers from '../lib/calc-helpers';
import { cleanup, fireEvent, render } from '@testing-library/react';

afterEach(cleanup);

describe('<Burst/>', () => {
  it('renders without crashing', () => {
    render(<Burst />);
  });

  it('renders tool title', () => {
    const { getByText } = render(<Burst expanded />);
    expect(getByText('Burst')).toBeTruthy();
  });

  it('renders labels/inputs', () => {
    const { getByText } = render(<Burst expanded />);
    // grab labels
    const sliderIndexLabel = getByText('Slider');
    const sliderMinLabel = getByText('Slider Min');
    const sliderMaxLabel = getByText('Slider Max');
    const manualStepRadio = getByText('Manual Step');
    const sliderStepLabel = getByText('Slider Step');
    const intervalLabel = getByText('Interval (ms)');
    const autoStepRadio = getByText('Auto Step');
    const targetFpsLabel = getByText('Target FPS');
    const durationLabel = getByText('Duration (ms)');
    // check that labels have correct corresponding inputs
    expect(sliderIndexLabel.nextSibling.name).toBe('idx');
    expect(sliderIndexLabel.nextSibling.tagName).toBe('SELECT');

    expect(sliderMinLabel.nextSibling.name).toBe('min');
    expect(sliderMinLabel.nextSibling.type).toBe('number');

    expect(sliderMaxLabel.nextSibling.name).toBe('max');
    expect(sliderMaxLabel.nextSibling.type).toBe('number');

    expect(manualStepRadio.previousSibling.name).toBe('step-mode-radio-group');
    expect(manualStepRadio.previousSibling.type).toBe('radio');

    expect(sliderStepLabel.nextSibling.name).toBe('step');
    expect(sliderStepLabel.nextSibling.type).toBe('number');

    expect(intervalLabel.nextSibling.name).toBe('interval');
    expect(intervalLabel.nextSibling.type).toBe('number');

    expect(autoStepRadio.previousSibling.name).toBe('step-mode-radio-group');
    expect(autoStepRadio.previousSibling.type).toBe('radio');

    expect(targetFpsLabel.nextSibling.name).toBe('fps');
    expect(targetFpsLabel.nextSibling.type).toBe('number');

    expect(durationLabel.nextSibling.name).toBe('duration');
    expect(durationLabel.nextSibling.type).toBe('number');
  });

  it('updates state on input change', () => {
    const updateSetting = jest.fn();
    const { container } = render(
      <Burst expanded updateSetting={updateSetting} />
    );

    fireEvent.change(container.querySelector('input[name="interval"]'), {
      target: { value: '200' }
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
  });

  it('has a functioning capture button', async () => {
    calcHelpers.getCalcState = jest.fn();
    const requestBurst = jest.fn();
    const { getByText } = render(
      <Burst expanded requestBurst={requestBurst} />
    );
    fireEvent.click(getByText('Capture'));
    expect(requestBurst).toHaveBeenCalled();
  });
});
