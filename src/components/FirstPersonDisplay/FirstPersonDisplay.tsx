import React from 'react';
import { Text } from '../Text';

interface Props {
  username?: string;
}

const FirstPersonDisplay: React.FC<Props> = ({ username = 'Sanjana' }) => {
  return (
    <div className="h-full text-white flex items-center justify-center">
      <div
        className="w-37.5 h-42.5 rounded-2xl relative flex flex-col text-center space-y-4 pt-44 items-center"
        style={{
          backgroundImage: `url(https://i.postimg.cc/SKvM5DY1/back.png)`,
        }}
      >
        <Text tag="h1" variant="heading">
          Welcome , {username} !
        </Text>
        <div>
          <Text tag="p" variant="heading" size="sm">
            You’re the first one here.
          </Text>
          <Text tag="p" variant="heading" size="sm">
            Sit back and relax till the others join.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default FirstPersonDisplay;
