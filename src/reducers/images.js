/*
 * The `images` slice holds the portion of the state related to actual image
 * data, both from individual frames and the final generated GIF.
 *
 * frames: a map from frame ids to data URIs
 * frameIDs: an array of images representing the final image order
 * gifProgress: a value in [0, 1] representing processing progress
 * gifData: the data URI of the generated GIF
 */

import {
  ADD_FRAME,
  UPDATE_GIF_PROGRESS,
  ADD_GIF,
  UPDATE_IMAGE_SETTING,
  UPDATE_BOUNDS_SETTING,
  UPDATE_STRATEGY,
  RESET,
  ADD_TEXT,
  ADD_TEXT_COLOR
} from '../constants/action-types';

const initialState = {
  frames: {},
  frameIDs: [],
  gifProgress: 0,
  gifData: '',
  caption: '',
  fontColor: '#E79600'
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
          gifData: ''
        }
      };
    }

    case UPDATE_GIF_PROGRESS:
      return {
        ...state,
        gifProgress: payload.progress
      };

    case ADD_GIF:
      return {
        ...state,
        gifData: payload.imageData
      };

    case UPDATE_IMAGE_SETTING:
    case UPDATE_BOUNDS_SETTING:
    case UPDATE_STRATEGY:
      return {
        ...state,
        ...{
          gifProgress: 0,
          gifData: ''
        }
      };

    case ADD_TEXT:
      return {
        ...state,
        ...{
          caption: payload.text
        }
      };

    case ADD_TEXT_COLOR:
      return {
        ...state,
        fontColor: payload.fontColor
      };

    case RESET:
      return initialState;

    default:
      return state;
  }
};

export default images;
