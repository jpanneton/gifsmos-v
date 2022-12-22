/*
 * Centralized logic for returning human-radable error messages.
 *
 * As a guiding principle, error messages should refer to the input that led to
 * the error when possible.
 */

export const noSuchExpression = id =>
  `There is no expression with ID ${id}.`;

export const notASlider = id =>
  `Looks like expression with ID ${id} doesn't define a slider.`;

export const badNameInput = errorMessage =>
  `Invalid name input for saving graph: ${errorMessage}`;

export const gifCreationProblem = () =>
  'There was a problem creating your GIF. :(';

export const badBurstInput = errors => {
  const propMap = {
    sliderID: 'Slider ID',
    min: 'Slider Min',
    max: 'Slider Max',
    step: 'Slider Step'
  };

  let badProps = [];
  for (let prop in errors) {
    if (!!errors[prop]) badProps.push(prop);
  }

  let propText;
  switch (badProps.length) {
    case 1:
      propText = propMap[badProps[0]];
      break;
    case 2:
      propText = badProps.indexOf('sliderID') > -1 ? propMap.sliderID : 'input';
      break;
    default:
      propText = 'input';
  }

  if (propText === propMap.sliderID)
    return `Please choose a slider or define an expression.`;

  return `Your ${propText} isn't quite right.`;
};

export const badSettingsInput = errors => {
  const propMap = {
    width: 'Image Width',
    height: 'Image Height',
    interval: 'Interval'
  };

  let badProps = [];
  for (let prop in errors) {
    if (!!errors[prop]) badProps.push(prop);
  }

  if (badProps.length === 1) {
    let propText = propMap[badProps[0]];
    return `The ${propText} setting must be a positive integer.`;
  }

  return 'Image settings must be positive integers.';
};
