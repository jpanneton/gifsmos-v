/*
 * The `images` slice holds the portion of the state related to actual image
 * data, both from individual frames and the final generated GIF.
 *
 * frames: a map from frame ids to data URIs
 * frameIDs: an array of images representing the final image order
 * gifProgress: a value in [0, 1] representing processing progress
 */

import {
  ADD_FRAME,
  UPDATE_GIF_PROGRESS,
  DELETE_FRAME_IDX,
  REDO_FRAME,
  UNDO_BURST,
  UPDATE_GIF_FILENAME,
  UPDATE_IMAGE_SETTING,
  UPDATE_BOUNDS_SETTING,
  UPDATE_STRATEGY,
  RESET,
  UPDATE_TRANSPARENT_BACKGROUND,
  UPDATE_ANIMATION_BACKGROUND
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

const images = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_FRAME: {
      const { id, imageData } = payload;
      const { frames, frameIDs } = state;
      return {
        ...state,
        ...{
          frames: { ...frames, [id]: imageData },
          frameIDs: [...frameIDs, id],
          gifProgress: 0,
          redoFrames: []
        }
      };
    }

    case DELETE_FRAME_IDX: {
      const { idx } = payload;
      const { frames, frameIDs } = state;

      const newFrames = {};
      frameIDs.pop();
      const newFrameIDs = [...frameIDs];
      let deletedFrame;

      Object.entries(frames).forEach(function(pair) {
        if (+pair[0] < idx) newFrames[pair[0]] = frames[pair[0]];
        if (+pair[0] === idx)
          deletedFrame = { id: pair[0], frameData: frames[pair[0]] };
        if (+pair[0] > idx) newFrames[+pair[0] - 1] = frames[pair[0]];
      });

      return {
        ...state,
        ...{
          frames: newFrames,
          framesIDs: newFrameIDs,
          gifProgress: 0,
          redoFrames: [...state.redoFrames, deletedFrame]
        }
      };
    }

    case REDO_FRAME: {
      const { id, frameData } = payload;
      const { frames, frameIDs, redoFrames } = state;

      const newFrames = {};
      const newFrameIDs = [...frameIDs, frameIDs.length + 1];
      const poppedRedoFrames = [...redoFrames];
      poppedRedoFrames.pop();

      Object.entries(frames).forEach(function(pair) {
        if (+pair[0] < id) newFrames[pair[0]] = frames[pair[0]];
        if (+pair[0] >= id) newFrames[+pair[0] + 1] = frames[pair[0]];
      });

      newFrames[id] = frameData;

      return {
        ...state,
        ...{
          frames: newFrames,
          frameIDs: newFrameIDs,
          redoFrames: poppedRedoFrames
        }
      };
    }

    case UPDATE_GIF_PROGRESS:
      return {
        ...state,
        gifProgress: payload.progress
      };

    case UPDATE_GIF_FILENAME:
      return {
        ...state,
        gifFileName: payload.gifFileName
      };

    case UNDO_BURST:
      return {
        ...state,
        frames: payload.frames,
        frameIDs: payload.frameIDs
      };

    case UPDATE_IMAGE_SETTING:
    case UPDATE_BOUNDS_SETTING:
    case UPDATE_STRATEGY:
      return {
        ...state,
        ...{
          gifProgress: 0,
        }
      };

    case UPDATE_TRANSPARENT_BACKGROUND:
      return {
        ...state,
        transparentBackground: payload.transparentBackground
      };

    case UPDATE_ANIMATION_BACKGROUND:
      return {
        ...state,
        animationBackground: payload.animationBackground
      };

    case RESET:
      return initialState;

    default:
      return state;
  }
};

export default images;
