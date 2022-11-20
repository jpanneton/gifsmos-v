import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Frame from './Frame';
import InfoIcon from './InfoIcon';
import GenerateGifFormContainer from '../containers/GenerateGifFormContainer';
import './Preview.css';
import left from './icons/left.svg';
import right from './icons/right.svg';
import getTextPosition from '../lib/text-preview-helper';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showColorPicker: false
    };

    this.handleGenerateGIF = this.handleGenerateGIF.bind(this);
    this.handlePreviewUpdate = this.handlePreviewUpdate.bind(this);
    this.handleTogglePlaying = this.handleTogglePlaying.bind(this);
    this.handleDeleteFrame = this.handleDeleteFrame.bind(this);
    this.handleChangePreviewIdx = this.handleChangePreviewIdx.bind(this);
    this.handleRedoFrame = this.handleRedoFrame.bind(this);
    this.handleClickContainer = this.handleClickContainer.bind(this);
    this.updateColorPicker = this.updateColorPicker.bind(this);
  }

  handlePreviewUpdate(evt) {
    const { updatePreviewIdx, stopAnimation } = this.props;
    const idx = parseInt(evt.target.value, 10);
    stopAnimation();
    updatePreviewIdx(idx);
  }

  async handleGenerateGIF(animationFormat) {
    const {
      frames,
      frameIDs,
      width,
      height,
      oversample,
      interval,
      generateGIF,
      gifText,
      fontColor,
      textAlign,
      textBaseline
    } = this.props;

    const images = frameIDs.map(id => frames[id]);
    const multiplier = oversample ? 2 : 1;
    const opts = {
      animationFormat: animationFormat,
      gifWidth: width * multiplier,
      gifHeight: height * multiplier,
      interval: interval / 1000,
      text: gifText,
      fontColor: fontColor,
      textAlign: textAlign,
      textBaseline: textBaseline
    };
    await generateGIF(images, opts);
  }

  updateColorPicker(status) {
    this.setState({ showColorPicker: status });
  }

  handleClickContainer(evt) {
    if (evt.target.className === 'Preview Preview-expanded') {
      this.setState({
        showColorPicker: false
      });
    }
  }

  handleTogglePlaying() {
    const { playing, startAnimation, stopAnimation } = this.props;
    if (playing) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }

  handleDeleteFrame(curPrevIdx) {
    const { frameIDs, updatePreviewIdx, deleteFrameAtIdx } = this.props;

    const newIdx = curPrevIdx - 1 < 0 ? 0 : curPrevIdx - 1;
    deleteFrameAtIdx(frameIDs[curPrevIdx]);
    updatePreviewIdx(newIdx);
  }

  handleChangePreviewIdx(newIdx) {
    const { updatePreviewIdx } = this.props;
    updatePreviewIdx(newIdx);
  }

  handleRedoFrame() {
    const { redoFrames, redoLastFrame } = this.props;

    const lastFrame = redoFrames[redoFrames.length - 1];
    const id = lastFrame.id;
    const frameData = lastFrame.frameData;

    redoLastFrame({ id, frameData });
  }

  render() {
    const {
      expanded,
      previewIdx,
      frames,
      frameIDs,
      gifProgress,
      playing,
      redoFrames,
      gifText,
      fontColor,
      textAlign,
      textBaseline
    } = this.props;

    const numFrames = frameIDs.length;
    const imageSrc = frames[frameIDs[previewIdx]];

    let textPosition = getTextPosition(textAlign, textBaseline);

    if (!expanded) return <div className="Preview" />;

    const previewText = `Preview allows you to preview your future GIF by 
                         scrubbing through snapshots with the slider or 
                         previewing your GIF with the play/pause button.`;

    return (
      <div
        className={classNames('Preview', { 'Preview-expanded': expanded })}
        onClick={this.handleClickContainer}
      >
        <div className="Preview-header">
          <h2>Preview</h2>
          <InfoIcon infoText={previewText} />
        </div>
        <div className={classNames({ 'Preview-muted': !numFrames })}>
          <div className="Frame-section-container">
            <img
              className="Frame-directional-icon"
              src={left}
              onClick={() =>
                this.handleChangePreviewIdx(Math.max(previewIdx - 1, 0))
              }
              alt=""
            />
            <Frame
              imageSrc={imageSrc}
              playing={playing}
              togglePlaying={this.handleTogglePlaying}
              gifText={gifText}
              fontColor={fontColor}
              textPosition={textPosition}
            />
            <img
              className="Frame-directional-icon"
              src={right}
              onClick={() =>
                this.handleChangePreviewIdx(
                  Math.min(previewIdx + 1, frameIDs.length - 1)
                )
              }
              alt=""
            />
          </div>
          <div className="Preview-scrubber" data-testid="Preview-scrubber">
            <input
              type="range"
              min="0"
              max={numFrames - 1}
              value={previewIdx}
              onChange={this.handlePreviewUpdate}
              disabled={!numFrames}
              aria-label="preview frame index"
            />
            <div
              className="Preview-scrubber-counter"
              data-testid="Preview-scrubber-counter"
            >
              {numFrames ? `${previewIdx + 1} / ${numFrames}` : '0 / 0'}
            </div>
          </div>
        </div>
        <div className="Frame-delete">
          {numFrames ? (
            <button
              className="Frame-delete-redo-button"
              aria-label="delete this frame"
              onClick={() => this.handleDeleteFrame(previewIdx)}
            >
              Delete this Frame
            </button>
          ) : null}
          {redoFrames.length ? (
            <button
              className="Frame-delete-redo-button"
              aria-label="redo last frame"
              onClick={this.handleRedoFrame}
            >
              Undo Delete
            </button>
          ) : null}
        </div>
        <div className="Frame-timeline">
          {frameIDs.map((frameID, i) => (
            <div
              className={classNames('Frame-scroll', {
                'Frame-scroll-active': previewIdx === i
              })}
              onClick={() => this.handleChangePreviewIdx(i)}
              key={`frame-id-${frameID}`}
              dangerouslySetInnerHTML={{ __html: frames[frameID] }}
            />
          ))}
        </div>
        {!numFrames ? (
          <div className="Preview-no-frames">
            No frames have been captured. Use the camera or burst tools to add
            some!
          </div>
        ) : null}
        <div className="Preview-create">
          {!!numFrames ? (
            <GenerateGifFormContainer
              handleGenerateGIF={this.handleGenerateGIF}
              showColorPicker={this.state.showColorPicker}
              updateColorPicker={this.updateColorPicker}
            />
          ) : null}
        </div>
        {gifProgress > 0 ? (
          <div className="Preview-progress-outer">
            <div
              className="Preview-progress-inner"
              style={{
                width: `${100 * gifProgress}%`,
                background: gifProgress === 1 ? '#2ecc40' : '#1869FF'
              }}
            />
            <p>{Math.round(100 * gifProgress)}%</p>
          </div>
        ) : null}
        {gifProgress === 1 ? (
          <div className="Preview-progress-success">Download Successful</div>
        ) : null}
      </div>
    );
  }
}

Preview.defaultProps = {
  expanded: false,
  previewIdx: 0,
  playing: false,
  frames: {},
  frameIDs: [],
  gifProgress: 0,
  width: 800,
  height: 800,
  oversample: false,
  interval: 30,
  redoFrames: [],
  updatePreviewIdx: () => {},
  generateGIF: async () => {},
  startAnimation: () => {},
  stopAnimation: () => {}
};

Preview.propTypes = {
  expanded: PropTypes.bool.isRequired,
  previewIdx: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
  frames: PropTypes.object.isRequired,
  frameIDs: PropTypes.array.isRequired,
  gifProgress: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  oversample: PropTypes.bool.isRequired,
  interval: PropTypes.number.isRequired,
  redoFrames: PropTypes.array.isRequired,
  updatePreviewIdx: PropTypes.func.isRequired,
  generateGIF: PropTypes.func.isRequired,
  startAnimation: PropTypes.func.isRequired,
  stopAnimation: PropTypes.func.isRequired
};

export default Preview;
