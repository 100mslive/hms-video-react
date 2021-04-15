import React from 'react';
import './InlineWave.css';

interface InlineWaveProps {
  level: number;
}

const InlineWave = ({ level }: InlineWaveProps) => {
  return (
    <div className="inline-block" style={{ width: '22px', height: '32px' }}>
      <div className="flex items-center justify-between h-full w-full">
        <span
          className="inline-block bg-blue-tint rounded-full "
          style={{
            width: '5px',
            height: `${0.12 * level}px`,
            boxShadow: `0px 0px ${0.02 * level}px #0F6CFF, 0px 0px ${0.05 *
              level}px #0F6CFF`,
          }}
        ></span>
        <span
          className="inline-block bg-blue-tint rounded-full "
          style={{
            width: '5px',
            height: `${0.18 * level}px`,
            boxShadow: `0px 0px ${0.02 * level}px #0F6CFF, 0px 0px ${0.05 *
              level}px #0F6CFF`,
          }}
        ></span>
        <span
          className="inline-block bg-blue-tint rounded-full "
          style={{
            width: '5px',
            height: `${0.11 * level}px`,
            boxShadow: `0px 0px ${0.02 * level}px #0F6CFF, 0px 0px ${0.05 *
              level}px #0F6CFF`,
          }}
        ></span>
      </div>
    </div>
  );
};

export default InlineWave;
