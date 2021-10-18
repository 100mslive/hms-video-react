import React from 'react';
import { Dialog, withStyles } from '@material-ui/core';

export const HMSDialog = withStyles({
  paper: {
    borderRadius: '12px',
    backgroundColor: 'inherit',
  },
})(Dialog);
