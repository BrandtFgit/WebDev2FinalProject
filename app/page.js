"use client";
import React, { createElement, useLayoutEffect, useState } from "react";
import rough from 'roughjs/bundled/rough.esm';
import ToolButton from './ToolButton';
const generator = rough.generator();

function createStroke(id, x1, y1, x2, y2, tool){
  let stroke;
  switch(tool){
    case "line":
      stroke = generator.line(x1, y1, x2, y2);
    break;
    case "rectangle":
      stroke = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    break;
  }

  return { id, x1, y1, x2, y2, stroke };
}

const isWithinStroke = (x,y,stroke) => {
  // detect if the x/y is within a stroke.
  const {type, x1, x2, y1, y2} = stroke;
  if(type === "rectangle") {
    const minX = Math.min(x1,x2);
    const maxX = Math.max(x1,x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else {
      const a = {x1, y1};
      const b = {x2, y2};
      const c = {x, y};
      const offset = distance(a,b) - (distance(a,c) + distance(b,c));
      return Math.abs(offset) < 1;
  }
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

function getStrokeAtPosition(x, y, strokes){
  return strokes.find(stroke => isWithinStroke(x,y,stroke));
}

const App = () => {
  const [strokes, setStrokes] = useState([]);
  const [action, setAction] = useState('none');
  const [toolType, setToolType] = useState("line");
  const [selectedStroke, setSelectedStroke] = useState(null);
  // RENDER TO CANVAS
  useLayoutEffect( () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const roughCanvas = rough.canvas(canvas);

    strokes.forEach(({ stroke }) => roughCanvas.draw(stroke));
  }, [strokes]);

  
  const updateStroke = (id, x1, y1, x2, y2, tool) => {
    const updatedStroke = createStroke(id, x1, y1, x2, y2, tool);
    // Update stroke with new current data.
    const strokesCopy = [...strokes];
    strokesCopy[id] = updatedStroke;
    setStrokes(strokesCopy);
  }
  // USER INPUT

  const handleMousePressed = (event) => {
    const {clientX, clientY} = event;
    if(toolType === "selection"){
      const stroke = getStrokeAtPosition(clientX, clientY, strokes)
      if(stroke){
        setSelectedStroke(stroke);
        setAction("moving")
      }
    }else{
      const id = strokes.length;
      const stroke = createStroke(id, clientX, clientY, clientX, clientY, toolType);
      setStrokes(prevState => [...prevState, stroke]); // Push element to state.
      setAction("drawing")
    }
    
  };

  // On Mouse Move
  const handleMouseMove = (event) => {
    if(!action) return;
    
    const {clientX, clientY} = event;
    switch(action){
      // Today I learnt that using {} on a case contains the scope of the variables in JS.
      case "drawing": {
        const index = strokes.length -1;
        const { x1, y1 } = strokes[index];
        updateStroke(index, x1, y1, clientX, clientY, toolType);
      break;
      }

      case "moving": {
        const { id, x1, x2, y1, y2, type } = selectedStroke;
        const width = x2 - x1;
        const height = y2 - y1;
        updateStroke(id, clientX, clientY, clientX + width, clientY + height, type);
      break;
      }
    }
  };

  // Remove action and deselect whatever.
  const handleMouseReleased = (event) => {
    setAction("none");
    setSelectedStroke(null);
  };


    return (
    <div>
      <div style={{position: 'fixed'}}>
        <ToolButton
          toolName="selection"
          setToolType={setToolType}
          toolType = {toolType}
        />
        <ToolButton
          toolName="line"
          setToolType={setToolType}
          toolType = {toolType}
        />
        <ToolButton
          toolName="rectangle"
          setToolType={setToolType}
          toolType = {toolType}
        />
      </div>
      <canvas 
        id={"canvas"} 
        width={800} 
        height={450} 
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