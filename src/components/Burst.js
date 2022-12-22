import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Plot from '../components/Plot';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { getCalcState, setCalcState } from '../lib/calc-helpers';
import { imageSettingPropTypes } from '../lib/propTypes';
import { imageSettingDefaults } from '../lib/defaultProps';
import { easeFunction } from '../lib/math-helpers';

import {
  validatePositiveValue,
  validateBurstSetting,
  updateBurstState,
  getBurstErrors
} from '../lib/input-helpers';

import './Burst.css';
import InfoIcon from './InfoIcon';

class Burst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderID: null,
      min: -10,
      max: 10,
      stepMode: 'MANUAL_STEP_MODE',
      step: 1,
      interval: 30,
      fps: 0,
      duration: 0,
      easeSlope: 0.01,
      easePosition: 0.5,
      frameCount: 0,
      isCapturing: false,
      canUndo: false,
      prevFrames: {},
      prevFrameIDs: [],
      prevCalcState: {},
      errors: {}
    };
    this.state = updateBurstState(this.state);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
    this.handleStepModeUpdate = this.handleStepModeUpdate.bind(this);
    this.handleRequestBurst = this.handleRequestBurst.bind(this);
    this.handleUndoBurst = this.handleUndoBurst.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.frameIDs.length !== prevProps.frameIDs.length) {
      this.setState({ canUndo: false });
    }

    // Update slider ID
    let newSliderID = undefined;
    if (this.props.burstSliders.length && !prevProps.burstSliders.length) {
      // If slider count was = 0 and now is > 0
      newSliderID = this.props.burstSliders[0].id;
    } else if (!this.props.burstSliders.length && prevProps.burstSliders.length) {
      // If slider count was > 0 and now is = 0
      newSliderID = null;
    } else if (this.state.sliderID !== null) {
      if (!this.props.burstSliders.find(exp => exp.id === this.state.sliderID)) {
        // If selected slider has been removed
        newSliderID = this.props.burstSliders[0].id;
      }
    }
    if (newSliderID !== undefined) {
      this.handleInputUpdate({
        target: {
          name: 'sliderID',
          value: newSliderID
        }
      });
    }
  }

  handleInputUpdate(evt) {
    const {
      target: { name, value }
    } = evt;
    let newState = this.state;
    const val = name === 'sliderID' ? value : parseFloat(value);

    newState[name] = validateBurstSetting(name, val);
    newState = updateBurstState(newState);
    newState.errors = getBurstErrors(newState);

    this.setState(newState, () => {
      if (!this.state.errors.interval) {
        this.props.updateSetting('interval', this.state.interval);
      }
    });
  }

  handleStepModeUpdate(evt) {
    this.setState({
      stepMode: evt.currentTarget.value,
    });
  }

  async handleRequestBurst() {
    this.setState({ isCapturing: true, canUndo: false });
    const { requestBurst, expanded, frames, frameIDs, ...imgOpts } = this.props;
    const prevCalcState = getCalcState();
    const undoData = await requestBurst({
      ...this.state,
      ...imgOpts,
      frames,
      frameIDs
    });
    if (undoData) {
      const { prevFrames, prevFrameIDs } = undoData;
      this.setState({
        isCapturing: false,
        canUndo: true,
        prevFrames,
        prevFrameIDs,
        prevCalcState
      });
    } else {
      this.setState({ isCapturing: false });
    }
  }

  handleUndoBurst() {
    const { undoBurst } = this.props;
    const { prevFrames, prevFrameIDs, prevCalcState } = this.state;
    undoBurst(prevFrames, prevFrameIDs);
    setCalcState(prevCalcState);
    this.setState({
      canUndo: false,
      prevFrames: {},
      prevFrameIDs: [],
      prevCalcState: {}
    });
  }

  render() {
    const { sliderID, min, max, stepMode, step, errors } = this.state;
    const { interval, fps, duration, frameCount } = this.state;
    const { easeSlope, easePosition } = this.state;
    const { expanded, burstSliders } = this.props;
    const burstInfo = `Burst allows you to generate multiple snapshots
      of your graph at one time. Enter the relevant info in the input fields
      and hit capture to watch the magic happen.`;

    if (!expanded) return <div className="Burst" />;

    return (
      <div className={classNames('Burst', { 'Burst-expanded': expanded })}>
        <OverlayScrollbarsComponent
          className="overlay-scrollbar"
          defer
        >
          <div className="Burst-header">
            <h2>Burst</h2>
            <InfoIcon infoText={burstInfo} />
          </div>
          <div className="Burst-options-container">
            <div className="Burst-dropdown-container">
              <div>Slider</div>
              <select
                className={classNames('Burst-dropdown', {
                  'Burst-input-error': !!errors.sliderID
                })}
                name="sliderID"
                aria-label="slider id"
                value={sliderID !== null ? sliderID : undefined}
                onChange={this.handleInputUpdate}
              >
                {sliderID === null ? (
                  <option value={undefined}>No Sliders</option>
                ) : null}
                {sliderID !== null && burstSliders.map(exp => {
                  return (
                    <option
                      key={`slider-${exp.id}`}
                      value={exp.id}
                      defaultValue={exp.id === sliderID}
                    >
                      {exp.latex.split('=').join(' = ')}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>Slider Min</div>
            <input
              className={classNames('Burst-input', {
                'Burst-input-error': !!errors.min
              })}
              type="number"
              name="min"
              aria-label="slider minimum"
              value={isNaN(min) ? '' : min}
              onChange={this.handleInputUpdate}
            />
            <div>Slider Max</div>
            <input
              className={classNames('Burst-input', {
                'Burst-input-error': !!errors.max
              })}
              type="number"
              name="max"
              aria-label="slider maximum"
              value={isNaN(max) ? '' : max}
              onChange={this.handleInputUpdate}
            />
            <div>
              <input
                type="radio"
                name="step-mode-radio-group"
                aria-label="manual step mode"
                value="MANUAL_STEP_MODE"
                checked={stepMode === "MANUAL_STEP_MODE"}
                onChange={this.handleStepModeUpdate}
              />
              <span>Manual Step</span>
            </div>
            <div className={classNames('Burst-radio-group', {
                'disabled-feature': stepMode !== "MANUAL_STEP_MODE"
            })}>
              <div>Slider Step</div>
              <input
                className={classNames('Burst-input', {
                  'Burst-input-error': !!errors.step
                })}
                type="number"
                name="step"
                aria-label="slider step"
                value={validatePositiveValue(step) || step === 0 ? step : ''}
                onChange={this.handleInputUpdate}
              />
              <div>Interval (ms)</div>
              <input
                className={classNames('Burst-input', {
                  'Burst-input-error': !!errors.interval
                })}
                type="number"
                name="interval"
                aria-label="frame interval"
                value={validatePositiveValue(interval) ? interval : ''}
                onChange={this.handleInputUpdate}
              />
            </div>
            <div>
              <input
                type="radio"
                name="step-mode-radio-group"
                aria-label="automatic step mode"
                value="AUTO_STEP_MODE"
                checked={stepMode === "AUTO_STEP_MODE"}
                onChange={this.handleStepModeUpdate}
              />
              <span>Auto Step</span>
            </div>
            <div className={classNames('Burst-radio-group', {
                'disabled-feature': stepMode !== "AUTO_STEP_MODE"
            })}>
              <div>Target FPS</div>
              <input
                className={classNames('Burst-input', {
                  'Burst-input-error': !!errors.fps
                })}
                type="number"
                name="fps"
                aria-label="animation target fps"
                value={validatePositiveValue(fps) ? fps : ''}
                onChange={this.handleInputUpdate}
              />
              <div>Duration (ms)</div>
              <input
                className={classNames('Burst-input', {
                  'Burst-input-error': !!errors.duration
                })}
                type="number"
                name="duration"
                aria-label="frame animation duration"
                value={validatePositiveValue(duration) ? duration : ''}
                onChange={this.handleInputUpdate}
              />
            </div>
            <Plot
              className='Burst-plot'
              fn={x => easeFunction(x, easeSlope, easePosition)}
              thickness={4}
            />
            <div>Ease Slope</div>
            <input
              className="Burst-input"
              type="range"
              name="easeSlope"
              aria-label="ease slope"
              min="0.01"
              max="30"
              step="0.3"
              defaultValue={easeSlope}
              onChange={this.handleInputUpdate}
            />
            <div>Ease Pos</div>
            <input
              className="Burst-input"
              type="range"
              name="easePosition"
              aria-label="ease position"
              min="0"
              max="1"
              step="0.01"
              defaultValue={easePosition}
              onChange={this.handleInputUpdate}
            />
            <div>
              Frame Count: {isNaN(frameCount) ? 0 : Math.round(frameCount)}
            </div>
            <div className={Object.keys(errors).length === 0 ? null : 'disabled-feature'}>
              <button
                className={classNames('Burst-button', {
                  capturing: this.state.isCapturing
                })}
                onClick={this.handleRequestBurst}
                aria-label="capture several frames"
              >
                {this.state.isCapturing ? 'Capturing...' : 'Capture'}
              </button>
            </div>
            {this.state.canUndo ? (
              <div>
                <button
                  className="Burst-button"
                  onClick={this.handleUndoBurst}
                  aria-label="undo last burst"
                >
                  Undo
                </button>
              </div>
            ) : null}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    );
  }
}

Burst.defaultProps = {
  ...imageSettingDefaults,
  expanded: false,
  requestBurst: () => {},
  burstSliders: [],
  frameIDs: []
};

Burst.propTypes = {
  ...imageSettingPropTypes,
  expanded: PropTypes.bool.isRequired,
  requestBurst: PropTypes.func.isRequired,
  burstSliders: PropTypes.array.isRequired,
  frameIDs: PropTypes.array.isRequired
};

export default Burst;
