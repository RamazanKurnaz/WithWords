import React from 'react';

const LetterBox = ({ letter, provided, snapshot }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className={`w-16 h-16 flex items-center justify-center bg-white border-2 ${
      snapshot.isDragging ? 'border-yellow-500' : 'border-gray-300'
    } rounded-lg text-3xl font-bold cursor-move shadow-lg transition-all duration-200 hover:bg-yellow-100`}
    style={{
      ...provided.draggableProps.style,
      boxShadow: snapshot.isDragging ? "0 5px 15px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.1)",
      transform: snapshot.isDragging ? `${provided.draggableProps.style.transform} scale(1.05)` : provided.draggableProps.style.transform,
    }}
  >
    {letter}
  </div>
);

export default LetterBox;