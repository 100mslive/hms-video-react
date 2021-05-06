import React from 'react';
import {
  Avatar as MaterialAvatar,
  AvatarProps as MaterialAvatarProps,
  withStyles,
} from '@material-ui/core';
import { getInitialsFromName } from '../../utils';

//TODO replace with own Avatar component. Add audio indicator

export interface AvatarProps extends MaterialAvatarProps {
  /**
   * Image URL to be displayed
   */
  image?: string;
  /**
   * Icon component to be used. Ignored if image is present
   */
  icon?: React.ReactNode;
  /**
   * Name/Label of the person. Initials are used if no image/icon is present
   */

  label?: string;
}

const StyledMaterialAvatar = withStyles({
  root: {
    width: '100px',
    height: '100px',
    fontSize: '2rem',
  },
  colorDefault: {
    backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  },
})(MaterialAvatar);

export const Avatar = ({ image, icon, label, ...props }: AvatarProps) => {
  return (
    <StyledMaterialAvatar src={image} alt={label} {...props}>
      {icon ? icon : getInitialsFromName(label)}
    </StyledMaterialAvatar>
  );
};

const StyledMaterialAvatarList = withStyles({
  root: {
    width: '20px',
    height: '20px',
    fontSize: '9px',
  },
  colorDefault: {
    backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  },
})(MaterialAvatar);

export const AvatarList = ({ image, icon, label, ...props }: AvatarProps) => {
  return (
    <StyledMaterialAvatarList src={image} alt={label} {...props}>
      {icon ? icon : getInitialsFromName(label)}
    </StyledMaterialAvatarList>
  );
};
