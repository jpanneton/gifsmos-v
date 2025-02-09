/*
 * Calculator helpers
 *
 * We're only using a small portion of the Desmos API, and in pretty spefic
 * ways. Defining a few helper methods makes those call sites more descriptive
 * and concise.
 */

import { calculator } from './calculator';
import { noSuchExpression, notASlider } from './error-messages';
import { saveGraphToLocal, getGraphFromLocal } from './local-storage-helpers';
import { optimize } from 'svgo/dist/svgo.browser.js';

/*
 * The calculator's async screenshot method takes a callback, but we'd prefer to
 * be able to `await` the results inside of async action creators, so wrap it up
 * in a promise.
 */
const requestImageData = opts =>
  new Promise((resolve, reject) => {
    opts.format = 'svg';
    calculator.asyncScreenshot(opts, data => resolve(data));
  });

export const getImageData = async opts => {
  let svgData = await requestImageData(opts);
  if (svgData) {
    const parser = new DOMParser();
    // Use viewBox instead of width / height
    const xmlDoc = parser.parseFromString(svgData, 'image/svg+xml');
    const width = xmlDoc.documentElement.getAttribute('width');
    const height = xmlDoc.documentElement.getAttribute('height');
    xmlDoc.documentElement.setAttribute('width', '100%');
    xmlDoc.documentElement.setAttribute('height', '100%');
    xmlDoc.documentElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    // Remove background node
    const elem = xmlDoc.getElementsByTagName('rect')[0];
    elem.parentNode.removeChild(elem);
    // Optimize svg output
    const serializer = new XMLSerializer();
    svgData = serializer.serializeToString(xmlDoc);
    return optimize(svgData, { multipass: true }).data;
  }
  return svgData;
};

const getExpByID = id => {
  return calculator.getExpressions().find(exp => exp.id === id);
};

/**
 * Returns an error message on failure.
 * Skips expressions that are not of type 'expression'
 */
export const setSliderByID = (id, val) => {
  const exp = getExpByID(id);
  if (!exp) return noSuchExpression(id);
  if (exp.type !== 'expression') return notASlider(id);

  const match = exp.latex.match(/(.+)=/);
  if (!match) return notASlider(id);

  const identifier = match[1];

  calculator.setExpression({ id, latex: `${identifier}=${val}` });
};

export const getSliderExpressions = () => {
  return calculator.getExpressions().reduce((acc, exp, i) => {
    return exp.latex &&
      exp.latex.match(/^(?:[a-zA-Z]|\\alpha|\\beta|\\phi|\\tau|\\theta)(?:_{[a-zA-Z0-9]+})?=-?\d+\.?\d*(?:e(?:\+|-)\d+)?$/)?.length === 1
      ? [...acc, { ...exp, expressionIdx: i + 1 }]
      : acc;
  }, []);
};

export const getCalcState = () => {
  return calculator.getState();
};

export const setCalcState = state => {
  return calculator.setState(state);
};

export const saveCurrentGraph = async (name, frames, frameIDs) => {
  const graph = calculator.getState();
  const preview = await getImageData({
    width: 160,
    height: 160,
    targetPixelRatio: 0.25
  });

  return saveGraphToLocal(graph, name, preview, frames, frameIDs);
};

export const loadSavedGraph = dateString => {
  const { graph, frames, frameIDs } = getGraphFromLocal(dateString);
  calculator.setState(graph);
  return { frames, frameIDs };
};
