import Quagga from 'quagga';
import React, { useEffect } from 'react';

const ScanWidget = ({callback, startScan}) => {
    useEffect(() => {
        Quagga.init(
            {
                inputStream: {
                    name : "Live",
                    type : "LiveStream",
                    constraints: {
                        width: 360,
                        height: 300,
                        facingMode: 'environment', // or user
                    },
                },
                locator: {
                    patchSize: 'medium',
                    halfSample: true,
                },
                numOfWorkers: 4,
                decoder: {
                    readers: ['code_128_reader', 'ean_reader', 
                                'ean_8_reader', 'code_39_reader', 
                                'code_39_vin_reader', 'codabar_reader',
                                'upc_reader', 'upc_e_reader', 'i2of5_reader', 
                                '2of5_reader', 'code_93_reader'],
                },
                locate: true,
            },
            function(err) {
                if (err) {
                    return console.log(err)
                }
                Quagga.start()
            },
        );
        Quagga.onDetected(callback)

        return () => { 
            Quagga.offDetected(callback); 
            Quagga.stop(); 
        }
    }, [startScan, callback])

    return (
        <div id="interactive" className="viewport" />
    )
}

export default ScanWidget;