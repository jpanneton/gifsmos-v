import { updateSVGBackground } from '../lib/svgasm';
import { Canvg, presets } from 'canvg'
import { createFFmpeg } from '@ffmpeg/ffmpeg';

/**
 * Copyright (C) 2022 Jérémi Panneton https://jpanneton.dev/
 */
export const createMOV = async (args, cb) => {
  const images = args.images;
  const fps = String(Math.round(1 / args.interval));

  // Use single-threaded version
  // Slower, but doesn't require SharedArrayBuffer (cross-origin isolation)
  const ffmpeg = createFFmpeg({
    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
    progress: p => {
      args.progressCallback(0.99 + 0.01 * p.ratio);
    }
  });

  await ffmpeg.load();

  const width = args.gifWidth;
  const height = args.gifHeight;
  let output = '';

  for (let i = 0; i < images.length; i++) {
    const svgData = await updateSVGBackground(images[i], args);

    // Setup canvg with SVG data
    const canvas = new OffscreenCanvas(width, height);
    const canvg = await Canvg.from(canvas.getContext('2d'), svgData, presets.offscreen());
    
    // Resize output image
    // canvg.resize(width, height, true)

    // Render frame
    await canvg.render();

    const pngBlob = await canvas.convertToBlob();
    const pngBlobData = await pngBlob.arrayBuffer();
    ffmpeg.FS('writeFile', `frame${("000000" + i).slice(-7)}.png`, new Uint8Array(pngBlobData));

    args.progressCallback(0.99 * i / images.length);
  }

  // Run FFmpeg (same as CLI)
  await ffmpeg.run('-framerate', fps, '-i', 'frame%07d.png', '-r', fps, '-vcodec', 'png', 'animation.mov');

  // Cleanup frame files
  for (let i = 0; i < images.length; i++) {
    ffmpeg.FS('unlink', `frame${("000000" + i).slice(-7)}.png`);
  }

  // Read generated animation file
  output = ffmpeg.FS('readFile', 'animation.mov');

  // Cleanup generated animation file
  ffmpeg.FS('unlink', 'animation.mov');

  args.progressCallback(1);
  return cb({ image: output });
};

export const createPNG = async (args, cb) => {
  const svgData = await updateSVGBackground(args.image, args);

  // Get frame dimensions
  const width = args.gifWidth;
  const height = args.gifHeight;

  // Setup canvg with SVG data
  const canvas = new OffscreenCanvas(width, height);
  const canvg = await Canvg.from(canvas.getContext('2d'), svgData, presets.offscreen());

  // Resize output image
  // canvg.resize(width, height, true)

  // Render frame
  await canvg.render();

  const pngBlob = await canvas.convertToBlob();
  const pngBlobData = await pngBlob.arrayBuffer();

  return cb({ image: pngBlobData });
};
