import React from 'react';
import MaterialSlider, {
  SliderProps as MaterialSliderProps,
} from '@material-ui/core/Slider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { makeStyles } from '@material-ui/core';
export interface SliderClasses {
  valueLabel?: string;
  thumb?: string;
  track?: string;
  root?: string;
}
export interface SliderProps extends Partial<MaterialSliderProps> {
  classes?: SliderClasses;
}

type ModeProps = { darkMode: boolean };

const useStyles = makeStyles({
  root: {
    color: (props: ModeProps) => (props.darkMode ? 'white' : '#212121'),
    maxWidth: '100%',
  },
  track: {
    color: (props: ModeProps) => (props.darkMode ? 'white' : '#212121'),
  },
  thumb: {
    backgroundColor: (props: ModeProps) =>
      props.darkMode ? '#212121' : 'white',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: (props: ModeProps) => (props.darkMode ? 'white' : '#212121'),
  },
  active: {},
  valueLabel: {
    color: (props: ModeProps) => (props.darkMode ? 'white' : '#212121'),
    '& > span > span': {
      color: (props: ModeProps) => (props.darkMode ? '#212121' : 'white'),
    },
  },
});

export const Slider = ({ classes, ...props }: SliderProps) => {
  const { appBuilder } = useHMSTheme();
  const sliderClasses = useStyles({
    darkMode: appBuilder.theme === 'dark',
  } as ModeProps);
  return (
    <MaterialSlider
      {...props}
      classes={{
        valueLabel: `${sliderClasses.valueLabel} ${classes?.valueLabel || ''}`,
        thumb: `${sliderClasses.thumb} ${classes?.thumb || ''}`,
        track: `${sliderClasses.track} ${classes?.track || ''}`,
        root: `${sliderClasses.root} ${classes?.root || ''}`,
      }}
    />
  );
};
