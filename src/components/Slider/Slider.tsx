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
  noThumb?: boolean;
}

type StyleProps = { darkMode: boolean; noThumb?: boolean };

const useStyles = makeStyles({
  root: {
    color: (props: StyleProps) => (props.darkMode ? 'white' : '#212121'),
    maxWidth: '100%',
  },
  track: {
    color: (props: StyleProps) => (props.darkMode ? 'white' : '#212121'),
  },
  thumb: {
    backgroundColor: (props: StyleProps) =>
      props.darkMode ? 'white' : '#212121',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: (props: StyleProps) => (props.darkMode ? 'white' : '#212121'),
    display: (props: StyleProps) => (props.noThumb ? 'none' : 'flex'),
  },
  active: {},
  valueLabel: {
    color: (props: StyleProps) => (props.darkMode ? 'white' : '#212121'),
    '& > span > span': {
      color: (props: StyleProps) => (props.darkMode ? '#212121' : 'white'),
    },
  },
});

export const Slider = ({ ...props }: SliderProps) => {
  const { appBuilder } = useHMSTheme();
  const sliderClasses = useStyles({
    darkMode: appBuilder.theme === 'dark',
    noThumb: props.noThumb,
  } as StyleProps);
  return (
    <MaterialSlider
      {...props}
      classes={{
        valueLabel: `${sliderClasses.valueLabel}`,
        thumb: `${sliderClasses.thumb}`,
        track: `${sliderClasses.track}`,
        root: `${sliderClasses.root}`,
      }}
    />
  );
};
