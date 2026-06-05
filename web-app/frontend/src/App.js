import React, { useRef, useState } from 'react';

import CanvasDraw from 'react-canvas-draw';

import axios from 'axios';

import './App.css';


function App() {

  const canvasRef = useRef(null);

  const [prediction, setPrediction] = useState(null);

  const [confidence, setConfidence] = useState(null);


  const clearCanvas = () => {

  canvasRef.current.clear();

  setPrediction(null);

  setConfidence(null);
};


  const predictDigit = async () => {

    const dataUrl =
      canvasRef.current.canvasContainer
      .children[1]
      .toDataURL();

    
    const response = await fetch(dataUrl);

    const blob = await response.blob();

    
    const formData = new FormData();

    formData.append('image', blob, 'digit.png');


    const result = await axios.post(
      'http://127.0.0.1:5000/predict',
      formData
    );


    setPrediction(result.data.prediction);

    setConfidence(result.data.confidence);
  };


  return (

    <div className="app-container">

      <h1 className="title">
        AI Digit Recognizer
      </h1>

      
      <p className="subtitle">
        Draw a digit and let AI predict it
      </p>


      <div className="canvas-box">

        <CanvasDraw
          ref={canvasRef}
          brushRadius={18}
          brushColor="white"
          backgroundColor="black"
          lazyRadius={0}
          canvasWidth={250}
          canvasHeight={250}
        />

      </div>


      <div className="buttons">

        <button
          className="predict-btn"
          onClick={predictDigit}
        >
          Predict
        </button>


        <button
          className="clear-btn"
          onClick={clearCanvas}
        >
          Clear
        </button>

      </div>


      {prediction !== null && (

        <div className="prediction-box">

          <p className="prediction-text">

  Prediction: {prediction}

</p>

<p className="confidence-text">

  Confidence: {confidence}%

</p>

        </div>

      )}

    </div>
  );
}


export default App;