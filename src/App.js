import React from 'react'
import BarcodeScannerPython from './components/barcode-scanner-python/barcode-scanner-python';
import BarcodeScannerQuaggaJS from './components/barcode-scanner-quaggajs/barcode-scanner-quaggajs';
import BarcodeScannerWASM from './components/barcode-scanner-wasm/barcode-scanner-wasm';

function App() {
  return (
    <div>
      <BarcodeScannerWASM />
      <BarcodeScannerPython />
      <BarcodeScannerQuaggaJS />
    </div>
  );
}

export default App;


