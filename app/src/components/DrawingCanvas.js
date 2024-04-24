"use client";
import React, { useEffect, useRef, useState } from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeSize, setStrokeSize] = useState(6);
    const [strokeColor, setStrokeColor] = useState('#000000'); // Default color is black
    const [interactionDescription, setInteractionDescription] = useState('');

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 450;
        
        // Set initial background color to white
        context.fillStyle = "#FFFFFF"; // White color
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.lineCap = "round";
        context.strokeStyle = strokeColor; 
        context.lineWidth = strokeSize;
        contextRef.current = context;
    }, []);
    
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = strokeSize;
            contextRef.current.strokeStyle = strokeColor;
        }
    }, [strokeSize, strokeColor]);
    
    const startDraw = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };

    const draw = ({nativeEvent}) => {
        if(!isDrawing) {
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

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

    const handleInteractionDescriptionChange = (event) => {
        setInteractionDescription(event.target.value);
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFFFFF"; // White color
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    const saveImageToLocal = (event) => {
        let link = event.currentTarget;
        link.setAttribute('download', 'canvas.png');
    
        const canvas = canvasRef.current;
    
        // Create a new canvas to hold both the original content and the caption
        const mergedCanvas = document.createElement('canvas');
        const mergedContext = mergedCanvas.getContext('2d');
        mergedCanvas.width = canvas.width;
        mergedCanvas.height = canvas.height + 50; // Height for the caption bar
    
        // Draw the original canvas content to the merged canvas
        mergedContext.drawImage(canvas, 0, 0);
    
        // Draw the caption bar
        mergedContext.fillStyle = '#E6E9FF'; // White color for the caption bar
        mergedContext.fillRect(0, canvas.height, canvas.width, 50);
    
        // Draw the interaction description text on the caption bar with a margin
        mergedContext.fillStyle = '#000000'; // Black color for the text
        mergedContext.font = '18px Arial'; // Set the font style
        const margin = 5; // Margin around the text
        const textX = margin; // X-coordinate for the text (start from the left margin)
        const textY = canvas.height + 25; // Y-coordinate for the text (centered vertically)
        mergedContext.fillText(interactionDescription, textX, textY); // Draw the text
    
        // Convert the merged canvas to a data URL and set it as the download link href
        let image = mergedCanvas.toDataURL('image/png');
        link.setAttribute('href', image);
    }
    
    return (
        <div>
            <h1>Brandt's Storyboarding Tool!</h1>
            <canvas className="canvas-container"
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
            >
            </canvas>
            <textarea
                className="interaction-textarea"
                value={interactionDescription}
                onChange={handleInteractionDescriptionChange}
                placeholder="Write what's happening in your scene..."
            />
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
                    <button onClick={clearCanvas}>
                        Clear Canvas
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DrawingCanvas;
