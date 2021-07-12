import React from 'react';
import MaterialSlider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

export const Slider = withStyles({
  root: {
    color: document.documentElement.classList.contains('dark')
      ? 'white'
      : 'black',
    maxWidth: '100%',
  },
  thumb: {
    backgroundColor: document.documentElement.classList.contains('dark')
      ? 'black'
      : 'white',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: document.documentElement.classList.contains('dark')
      ? 'white'
      : 'black',
  },
  active: {},
  valueLabel: {
    color: document.documentElement.classList.contains('dark')
      ? 'white'
      : 'black',
  },
})(MaterialSlider);
