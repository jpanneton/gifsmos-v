import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { imageSettingPropTypes } from '../lib/propTypes';
import { imageSettingDefaults } from '../lib/defaultProps';
import classNames from 'classnames';
import { isPositiveInteger } from '../lib/input-helpers';
import './Settings.css';
import InfoIcon from './InfoIcon';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
    this.handleStrategyUpdate = this.handleStrategyUpdate.bind(this);
  }

  handleInputUpdate(evt) {
    const {
      target: { name, value, checked }
    } = evt;

    const { updateSetting } = this.props;
    const val = name === 'oversample' ? checked : parseInt(value, 10);
    updateSetting(name, val);
  }

  handleStrategyUpdate(evt) {
    const {
      target: { name, value }
    } = evt;
    const { updateSetting } = this.props;
    updateSetting(name, value);
  }

  render() {
    const { expanded, width, height, oversample } = this.props;

    if (!expanded) return <div className="Settings" />;

    const settingsText = `The settings panel allows you to set your desired image dimensions 
                          as well as the viewport computing strategy.`;
    return (
      <div
        className={classNames('Settings', { 'Settings-expanded': expanded })}
      >
        <OverlayScrollbarsComponent
          className="overlay-scrollbar"
          defer
        >
          <div className="Settings-header">
            <h2>Settings</h2>
            <InfoIcon infoText={settingsText} />
          </div>

          <div className="Settings-options-container">
            <div>Image Width</div>
            <input
              className={classNames('Settings-input', {
                'Settings-input-error': !isPositiveInteger(width)
              })}
              type="number"
              name="width"
              aria-label="image width"
              value={isNaN(width) ? '' : width}
              onChange={this.handleInputUpdate}
            />

            <div>Image Height</div>
            <input
              className={classNames('Settings-input', {
                'Settings-input-error': !isPositiveInteger(height)
              })}
              type="number"
              name="height"
              aria-label="image height"
              value={isNaN(height) ? '' : height}
              onChange={this.handleInputUpdate}
            />

            <div>Strategy</div>
            <select
              className="Settings-dropdown"
              name="strategy"
              aria-label="strategy"
              onChange={this.handleStrategyUpdate}
            >
              <option value="contain" defaultValue>
                Contain
              </option>
              <option value="stretch">Stretch</option>
              <option value="preserveX">PreserveX</option>
              <option value="preserveY">PreserveY</option>
            </select>
          </div>

          <div className="removed-feature">
            <input
              type="checkbox"
              name="oversample"
              aria-label="oversample image"
              checked={oversample}
              onChange={this.handleInputUpdate}
            />
            <span>Oversample</span>
          </div>
        </OverlayScrollbarsComponent>
      </div>
    );
  }
}

Settings.defaultProps = {
  expanded: false,
  ...imageSettingDefaults,
  interval: 30,
  updateSetting: () => {}
};

Settings.propTypes = {
  expanded: PropTypes.bool.isRequired,
  ...imageSettingPropTypes,
  interval: PropTypes.number.isRequired,
  updateSetting: PropTypes.func.isRequired
};

export default Settings;
