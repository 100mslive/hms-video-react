import React from 'react';
import {Avatar as MaterialAvatar, AvatarProps as MaterialAvatarProps, createStyles, makeStyles, withStyles} from '@material-ui/core';
import {getInitialsFromName} from '../../utils';

//TODO replace with own Avatar component. Add audio indicator

export interface AvatarProps extends MaterialAvatarProps {
  /**
   * Image URL to be displayed
   */
  image?:string,
  /**
   * Icon component to be used. Ignored if image is present
   */
  icon?:React.ReactNode,
  /**
   * Name/Label of the person. Initials are used if no image/icon is present
   */

  label?:string
}

const defaultRootClasses = createStyles({
  root:{
    width:'80px',
    height:'80px'
  }
});

const StyledMaterialAvatar = withStyles({
  root:{
    width:'100px',
    height:'100px',
    fontSize:'2rem',
  }
})(MaterialAvatar);
//const defaultRootClasses = 'w-12 h-12 p-2';

export const Avatar = ({image, icon, label, ...props}:AvatarProps) => {
  return (
    <StyledMaterialAvatar src={image} alt={label} {...props}>
      {icon?icon:getInitialsFromName(label)}
    </StyledMaterialAvatar>
  );
};
