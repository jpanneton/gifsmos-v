import { connect } from 'react-redux';
import GenerateGifForm from '../components/GenerateGifForm';
import {
  updateGIFFileName,
  updateTransparentBackground,
  updateAnimationBackground,
  generateGIF
} from '../actions';

const mapStateToProps = (state, ownProps) => {
  const { images } = state;
  const { transparentBackground, animationBackground, gifFileName } = images;

  return {
    handleGenerateGIF: ownProps.handleGenerateGIF,
    transparentBackground,
    animationBackground,
    gifFileName
  };
};

const GenerateGifFormContainer = connect(
  mapStateToProps,
  {
    updateTransparentBackground,
    updateAnimationBackground,
    updateGIFFileName,
    generateGIF
  }
)(GenerateGifForm);

export default GenerateGifFormContainer;
