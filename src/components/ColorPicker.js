import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
  }

  handleInputUpdate(color) {
    this.props.updateAnimationBackground(color.hex);
  }

  render() {
    return (
      <div>
        <ChromePicker
          className="ColorPicker"
          onChange={this.handleInputUpdate}
          color={this.props.animationBackground}
          disableAlpha={true}
        />
      </div>
    );
  }
}

export default ColorPicker;
