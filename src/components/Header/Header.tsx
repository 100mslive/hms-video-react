import React from 'react';
import { LogoButton } from '../MediaIcons';


export const Header = () => {
  return (
    <div className="flex flex-wrap h-full items-stretch">
      <div className="self-center mt-1">
        <div className="pb-2 px-2 items-center" style={{ background: 'none' }}>
          <LogoButton />
        </div>
      </div>
    </div>
  );
};
