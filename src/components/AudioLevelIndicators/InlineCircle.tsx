import React from 'react';
import './InlineCircle.css';

interface InlineCircleProps {
  level: number;
}

// const defaultClasses:  = {
//   root: 'w-full h-full absolute left-0 top-0 rounded-lg',
//   videoCircle: 'rounded-full',
// };

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
