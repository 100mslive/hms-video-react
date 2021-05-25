import React from 'react';
import { SunWithFace } from '../Icons';
import { Text } from '../Text';
import { Button } from '../TwButton';

interface Props {
  username?: string;
}

const PostLeaveDisplay: React.FC<Props> = ({ username = 'Sanjana' }) => {
  return (
    <div className="h-full text-white flex items-center justify-center">
      <div
        className="w-37.5 h-42.5 rounded-2xl "
        style={{
          backgroundImage: `url(https://i.postimg.cc/GtwwMnLL/back.png)`,
        }}
      >
        <div
          className="relative rounded-2xl  flex flex-col text-center items-center space-y-6  "
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
        >
          <div className="mt-24 mb-6">
            <SunWithFace />
          </div>
          <Text tag="h1" variant="heading">
            You left the room
          </Text>
          <Text tag="h1" variant="heading">
            Have a nice day, {username}
          </Text>
          <div className="bg-gray-600 dark:bg-gray-200 h-px w-96 my-8"></div>
          <div className="space-x-5">
            <Button variant="emphasized">Join Again</Button>
            <Button>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLeaveDisplay;
