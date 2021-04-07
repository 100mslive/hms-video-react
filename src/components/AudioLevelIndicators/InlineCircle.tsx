import React, { Component } from 'react';
import './InlineCircle.css';

interface InlineCircleProps {
  level: number;
}

export default function InlineCircle({ level }: InlineCircleProps) {
  return (
    <div id="circle">
      <span
        className="dot"
        style={{ height: level * 1.5 + 'px', width: level * 1.5 + 'px' }}
      ></span>
    </div>
  );
}
