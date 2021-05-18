import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Avatar, AvatarProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Avatar',
  component: Avatar,
};

const TempIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path d="M17.997 18H6.002L6 17.377c0-1.259.1-1.986 1.588-2.33 1.684-.389 3.344-.736 2.545-2.209C7.767 8.475 9.459 6 11.999 6c2.491 0 4.226 2.383 1.866 6.839-.775 1.464.826 1.812 2.545 2.209 1.49.344 1.589 1.072 1.589 2.333l-.002.619zm4.811-2.214c-1.29-.298-2.49-.559-1.909-1.657 1.769-3.342.469-5.129-1.4-5.129-1.265 0-2.248.817-2.248 2.324 0 3.903 2.268 1.77 2.246 6.676h4.501l.002-.463c0-.946-.074-1.493-1.192-1.751zM.002 18h4.501c-.021-4.906 2.246-2.772 2.246-6.676C6.749 9.817 5.766 9 4.501 9c-1.869 0-3.169 1.787-1.399 5.129.581 1.099-.619 1.359-1.909 1.657C.074 16.044 0 16.591 0 17.537L.002 18z" />
    </svg>
  );
};

export default meta;

const tempUrl = `https://vercel.com/api/www/avatar/?u=evilrabbit&s=180`;

const Basic: Story<AvatarProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full h-1/2 flex justify-center bg-white py-4">
        <Avatar image={tempUrl} {...args} />
      </div>
    </HMSThemeProvider>
  );
};

const LabelAvatar: Story<AvatarProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div className="w-full h-1/2 flex justify-center bg-white py-4">
        <Avatar label="Hello World" shape="square" {...args} />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Basic.bind({});
Basic.args = {};

export const LabelledAvatar = LabelAvatar.bind({});
Basic.args = {};
