import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { MessageModal } from '../MessageModal';
import { Slider } from '../Slider/Slider';
import { Text } from '../Text';

export interface ParticipantsInViewClasses {
  sliderContainer?: string;
  slider?: string;
  divider?: string;
}

const defaultClasses = {
  sliderContainer: 'w-full',
  slider: 'rounded-lg w-full p-2 flex items-center ',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
};

export interface ParticipantsInViewProps {
  classes?: ParticipantsInViewClasses;
  onTileCountChange: (value: number) => void;
  maxTileCount: number;
  showModal?: boolean;
  onModalClose?: () => void;
}

export const ParticipantsInView = ({
  classes,
  onTileCountChange,
  maxTileCount,
  showModal,
  onModalClose = () => {},
}: ParticipantsInViewProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ParticipantsInViewClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-participants-in-view',
      }),
    [classes],
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (showModal === undefined) {
      return;
    }
    setOpen(showModal);
  }, [showModal]);

  const handleClose = () => {
    setOpen(false);
    onModalClose();
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    //TODO make this generic
    if (typeof newValue === 'number') {
      onTileCountChange(newValue);
    }
  };

  return (
    <MessageModal
      show={open}
      onClose={handleClose}
      classes={{ header: 'mb-2' }}
      title="Participants In View"
      body={
        <Fragment>
          <div className={styler('divider')}></div>
          <div className={styler('sliderContainer')}>
            <div className={styler('slider')}>
              <Slider
                name="maxTileCount"
                defaultValue={9}
                value={maxTileCount}
                //@ts-ignore
                onChange={handleSliderChange}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={1}
                max={49}
                step={null}
                marks={[
                  { value: 1 },
                  { value: 4 },
                  { value: 9 },
                  { value: 16 },
                  { value: 25 },
                  { value: 36 },
                  { value: 49 },
                ]}
              />
            </div>
          </div>
        </Fragment>
      }
    />
  );
};
