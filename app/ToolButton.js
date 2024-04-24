import React from "react";

const ToolButton = ({ toolName, setToolType, toolType }) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={toolName}
      checked={toolType === toolName}
      onChange={() => setToolType(toolName)}
      className="appearance-none border border-gray-300 rounded-md w-4 h-4 focus:ring-2 focus:ring-indigo-500 checked:bg-indigo-500 checked:border-transparent"
    />
    <label htmlFor={toolName} className="cursor-pointer text-gray-700">
      {toolName}
    </label>
  </div>
);

export default ToolButton;
