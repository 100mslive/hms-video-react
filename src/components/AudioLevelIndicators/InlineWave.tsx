import React from 'react';
import './InlineWave.css';

interface InlineWaveProps {
  level: number;
}

export default function InlineWave({ level }: InlineWaveProps) {
  return (
    <div id="wave">
      <span
        className="dot"
        style={{ height: level + 'px', marginBottom: level / 2 + 'px' }}
      ></span>
      <span className="dot" style={{ height: level * 2 + 'px' }}></span>
      <span
        className="dot"
        style={{ height: level + 'px', marginBottom: level / 2 + 'px' }}
      ></span>
    </div>
  );
}
