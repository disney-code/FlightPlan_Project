import React from 'react';
const FilledCircleMarker = ({ name }) => {
  return (
    <svg
      height="100"
      width="100"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      
      <circle cx="10" cy="10" r="3" fill="red" />
      <text x="20" y="10" textAnchor="start" fill="black" fontSize="12">
        {name}
      </text>
    </svg>
  );
};

export default FilledCircleMarker;