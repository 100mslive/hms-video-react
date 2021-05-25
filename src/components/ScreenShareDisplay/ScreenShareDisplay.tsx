import React from 'react';
import { CrossIcon, ShareScreenIcon } from '../Icons';
import { Text } from '../Text';
import { Button } from '../TwButton';

interface Props {
  username?: string;
}

const ScreenShareDisplay: React.FC<Props> = ({ username = 'Sanjana' }) => {
  return (
    <div className="h-full text-white flex items-center justify-center">
      <div
        className="w-37.5 h-37.5 rounded-2xl relative flex flex-col text-center space-y-6 justify-center items-center"
        style={{
          backgroundImage: `url(https://i.postimg.cc/SKvM5DY1/back.png)`,
        }}
      >
        <ShareScreenIcon width={100} height={100} />
        <Text tag="h1" variant="heading">
          You are sharing your screen
        </Text>
        <Button icon={<CrossIcon />} variant="danger">
          Stop screen share
        </Button>
      </div>
    </div>
  );
};

export default ScreenShareDisplay;
