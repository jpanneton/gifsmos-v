/**
 * Minimal JavaScript implementation of https://github.com/tomkwok/svgasm
 * Copyright (C) 2021 Tom Kwok https://tomkwok.com/
 * Copyright (C) 2021 Jérémi Panneton https://jpanneton.dev/
 */
export const createAnimatedSVG = async (args, cb) => {
  const images = args.images;
  const animationTiming = 'linear';

  let output = '';
  let closingTag = '';

  for (let i = 0; i < images.length; i++) {
    let svgData = images[i];

    // Find the first occurrence of '<svg'
    const svgTagStart = svgData.indexOf('<svg');
    // Find the first occurrence of '>' after '<svg'
    const svgTagStartEnd = svgData.indexOf('>', svgTagStart) + 1;

    if (i === 0) {
      // Output opening '<svg>' tag if this file is first in the list
      const svgTag = svgData.substr(0, svgTagStartEnd - 1);
      output += svgTag;

      // Add 'xmlns' attribute if missing (autotrace output) to make SVG valid
      if (svgTag.indexOf('xmlns') === -1) {
        output += ' xmlns="http://www.w3.org/2000/svg"';
      }

      // Close '<svg>' tag
      output += '>';

      // All elements are set to hidden before any element for a frame loads
      // Otherwise, Chrome starts timing animation of elements as SVG loads
      output += '<defs><style type="text/css">';
      for (let j = 0; j < images.length; j++) {
        if (j > 0) {
          output += ',';
        }
        output += `#_${j}`;
      }
      output += '{visibility:hidden}</style></defs>';

      // Add background element (if requested)
      if (!args.transparentBackground) {
        output += createBackgroundElement(
          args.animationBackground,
          args.gifWidth,
          args.gifHeight
        );
      }
    }

    // Find the first occurrence of '</svg>' in string
    const svgTagEnd = svgData.indexOf('</svg');

    if (i === 0) {
      // Save ending tags ('</svg>', and others if any) for output at the end
      closingTag = svgData.substr(svgTagEnd);
    }

    // Unwrap '<svg>' tag in string and mutate string
    svgData = svgData.substr(svgTagStartEnd, svgTagEnd - svgTagStartEnd);

    // Add prefix to element IDs to avoid conflict since IDs are global in an SVG
    // and update all links to an element with the prefixed IDs
    svgData = svgData
      .replaceAll(' id="', ` id="_${i}`)
      .replaceAll(' href="#', ` href="#_${i}`)
      .replaceAll(' xlink:href="#', ` xlink:href="#_${i}`)
      .replaceAll('="url(#', `="url(#_${i}`); // Example attrs: fill, clip-path

    // Output frame wrapped in a '<g>' tag for grouping
    output += `<g id="_${i}">${svgData}</g>`;

    args.progressCallback(i / images.length);
  }

  // Output CSS animation definitions with no unnecessary whitespace
  // Note that animation is defined after frame groups because otherwise
  // heavy flickering may occur in Chrome due to animation start time mismatch
  output += '<defs><style type="text/css">';

  for (let i = 0; i < images.length; i++) {
    if (i > 0) {
      output += ',';
    }
    output += `#_${i}`;
  }
  output += `{animation:${args.interval *
    images.length}s ${animationTiming} _k infinite}`;

  for (let i = 0; i < images.length; i++) {
    output += `#_${i}{animation-delay:${args.interval * i}s}`;
  }
  output += '@keyframes _k{';
  output += `0%,${100 / images.length}%{visibility:visible}`;
  output += `${(100.0 + 0.0001 / args.interval) /
    images.length}%,100%{visibility:hidden}}`;

  output += '</style></defs>';
  output += closingTag;

  return cb({ image: output });
};

export const createSVG = async (args, cb) => {
  return cb({ image: updateSVGBackground(args.image, args) });
};

export const updateSVGBackground = (svgData, args) => {
  if (!args.transparentBackground) {
    // Find the first occurrence of '<svg'
    const svgTagStart = svgData.indexOf('<svg');
    // Find the first occurrence of '>' after '<svg'
    const svgTagStartEnd = svgData.indexOf('>', svgTagStart) + 1;

    // Define background element
    const backgroundElement = createBackgroundElement(
      args.animationBackground,
      args.gifWidth,
      args.gifHeight
    );

    // Insert background element
    svgData = svgData.slice(0, svgTagStartEnd) + backgroundElement + svgData.slice(svgTagStartEnd);
  }
  return svgData;
};

export const addSVGBackground = (svgData, backgroundColor) => {
  if (svgData) {
    // Find the first occurrence of '<svg'
    const svgTagStart = svgData.indexOf('<svg');
    // Find the first occurrence of '>' after '<svg'
    const svgTagStartEnd = svgData.indexOf('>', svgTagStart) + 1;

    // Get viewBox frame dimensions
    const viewboxStart = svgData.indexOf('viewBox="', svgTagStart) + 9;
    const viewboxEnd = svgData.indexOf('"', viewboxStart);
    const viewbox = svgData.substr(viewboxStart, viewboxEnd - viewboxStart).split(' ');
    const width = parseInt(viewbox[2]);
    const height = parseInt(viewbox[3]);

    // Define background element
    const backgroundElement = createBackgroundElement(
      backgroundColor,
      width,
      height
    );

    // Insert background element
    svgData = svgData.slice(0, svgTagStartEnd) + backgroundElement + svgData.slice(svgTagStartEnd);
  }
  return svgData;
};

const createBackgroundElement = (color, width, height) => {
  return `<path fill="${color}" ` +
  `class="dcg-svg-background" ` +
  `d="M0 0h${width}v${height}H0z"/>`;
};
