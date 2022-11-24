import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { addSVGBackground } from '../lib/svgasm';
import './Frame.css';

const Frame = ({
  imageSrc,
  playing,
  togglePlaying,
  animationBackground
}) => (
  <div className={classNames('Frame', { 'Frame-empty': !imageSrc })}>
    {imageSrc && (
      <>
        <div className="Frame-image"
          dangerouslySetInnerHTML={{
            __html: addSVGBackground(imageSrc, animationBackground)
          }}
        />
        <button
          className="Frame-animation-button"
          onClick={togglePlaying}
          aria-label={
            playing ? 'pause preview animation' : 'play preview animation'
          }
        >
          {playing ? '\u275a \u275a' : '\u25b6'}
        </button>
      </>
    )}
  </div>
);

Frame.defaultProps = {
  imageSrc: '',
  playing: false,
  togglePlaying: () => {}
};

Frame.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  playing: PropTypes.bool.isRequired,
  togglePlaying: PropTypes.func.isRequired
};

export default Frame;
