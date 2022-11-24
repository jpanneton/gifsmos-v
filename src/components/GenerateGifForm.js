import React, { Component } from 'react';
import './GenerateGifForm.css';
import ColorPicker from './ColorPicker';

class GenerateGifForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
    this.handleTransparentBackground = this.handleTransparentBackground.bind(this);
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    if (evt.nativeEvent.submitter.name === "generateSvgButton") {
      await this.props.handleGenerateGIF('SVG');
    } else if (evt.nativeEvent.submitter.name === "generateMovButton") {
      await this.props.handleGenerateGIF('MOV');
    }
  }

  handleInputUpdate(evt) {
    if (evt.target.name === "name") {
      this.props.updateGIFFileName(evt.target.value);
    }
  }

  handleTransparentBackground(evt) {
    const checked = evt.target.checked;
    this.props.updateTransparentBackground(checked);
    if (checked) {
      this.props.updateAnimationBackground('#FFFFFF');
    }
  }

  render() {
    let colorPicker = (
      <ColorPicker
        updateAnimationBackground={this.props.updateAnimationBackground}
        animationBackground={this.props.animationBackground}
      />
    );

    return (
      <form className="GenerateGifForm-form" onSubmit={this.handleSubmit}>
        <input
          className="GenerateGifForm-input"
          name="name"
          aria-label="add a file name"
          placeholder="Add a File Name"
          onChange={this.handleInputUpdate}
          value={this.props.gifFileName}
        />
        <label className="GenerateGifForm-check"><input
          type="checkbox"
          id="transparentBackgroundButton"
          name="transparentBackgroundButton"
          onChange={this.handleTransparentBackground}
          checked={this.props.transparentBackground}
        />
          Transparent Background
        </label>
        {!this.props.transparentBackground ? colorPicker : null}
        <button
          className="GenerateGifForm-button"
          aria-label="generate gif"
          name="generateSvgButton"
          type="submit"
        >
          Download SVG
        </button>
        <button
          className="GenerateGifForm-button"
          aria-label="generate mov"
          name="generateMovButton"
          type="submit"
        >
          Download {this.props.numFrames > 1 ? 'MOV' : 'PNG'}
        </button>
      </form>
    );
  }
}

export default GenerateGifForm;
