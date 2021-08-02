import React from 'react';
import MaterialSlider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

const darkMode = document
  ? document.documentElement.classList.contains('dark')
  : true;

export const Slider = withStyles({
  root: {
    color: darkMode ? 'white' : 'black',
    maxWidth: '100%',
  },
  thumb: {
    backgroundColor: darkMode ? 'black' : 'white',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: darkMode ? 'white' : 'black',
  },
  active: {},
  valueLabel: {
    color: darkMode ? 'white' : 'black',
  },
})(MaterialSlider);
