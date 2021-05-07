import React, { PropsWithChildren } from 'react';

interface StyledAvatarProps {
  /**
   * Image URL to be displayed
   */
  image?: string;
  /**
   * Shape of the Avatar
   */
  shape?: 'square' | 'circle';
  /**
   * Icon component to be used. Ignored if image is present
   */
  icon?: React.ReactNode;
  /**
   * Name/Label of the person. Initials are used if no image/icon is present
   */
  label?: string;
}

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledAvatarProps
>;
export type AvatarProps = StyledAvatarProps & NativeAttrs;

export const Avatar: React.FC<PropsWithChildren<AvatarProps>> = () => {
  return (
    <img
      className="inline object-cover w-16 h-16 mr-2 rounded-full"
      src="https://vercel.com/api/www/avatar/?u=evilrabbit&s=180"
      alt="Profile image"
    />
  );
};
