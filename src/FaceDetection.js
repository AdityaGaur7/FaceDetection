// FaceDetection.js

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export async function faceDetection() {
  const model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
  const video = document.getElementById('input_video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  async function detect() {
    const predictions = await model.estimateFaces({
      input: video,
    });

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      predictions.forEach(prediction => {
        const keypoints = prediction.scaledMesh;

        ctx.fillStyle = 'red';
        for (let i = 0; i < keypoints.length; i++) {
          const [x, y] = keypoints[i];
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }

    requestAnimationFrame(detect);
  }

  video.addEventListener('play', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    detect();
  });
}
