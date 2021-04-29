import React, { useState } from "react";
import ScanWidget from "./scan-widget/scan-widget";

const BarcodeScannerQuaggaJS = () => {
    const [resultData, setResultData] = useState(null);
    const [scannerState, setScannerState] = useState(false);

    const handleScanner = () => {
        setScannerState(!scannerState)
    }

    const handleScannerCallback = (resultData) => {
        if(resultData.codeResult.code){
            setResultData(resultData.codeResult.code);
        }
    }

    return (
        <>
            <h2>Barcode Scanner Using Quagga JS</h2>
            <input className={scannerState ? "btn-stop" : "btn-start"} type="button" value={scannerState ? 'Stop Scanning' : 'Start Scanning'} onClick={handleScanner} />
            <h3>Result: {resultData}</h3>
            { scannerState ? <ScanWidget callback={handleScannerCallback} startScan={scannerState}/> : null }
        </>
    )
}

export default BarcodeScannerQuaggaJS;