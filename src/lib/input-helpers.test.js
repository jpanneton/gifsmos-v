import {
  isPositiveValue,
  isPositiveInteger,
  validatePositiveValue,
  roundToDecimals,
  validateBurstSetting,
  updateBurstState,
  getBurstErrors,
  getSettingsErrors
} from './input-helpers';

describe('input helpers', () => {
  it('detects positive values', () => {
    const testCases = [
      [0, false],
      [1, true],
      [-1, false],
      [NaN, false],
      [1.5, true],
      [-1.5, false]
    ];

    testCases.forEach(testCase => {
      const [value, result] = testCase;
      expect(isPositiveValue(value)).toEqual(result);
    });
  });

  it('detects positive integers', () => {
    const testCases = [
      [0, false],
      [1, true],
      [-1, false],
      [NaN, false],
      [1.5, false],
      [-1.5, false]
    ];

    testCases.forEach(testCase => {
      const [value, result] = testCase;
      expect(isPositiveInteger(value)).toEqual(result);
    });
  });

  it('validates positive values', () => {
    const testCases = [
      [0, 0],
      [1, 1],
      [-1, 0],
      [NaN, 0],
      [1.5, 1.5],
      [-1.5, 0],
      [Infinity, 0]
    ];

    testCases.forEach(testCase => {
      const [value, result] = testCase;
      expect(validatePositiveValue(value)).toEqual(result);
    });
  });

  it('rounds to decimals', () => {
    const testCases = [
      [0, 0],
      [1, 1],
      [-1, -1],
      [NaN, NaN],
      [1.5555, 1.56],
      [-1.5555, -1.56],
      [Infinity, Infinity]
    ];

    testCases.forEach(testCase => {
      const [value, result] = testCase;
      expect(roundToDecimals(value, 2)).toEqual(result);
    });
  });

  it('validates burst settings', () => {
    const testCases = [
      [0, 0],
      [1, 1],
      [-1, -1],
      [NaN, NaN],
      [1.555555, 1.5556],
      [-1.555555, -1.5556],
      [Infinity, Infinity]
    ];

    testCases.forEach(testCase => {
      const [value, result] = testCase;
      const integralResult = Math.round(result);
      expect(validateBurstSetting('step', value)).toEqual(result);
      expect(validateBurstSetting('interval', value)).toEqual(integralResult);
      expect(validateBurstSetting('fps', value)).toEqual(integralResult);
      expect(validateBurstSetting('duration', value)).toEqual(integralResult);
    });
  });

  it('updates burst state', () => {
    const state = {
      min: -10,
      max: 10,
      stepMode: 'MANUAL_STEP_MODE',
      step: 1,
      interval: 30,
      fps: 0,
      duration: 0,
      frameCount: 0
    };

    const input1 = {
      ...state,
      stepMode: 'MANUAL_STEP_MODE',
      step: 0.01,
      interval: 50
    };

    const expectedOutput1 = {
      ...input1,
      fps: 20,
      duration: 100000,
      frameCount: 2000
    };

    const input2 = {
      ...state,
      stepMode: 'AUTO_STEP_MODE',
      fps: 20,
      duration: 100000
    };

    const expectedOutput2 = {
      ...input2,
      step: 0.01,
      interval: 50,
      frameCount: 2000
    };

    expect(updateBurstState(input1)).toMatchObject(expectedOutput1);
    expect(updateBurstState(input2)).toMatchObject(expectedOutput2);
  });

  it('detects burst input errors', () => {
    expect(getBurstErrors({ sliderID: null, min: -10, max: 10, step: 1 })).toEqual({
      sliderID: true
    });
    expect(getBurstErrors({ sliderID: 1, min: 10, max: 10, step: 1 })).toEqual({
      min: true,
      max: true,
      step: true
    });
    expect(getBurstErrors({ sliderID: 1, min: -10, max: 10, step: 21 })).toEqual({
      step: true
    });
    expect(getBurstErrors({ sliderID: NaN, min: NaN, max: NaN, step: NaN })).toEqual(
      { sliderID: true, min: true, max: true, step: true }
    );
  });

  it('detects settings errors', () => {
    expect(getSettingsErrors({ width: -30, height: 30, interval: 10 })).toEqual(
      { width: true }
    );
    expect(
      getSettingsErrors({ width: -30, height: -30, interval: 10 })
    ).toEqual({ width: true, height: true });
    expect(
      getSettingsErrors({ width: -30, height: -30, interval: -10 })
    ).toEqual({ width: true, height: true, interval: true });
  });
});
