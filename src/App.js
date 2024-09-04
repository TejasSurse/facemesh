//import logo from './logo.svg';
import './App.css';
import React, {useEffect, useRef} from 'react'; // useRef for reference to canvas component amd wencam
import * as tf from '@tensorflow/tfjs'; 
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';


function App() {

  // References Setup 
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // load facemesh
  const runFacemesh = async()=>{
    // getting neural network form tenserflow js 
    const net = await facemesh.load({
      inputResolution:{width:640, height:480}, scale:0.8 
    });
    setInterval(()=>{
      detect(net)
    }, 100)
  };
  // Detect Funciton 
  const detect = async (net)=>{
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4 )
    // this if basically checks 
        /*  ===4 means we are reciving data 
            webcam is run and saving data
        */
        
    {
      // get video Properties 
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections 
      const face = await net.estimateFaces(video);
      console.log(face);
      // get canvas context for drawing 
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face,ctx);
    }
  }
  runFacemesh();
  return (
    <div className="App">
        <Webcam ref={webcamRef} style={
          {
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:"center",
            zIndex:9,
            width:640,
            height:400
          }
        } ></Webcam>
        <canvas
          ref={canvasRef}
            style={{
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:"center",
            zIndex:9,
            width:640,
            height:400
    }}></canvas>
        
    </div>
    
  );
}

export default App;
