// backgroundSubtraction.js

import * as bodyPix from '@tensorflow-models/body-pix';

export async function backgroundSubtraction(videoElementId, canvasElementId) {
  const net = await bodyPix.load();

  const video = document.getElementById(videoElementId);
  const canvas = document.getElementById(canvasElementId);

  async function detect() {
    const segmentation = await net.segmentPerson(video);
    bodyPix.drawMask(canvas, video, segmentation);
    requestAnimationFrame(detect);
  }

  detect();
}
