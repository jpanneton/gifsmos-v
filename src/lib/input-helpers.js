/*
 * Helpers to validate and detect errors in user inputs.
 */

export const isPositiveValue = value => {
  return !isNaN(value) && value > 0;
};

export const isPositiveInteger = value => {
  return !isNaN(value) && value > 0 && Math.round(value) === value;
};

export const validatePositiveValue = value => {
  return isPositiveValue(value) && isFinite(value) ? value : 0;
};

export const roundToDecimals = (value, decimals) => {
  return parseFloat(parseFloat(value).toFixed(decimals));
};

export const validateBurstSetting = (name, value) => {
  if (name === 'interval' || name === 'fps' || name === 'duration') {
    return Math.round(value);
  } else if (name === 'step') {
    return roundToDecimals(value, 4);
  }
  return value;
};

export const updateBurstState = state => {
  const { min, max, stepMode, step, interval, fps, duration } = state;
  if (stepMode === 'MANUAL_STEP_MODE') {
    state.fps = validatePositiveValue(Math.round(1000 / interval));
    state.frameCount = validatePositiveValue(Math.round((max - min) / step));
    state.duration = validatePositiveValue(Math.round(state.frameCount * interval));
  } else if (stepMode === 'AUTO_STEP_MODE') {
    state.interval = validatePositiveValue(Math.round(1000 / fps));
    state.frameCount = validatePositiveValue(Math.round(duration / state.interval));
    state.step = validatePositiveValue(roundToDecimals((max - min) / state.frameCount, 4));
  }
  return state;
};

export const getBurstErrors = inputs => {
  const { idx, min, max, step, interval, fps, duration } = inputs;
  const errors = {};

  if (step !== undefined && !isPositiveValue(step))
    errors['step'] = true;
  if (interval !== undefined && !isPositiveValue(interval))
    errors['interval'] = true;
  if (fps !== undefined && !isPositiveValue(fps))
    errors['fps'] = true;
  if (duration !== undefined && !isPositiveValue(duration))
    errors['duration'] = true;

  if (!idx) errors['idx'] = true;
  if (!min && min !== 0) errors['min'] = true;
  if (!max && max !== 0) errors['max'] = true;
  if (min >= max) {
    errors['min'] = true;
    errors['max'] = true;
  }
  if (step > max - min) errors['step'] = true;

  return errors;
};

export const getSettingsErrors = inputs => {
  const errors = {};

  for (let prop in inputs) {
    if (!isPositiveInteger(inputs[prop])) errors[prop] = true;
  }

  return errors;
};

export const getBoundErrors = inputs => {
  const errors = {};
  const { left, right, top, bottom } = inputs;

  if (left >= right) errors['leftless'] = true;
  if (bottom >= top) errors['bottomless'] = true;
  for (let cur in inputs) {
    if (isNaN(inputs[cur])) errors[cur] = true;
  }

  return errors;
};

export const getSaveGraphErrors = name => {
  const errors = {};
  if (!name.length) {
    errors.name = 'Name required';
  } else if (name.length > 255) {
    errors.name = `Name cannot be longer than 255 characters`;
  }
  return errors;
};
