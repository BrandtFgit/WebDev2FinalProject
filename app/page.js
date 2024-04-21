"use client";
import React, { createElement, useLayoutEffect, useState } from "react";
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator();

function createStroke(x1, y1, x2, y2, type){
  let stroke;
  switch(type){
    case "line":
      stroke = generator.line(x1, y1, x2, y2);
    break;
    case "rectangle":
      stroke = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    break;
  }

  return { x1, y1, x2, y2, stroke };
}


const App = () => {
  const [strokes, setStrokes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [strokeType, setStrokeType] = useState("line");

  // RENDER TO CANVAS
  useLayoutEffect( () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const roughCanvas = rough.canvas(canvas);

    strokes.forEach(({ stroke }) => roughCanvas.draw(stroke));
  }, [strokes]);

  const handleMousePressed = (event) => {
    setDrawing(true);

    const {clientX, clientY} = event;

    const stroke = createStroke(clientX, clientY, clientX, clientY, strokeType);
    setStrokes(prevState => [...prevState, stroke]); // Push element to state.
  };

  const handleMouseMove = (event) => {
    if(!drawing) return;

    const {clientX, clientY} = event;
    const index = strokes.length -1;
    const {x1, y1} = strokes[index];
    const updatedStroke = createStroke(x1, y1, clientX, clientY, strokeType);

    // Update stroke with new current data.
    const strokesCopy = [...strokes];
    strokesCopy[index] = updatedStroke;
    setStrokes(strokesCopy);
  };

  const handleMouseReleased = (event) => {
    setDrawing(false);
  };

    return (
    <div>
      <div style={{position: 'fixed'}}>
        <input
          type="radio"
          id="line"
          checked={strokeType === "line"}
          onChange={() => setStrokeType("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={strokeType === "rectangle"}
          onChange={() => setStrokeType("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>

      <canvas 
        id={"canvas"} 
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseDown={handleMousePressed}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseReleased}
      >
        Canvas
      </canvas>
    </div>
    );
}

export default App;