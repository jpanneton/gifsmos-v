import * as errors from './error-messages';

describe('error messages', () => {
  it('return a message for an invalid expression index', () => {
    expect(errors.noSuchExpression(42)).toEqual(
      'There is no expression with ID 42.'
    );
  });

  it('return a message for an expression without a slider', () => {
    expect(errors.notASlider(42)).toEqual(
      "Looks like expression with ID 42 doesn't define a slider."
    );
  });

  it('return a message for a GIF creation problem', () => {
    expect(errors.gifCreationProblem()).toEqual(
      'There was a problem creating your GIF. :('
    );
  });

  it('return a message for a burst input errors', () => {
    expect(errors.badBurstInput({ min: true })).toEqual(
      "Your Slider Min isn't quite right."
    );
    expect(errors.badBurstInput({ max: true })).toEqual(
      "Your Slider Max isn't quite right."
    );
    expect(errors.badBurstInput({ step: true })).toEqual(
      "Your Slider Step isn't quite right."
    );
    expect(errors.badBurstInput({ sliderID: true, max: true })).toEqual(
      'Please choose a slider or define an expression.'
    );
    expect(errors.badBurstInput({ min: true, max: true })).toEqual(
      "Your input isn't quite right."
    );
  });

  it('return a message for a settings input errors', () => {
    expect(errors.badSettingsInput({ width: true })).toEqual(
      'The Image Width setting must be a positive integer.'
    );
    expect(errors.badSettingsInput({ height: true })).toEqual(
      'The Image Height setting must be a positive integer.'
    );
    expect(errors.badSettingsInput({ interval: true })).toEqual(
      'The Interval setting must be a positive integer.'
    );
    expect(errors.badSettingsInput({ width: true, height: true })).toEqual(
      'Image settings must be positive integers.'
    );
  });
});
