import React, { useEffect, useRef, useState } from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeSize, setStrokeSize] = useState(6);
    const [strokeColor, setStrokeColor] = useState('#000000'); // Default color is black

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 800;
        canvas.height = 450;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = strokeColor;
        contextRef.current = context;
    }, []);

    // M1 Pressed
    const startDraw = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };


    // M1 Held
    const draw = ({nativeEvent}) => {
        if(!isDrawing) {
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    // M1 Released
    const stopDraw = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const setToDraw = () => {
        contextRef.current.globalCompositeOperation = 'source-over';
    }

    const setToErase = () => {
        contextRef.current.globalCompositeOperation = 'destination-out';
    }

    const handleStrokeSizeChange = (event) => {
        setStrokeSize(parseInt(event.target.value));
    }

    const handleColorChange = (event) => {
        setStrokeColor(event.target.value);
    }

    const saveImageToLocal = (event) => {
        let link = event.currentTarget;
        link.setAttribute('download', 'canvas.png');
        let image = canvasRef.current.toDataURL('image/png')
        link.setAttribute('href', image)
    }

    // This use effect prevents the canvas from rerendering when stroke is changed
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = strokeSize;
            contextRef.current.strokeStyle = strokeColor;
        }
    }, [strokeSize, strokeColor]);

    return (
        <div>
            <canvas className="canvas-container"
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
            >
            </canvas>
            <div className="controls">
                <div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={strokeSize}
                        onChange={handleStrokeSizeChange}
                    />
                    <span>Stroke Size: {strokeSize}</span>
                </div>
                <div>
                    <input
                        type="color"
                        value={strokeColor}
                        onChange={handleColorChange}
                    />
                    <span>Selected Color: {strokeColor}</span>
                </div>
                <div>
                    <button onClick={setToDraw}>
                        Draw
                    </button>
                    <button onClick={setToErase}>
                        Erase
                    </button>
                    <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>Save Image</a>
                </div>
            </div>
        </div>
    );
}

export default DrawingCanvas;
