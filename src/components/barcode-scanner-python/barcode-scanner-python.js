import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

const BarcodeScannerPython = (props) => {
    const [result, setResult] = useState("");
    const [scannerState, setScannerState] = useState(false);
    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const [isFetching, setFetching] = useState(false);

    const handleUpload = () => {
        setFetching(true);
        const player = playerRef.current;
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        context.drawImage(player, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();

        // Split the base64 string in data and contentType
        let block = dataURL.split(";");
        let realData = block[1].split(",")[1];

        axios({
            method: 'post',
            url: 'https://barcode-scanner-python-api.herokuapp.com/decode/',
            data: { dataURL: realData }
          })
        .then(response => {
            console.log('Success:', response.data);
            const { result = "" } = response.data;
            setResult(result);
            })
        .catch(error => {
            console.error('Error:', error);
            setResult("error occurred");
            })
        .finally(()=>{
            setFetching(false);
          });
    };

    const handleScanner = () => {
        if(scannerState && playerRef.current.srcObject){
            playerRef.current.srcObject.getTracks().forEach((track) => {
                track.stop();
            });
        } else {
            const constraints = {
                advanced: [{
                    facingMode: "environment"
                }]
            };
            navigator.mediaDevices.getUserMedia({video: constraints}).then((stream) => {
                playerRef.current.srcObject = stream;
            });
        }
        setScannerState(!scannerState);
    }


    return (
        <div>
            <h2>Custom Barcode scanner implemented using Python-OpenCV(Django rest API)</h2>
            <input className={scannerState ? "btn-stop" : "btn-start"} type="button" value={scannerState ? 'Stop Scanning' : 'Start Scanning'} onClick={handleScanner} />
            <h3 id="result">
                Result: <strong style={{color:"blue"}}>{isFetching ? "Loading": result}</strong>
            </h3>
            {
                scannerState ?  
                <> 
                    <canvas ref={canvasRef} id="canvas" width="320" height="240" style={{display:"none"}}></canvas>
                    <video ref={playerRef} id="player" width="460" height="306" preload="true" autoPlay muted></video>
                    <br />
                    <input type="button" className="btn-green" onClick={handleUpload} value="Capture and Decode" />
                    <br />
                </> : null
            }
        </div>
    );
}

export default BarcodeScannerPython;
   