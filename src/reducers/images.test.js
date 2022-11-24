import reducer from './images';
import {
  ADD_FRAME,
  UPDATE_GIF_PROGRESS,
  UPDATE_GIF_FILENAME,
  UNDO_BURST,
  UPDATE_IMAGE_SETTING,
  UPDATE_TRANSPARENT_BACKGROUND,
  UPDATE_ANIMATION_BACKGROUND,
  RESET
} from '../constants/action-types';

const initialState = {
  frames: {},
  frameIDs: [],
  redoFrames: [],
  gifProgress: 0,
  transparentBackground: true,
  animationBackground: '#FFFFFF',
  gifFileName: ''
};

describe('reducers', () => {
  describe('images', () => {
    it('returns the correct initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('handles ADD_FRAME', () => {
      const imageData = 'URI';
      const newState = reducer(initialState, {
        type: ADD_FRAME,
        payload: {
          id: 1,
          imageData
        }
      });
      expect(newState.frames).toEqual({ 1: imageData });
      expect(newState.frameIDs).toEqual([1]);
    });

    it('handles UPDATE_GIF_PROGRESS', () => {
      const gifProgress = 0.5;
      const newState = reducer(initialState, {
        type: UPDATE_GIF_PROGRESS,
        payload: { progress: gifProgress }
      });
      expect(newState.gifProgress).toEqual(gifProgress);
    });

    it('handles UPDATE_GIF_FILENAME', () => {
      const gifFileName = 'name';
      const newState = reducer(initialState, {
        type: UPDATE_GIF_FILENAME,
        payload: { gifFileName }
      });
      expect(newState.gifFileName).toEqual(gifFileName);
    });

    it('handles UNDO_BURST', () => {
      const frames = { 0: 'zero' };
      const frameIDs = [0];
      const newState = reducer(initialState, {
        type: UNDO_BURST,
        payload: { frames, frameIDs }
      });
      expect(newState.frames).toEqual(frames);
      expect(newState.frameIDs).toEqual(frameIDs);
    });

    it('handles image setting actions', () => {
      const gifProgress = 1;
      const progressState = reducer(initialState, {
        type: UPDATE_GIF_PROGRESS,
        payload: { progress: gifProgress }
      });
      const finalState = reducer(progressState, {
        type: UPDATE_IMAGE_SETTING,
        payload: { width: 200 }
      });
      expect(finalState.gifProgress).toEqual(0);
    });

    it('handles UPDATE_TRANSPARENT_BACKGROUND', () => {
      const transparentBackground = true;
      const newState = reducer(initialState, {
        type: UPDATE_TRANSPARENT_BACKGROUND,
        payload: { transparentBackground }
      });
      expect(newState.transparentBackground).toEqual(transparentBackground);
    });

    it('handles UPDATE_ANIMATION_BACKGROUND', () => {
      const animationBackground = '#FFFFFF';
      const newState = reducer(initialState, {
        type: UPDATE_ANIMATION_BACKGROUND,
        payload: { animationBackground }
      });
      expect(newState.animationBackground).toEqual(animationBackground);
    });

    it('handles RESET', () => {
      const gifProgress = 1;
      const progressState = reducer(initialState, {
        type: UPDATE_GIF_PROGRESS,
        payload: { progress: gifProgress }
      });
      const finalState = reducer(progressState, { type: RESET });
      expect(finalState).toEqual(initialState);
    });
  });
});
