import React, { useMemo } from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { Button } from '../../Button';
import { MicOffIcon } from '../../Icons';
import '../index.css';
import { hmsUiClassParserGenerator } from '../../../utils/classes';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';

export interface VideoTileControlsClasses {
  root?: string;
  controlsInner?: string;
  controls?: string;
  contextMenu?: string;
  gradient?: string;
  controlsStatus?: string;
  hoverHide?: string;
  label?: string;
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
  root: 'relative w-full z-20 rounded-none h-full overflow-hidden',
  // TODO solve for smaller tiles
  controlsInner: 'absolute right-0',
  controls:
    'w-9 h-9 m-2 rounded-full bg-gray-300 opacity-50 cursor-pointer flex items-center justify-center fill-current text-white',
  contextMenu: 'absolute right-0 top-12 mr-2 rounder',
  gradient: '',
  controlsStatus: '',
  label: '',
  controlsWrapper: '',
};

const customClasses: VideoTileControlsClasses = {
  controls: 'hmsui-videoTile-showControlsOnHoverChild',
};

export const DotMenuIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M6 12a3 3 0 11-6 0 3 3 0 016 0zm9 0a3 3 0 11-6 0 3 3 0 016 0zm9 0a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
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
      </div>

      <div className={`${styler('contextMenu')}`}>Menu</div>
    </div>
  );
};
