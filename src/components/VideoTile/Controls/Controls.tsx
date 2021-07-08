import React, { useMemo } from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { Button } from '../../Button';
import { DotMenuIcon, MicOffIcon, StarIcon } from '../../Icons';
import '../index.css';
import { hmsUiClassParserGenerator } from '../../../utils/classes';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';

export interface VideoTileControlsClasses {
  root?: string;
  controlsInner?: string;
  controls?: string;
  contextMenu?: string;
  contextMenuInner?: string;
  label?: string;
  contextMenuSpan?: string;
  controlsWrapper?: string;
}
export interface VideoTileControlsProps {
  label?: string;
  isAudioMuted?: boolean;
  showGradient?: boolean;
  showAudioMuteStatus?: boolean;
  allowRemoteMute?: boolean;
  showAudioLevel?: boolean;
  audioLevelDisplayType?: AudioLevelDisplayType;
  audioLevel?: number;
  classes?: VideoTileControlsClasses;
  isLocal?: boolean;
}

//TODO group hover is not working
const defaultClasses: VideoTileControlsClasses = {
  root: 'w-full z-20 rounded-none h-full overflow-hidden',
  // TODO solve for smaller tiles
  controlsInner: 'absolute right-0',
  controls:
    'w-9 h-9 m-2 rounded-full bg-gray-300 opacity-50 cursor-pointer flex items-center justify-center fill-current text-white',
  contextMenu: 'absolute right-0 top-12 mr-2 bg-gray-200 rounded-lg w-44 py-2',
  contextMenuInner:
    'flex py-2 pl-2 hover:bg-gray-300 bg-gray-200 text-white cursor-pointer',
  contextMenuSpan: 'ml-2',
  // label: 'absolute z-50 w-full flex justify-center bottom-2 left-0 text-white',
  // controlsInner:
  //   'absolute bottom-0 w-full h-full z-20 pb-2 text-white px-2 text-center flex flex-col justify-end items-center',
  // controls: 'invisible max-h-0 transition-all text-center mt-1',
  // gradient:
  //   'absolute bottom-0 z-0 h-16 w-full bg-gradient-to-t from-transparent-400 to-transparent-0',
  // controlsStatus: 'transition-all opacity-1 mx-1',
  label: 'mt-1 mx-1 text-sm md:text-base w-11/12 truncate',
  controlsWrapper: 'flex justify-center',
};

const customClasses: VideoTileControlsClasses = {
  controls: 'hmsui-videoTile-showControlsOnHoverChild',
};

export const VideoTileControls = ({
  label = '',
  isAudioMuted = false,
  showGradient = true,
  showAudioMuteStatus = true,
  isLocal = false,
  allowRemoteMute = false,
  classes,
}: VideoTileControlsProps) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoTileControlsClasses>({
        tw,
        classes,
        customClasses,
        defaultClasses,
        tag: 'hmsui-videoTileControls',
      }),
    [],
  );

  return (
    <div className={`${styler('root')}`}>
      <div className={`${styler('controlsInner')}`}>
        <div
          className={`${styler('controls')}`}
          onClick={() => setOpenMenu(!openMenu)}
        >
          <DotMenuIcon />
        </div>
        <div className={`${styler('controlsWrapper')}`}>
          {showAudioMuteStatus && isAudioMuted && (
            <Button
              iconOnly
              active
              size={'md'}
              shape="circle"
              variant="danger"
              classes={{ root: 'dark' }}
            >
              <MicOffIcon />
            </Button>
          )}
        </div>
        <div className={`${styler('label')}`} title={label}>
          {label}
        </div>
        <div className={`${styler('controls')}`}>
          {!isLocal && showAudioMuteStatus && !isAudioMuted && allowRemoteMute && (
            <Button iconOnly size={'md'} classes={{ root: 'dark' }}>
              <MicOffIcon />
            </Button>
          )}
        </div>
      </div>

      {openMenu ? (
        <div style={{ zIndex: 9999999 }} className={`${styler('contextMenu')}`}>
          <div className={`${styler('contextMenuInner')}`}>
            <MicOffIcon className="fill-current" />{' '}
            <span className="ml-2">Mute</span>
          </div>
          <div className={`${styler('contextMenuInner')}`}>
            <StarIcon />{' '}
            <span className={`${styler('contextMenuSpan')}`}>Spotlight</span>
          </div>
        </div>
      ) : null}

      <div className={`${styler('label')}`}>{label}</div>
    </div>
  );
};
