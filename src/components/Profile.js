import React, { useState } from 'react';
import Webcam from 'react-webcam';
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import personImg from '../human.jpg';

const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
}
const Profile = () => {
  const [picture, setPicture] = useState('');
  const webcamRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const [visina, setVisina] = useState(0);
  const [kolkovi, setKolkovi] = useState(0);
  const [struk, setStruk] = useState(0);
  const [gradi, setGradi] = useState(0);
  const [ramena, setRamena] = useState(0);

  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
    runBodysegment();
  });

  const sample = React.useCallback(() => {
    setPicture(personImg);
    runBodysegment();
  });

  const runBodysegment = async () => {
    const net = await bodyPix.load({
      architecture: 'ResNet50',
      outputStride: 16,
      quantBytes: 4,
      maxDetections: 10,
      scoreThreshold: 0.3

    });
    console.log("BodyPix model loaded.");
    detect(net);
  };

  const detect = async (net) => {


    imageRef.current.width = 640;
    imageRef.current.height = 480;

    canvasRef.current.width = 640;
    canvasRef.current.height = 480;

    const person = await net.segmentPersonParts(imageRef.current, {
      internalResolution: 'full',
      segmentationThreshold: 0.4
    });


    const nose = person.allPoses[0].keypoints[0].position;
    const leftEye = person.allPoses[0].keypoints[1].position;
    const rightEye = person.allPoses[0].keypoints[2].position;
    const leftEar = person.allPoses[0].keypoints[3].position;
    const rightEar = person.allPoses[0].keypoints[4].position;
    const leftShoulder = person.allPoses[0].keypoints[5].position;
    const rightShoulder = person.allPoses[0].keypoints[6].position;
    const leftElbow = person.allPoses[0].keypoints[7].position;
    const rightElbow = person.allPoses[0].keypoints[8].position;
    const leftWrist = person.allPoses[0].keypoints[9].position;
    const rightWrist = person.allPoses[0].keypoints[10].position;
    const leftHip = person.allPoses[0].keypoints[11].position;
    const rightHip = person.allPoses[0].keypoints[12].position;
    const leftKnee = person.allPoses[0].keypoints[13].position;
    const rightKnee = person.allPoses[0].keypoints[14].position;
    const leftAnkle = person.allPoses[0].keypoints[15].position;
    const rightAnkle = person.allPoses[0].keypoints[16].position;

    setVisina((leftAnkle.y - leftEye.y) * 0.5);
    setKolkovi((leftHip.x - rightHip.x) * 2);
    setStruk((leftWrist.x - rightWrist.x) * 0.5 * 2);
    setGradi((leftElbow.x - rightElbow.x) * 0.5 * 2);
    setRamena((leftShoulder.x - rightShoulder.x) * 0.5);

    console.log(person);

    const coloredPartImage = bodyPix.toColoredPartMask(person);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const canvas = canvasRef.current;

    bodyPix.drawMask(
      canvas,
      imageRef.current,
      coloredPartImage,
      opacity,
      maskBlurAmount,
      flipHorizontal
    );
  };


  return (
    <div>
      <h2 className="mb-5 text-center">
        React Realtime Body Measurments
      </h2>

      <div>
        {picture == '' ? (
          <Webcam
            audio={false}
            height={480}
            ref={webcamRef}
            width={640}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img
            src={picture}
            ref={imageRef}
          />
        )}
      </div>
      <canvas
        ref={canvasRef}
      />
      <div>

        <button
          onClick={(e) => {
            e.preventDefault();
            capture();
          }}
          className="btn btn-danger"
        >
          Capture
        </button>
        <br /> <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            sample();
          }}
          className="btn btn-danger"
        >
          Sample
        </button>

        <div>
          <h2>Висина: {visina.toFixed(2)}</h2>
          <h2>Обем на колкови: {kolkovi.toFixed(2)}</h2>
          <h2>Обем на струк: {struk.toFixed(2)}</h2>
          <h2>Обем на гради: {gradi.toFixed(2)}</h2>
          <h2>Ширина на рамена: {ramena.toFixed(2)}</h2>



        </div>

      </div>
    </div>
  )
}
export default Profile