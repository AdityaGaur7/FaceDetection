import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import * as THREE from 'three';

const FaceDetectionApp = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const renderer = useRef(null);
    const scene = useRef(null);
    const camera = useRef(null);
    const hat = useRef(null);

    useEffect(() => {
        const initThree = () => {
            renderer.current = new THREE.WebGLRenderer({ canvas: canvasRef.current });
            renderer.current.setSize(640, 480);

            scene.current = new THREE.Scene();

            camera.current = new THREE.PerspectiveCamera(45, 640 / 480, 0.1, 1000);
            camera.current.position.set(0, 0, 5);
            scene.current.add(camera.current);

            const loader = new THREE.TextureLoader();
            loader.load('./assets/react.svg', (texture) => {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                hat.current = new THREE.Mesh(geometry, material);
                scene.current.add(hat.current);
            });
        };

        initThree();
    }, []);

    useEffect(() => {
        const runFacemesh = async () => {
            const model = await facemesh.load();
            setInterval(() => {
                detectFaces(model);
            }, 100);
        };

        runFacemesh();
    }, []);

    const detectFaces = async (model) => {
        if (videoRef.current && videoRef.current.video.readyState === 4) {
            const predictions = await model.estimateFaces(videoRef.current.video, false);

            if (predictions.length > 0) {
                const face = predictions[0];
                const [x, y, z] = face.annotations.noseTip[0];
                hat.current.position.set(x * 2, -y * 2, -z * 2);
                renderer.current.render(scene.current, camera.current);
            }
        }
    };

    return (
        <div>
            <Webcam
                ref={videoRef}
                style={{
                    position: 'absolute',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zindex: 9,
                    width: 640,
                    height: 480,
                }}
            />
            <canvas ref={canvasRef} width={640} height={480} />
        </div>
    );
};

export default FaceDetectionApp;
