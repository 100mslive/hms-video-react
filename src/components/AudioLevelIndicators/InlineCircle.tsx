import React from 'react';
import './InlineCircle.css';

interface InlineCircleProps {
  level: number;
}

const InlineCircle = ({ level }: InlineCircleProps) => {
  return (
    <div className="inline-block" style={{ width: '22px', height: '32px' }}>
      <div className="flex items-center justify-center h-full w-full">
        <span
          className="inline-block bg-blue-tint rounded-full "
          style={{
            width: `${0.18 * level}px`,
            height: `${0.18 * level}px`,
            boxShadow: `0px 0px ${0.02 * level}px #0F6CFF, 0px 0px ${0.05 *
              level}px #0F6CFF`,
          }}
        ></span>
      </div>
    </div>
  );
};

export default InlineCircle;
