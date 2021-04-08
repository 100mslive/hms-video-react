import React from 'react';

export const Avatar = ({ label = '', height = '' }) => {
  return (
    <img
      className="inline rounded-full"
      src={`https://ui-avatars.com/api/?background=random&name=${label}`}
      alt={label}
      style={{ height: height ? height : '' }}
    />
  );
};
