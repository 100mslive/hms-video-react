import React, { useMemo } from 'react';
import MaterialSlider, {
  SliderProps as MaterialSliderProps,
} from '@material-ui/core/Slider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
export interface SliderClasses {
  valueLabel?: string;
  thumb?: string;
  track?: string;
  root?: string;
}

const defaultClasses = {
  valueLabel: 'text-white dark:text-gray-100',
  thumb:
    'bg-gray-100 dark:bg-white text-white dark:text-gray-100 hover:shadow-none',
  track: 'bg-gray-100 dark:bg-white',
  root: 'text-gray-100 dark:text-white',
};

export interface SliderProps extends Partial<MaterialSliderProps> {
  classes: SliderClasses;
}

export const Slider = ({ classes, ...props }: SliderProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<SliderClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-slider',
      }),
    [classes],
  );
  return (
    <MaterialSlider
      {...props}
      classes={{
        valueLabel: styler('valueLabel'),
        thumb: styler('thumb'),
        track: styler('track'),
        root: styler('root'),
      }}
    />
  );
};
