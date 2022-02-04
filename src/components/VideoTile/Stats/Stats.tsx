import React, { useRef } from 'react';
import {
  HMSTrackID,
  HMSTrackStats,
  selectHMSStats,
} from '@100mslive/hms-video-store';
import { useHMSStatsStore } from '../../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';
import { formatBytes, isPresent, isMobileDevice } from '../../../utils';

export interface VideoTileStatsProps {
  compact?: boolean;
  videoTrackID?: HMSTrackID;
  audioTrackID?: HMSTrackID;
}

const StatsRow = ({
  label = '',
  trackType = '',
  value = '',
  compact = false,
}) => {
  const { tw } = useHMSTheme();
  if (trackType) {
    label = `${label} (${compact ? trackType[0] : trackType})`;
  }
  return (
    <tr>
      <td className={tw(`text-gray-500 ${compact && 'w-2/5'}`)}>{label}</td>
      <td className={tw(`text-white pl-2`)}>{value}</td>
    </tr>
  );
};

const PacketsLostRow = ({
  stats,
  compact,
  trackType,
}: {
  stats?: HMSTrackStats;
  compact?: boolean;
  trackType: 'Video' | 'Audio';
}) => {
  const packetsLostRate =
    (stats?.packetsLostRate
      ? stats.packetsLostRate.toFixed(2)
      : stats?.packetsLostRate) + '/s';

  return isPresent(stats?.packetsLost) && isPresent(stats?.packetsLostRate) ? (
    <StatsRow
      label={compact ? 'PL' : 'Packet Loss'}
      trackType={trackType}
      value={`${stats?.packetsLost}(${packetsLostRate})`}
      compact={compact}
    />
  ) : null;
};

const ResolutionRow = ({
  stats,
  compact = false,
}: {
  stats: HMSTrackStats;
  compact?: boolean;
}) => {
  if (!stats?.frameWidth) {
    return null;
  }
  const resolutionWithFPS = `${stats?.frameWidth}x${stats?.frameHeight}@${stats?.framesPerSecond}`;

  return compact ? (
    <>
      <StatsRow
        label="Width"
        value={stats?.frameWidth?.toString()}
        compact={compact}
      />
      <StatsRow
        label="Height"
        value={stats?.frameHeight?.toString()}
        compact={compact}
      />
      <StatsRow
        label="FPS"
        value={stats?.framesPerSecond?.toString()}
        compact={compact}
      />
    </>
  ) : (
    <StatsRow
      label="Resolution @FPS"
      value={resolutionWithFPS}
      compact={compact}
    />
  );
};

export function VideoTileStats({
  videoTrackID,
  audioTrackID,
  compact = false,
}: VideoTileStatsProps) {
  const { tw } = useHMSTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 15,
  };
  compact = compact || isMobileDevice();

  if (compact) {
    const parentHeight = rootRef.current?.parentElement?.clientHeight || 0;
    const parentWidth = rootRef.current?.parentElement?.clientWidth || 0;
    containerStyle.width = `calc(${parentWidth}px - 1rem)`;
    containerStyle.maxHeight = parentHeight * 0.75;
    containerStyle.overflowY = 'auto';
  }

  const audioTrackStats = useHMSStatsStore(
    selectHMSStats.trackStatsByID(audioTrackID),
  );

  const videoTrackStats = useHMSStatsStore(
    selectHMSStats.trackStatsByID(videoTrackID),
  );

  // Viewer role - no stats to show
  if (!(audioTrackStats || videoTrackStats)) {
    return null;
  }

  return (
    <div
      className={tw(
        `absolute top-2 left-2 rounded-lg text-sm no-scrollbar ${
          compact ? 'p-1' : 'p-3'
        }`,
      )}
      style={containerStyle}
      ref={rootRef}
    >
      <table>
        <tbody>
          {videoTrackStats && (
            <ResolutionRow stats={videoTrackStats} compact={compact} />
          )}
          {isPresent(videoTrackStats?.bitrate) && (
            <StatsRow
              label="Bitrate"
              trackType="Video"
              value={formatBytes(videoTrackStats?.bitrate, 'b/s')}
              compact={compact}
            />
          )}
          {isPresent(audioTrackStats?.bitrate) && (
            <StatsRow
              label="Bitrate"
              trackType="Audio"
              value={formatBytes(audioTrackStats?.bitrate, 'b/s')}
              compact={compact}
            />
          )}
          <PacketsLostRow
            stats={videoTrackStats}
            trackType="Video"
            compact={compact}
          />
          <PacketsLostRow
            stats={audioTrackStats}
            trackType="Audio"
            compact={compact}
          />
          {isPresent(videoTrackStats?.jitter) && (
            <StatsRow
              label="Jitter"
              trackType="Video"
              value={videoTrackStats?.jitter?.toString()}
              compact={compact}
            />
          )}
          {isPresent(audioTrackStats?.jitter) && (
            <StatsRow
              label="Jitter"
              trackType="Audio"
              value={audioTrackStats?.jitter?.toString()}
              compact={compact}
            />
          )}
        </tbody>
      </table>
    </div>
  );
}
