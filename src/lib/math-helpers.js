/*
 * Math helpers.
 */

export const easeFunction = (x, slope, pos) => {
  const lerp = (x, min, max) => {
    return min + x * (max - min);
  };
  const sigmoid = x => {
    return 1 / (1 + Math.pow(Math.E, slope / 2 - x));
  };
  const easeinout = x => {
    return (sigmoid(slope * x) - sigmoid(0)) / (sigmoid(slope) - sigmoid(0));
  };
  const easein = x => {
    return 2 * easeinout(x / 2);
  };
  const easeout = x => {
    return 2 * (easeinout(0.5 + x / 2) - 0.5);
  };

  let y = x;
  if (pos === 0.5) {
    y = easeinout(x);
  } else if (pos < 0.5) {
    y = easeinout(lerp(pos / 0.5, easeout(x), x));
  } else if (pos > 0.5) {
    y = easeinout(lerp((pos - 0.5) / 0.5, x, easein(x)));
  }
  return y;
};
