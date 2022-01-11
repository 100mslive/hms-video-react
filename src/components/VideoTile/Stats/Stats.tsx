import React from 'react';
import {
  HMSTrackID,
  HMSTrackStats,
  selectHMSStats,
} from '@100mslive/hms-video-store';
import { useHMSStatsStore } from '../../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';
import { formatBytes, isPresent } from '../../../utils';

export interface VideoTileStatsProps {
  videoTrackID?: HMSTrackID;
  audioTrackID?: HMSTrackID;
}

const StatsRow = ({ label = '', value = '' }) => {
  const { tw } = useHMSTheme();
  return (
    <>
      <span className={tw('text-gray-500 mr-4')}>{label}</span>{' '}
      <span className={tw('text-white flex-initial')}>{value}</span>
    </>
  );
};

const TrackPacketsLostRow = ({ stats }: { stats?: HMSTrackStats }) => {
  const packetsLostRate =
    (stats?.packetsLostRate
      ? stats.packetsLostRate.toFixed(2)
      : stats?.packetsLostRate) + '/s';

  const trackType =
    stats && stats?.kind.charAt(0).toUpperCase() + stats?.kind.slice(1);

  return isPresent(stats?.packetsLost) && isPresent(stats?.packetsLostRate) ? (
    <StatsRow
      label={`Packet Loss (${trackType})`}
      value={`${stats?.packetsLost}(${packetsLostRate})`}
    />
  ) : null;
};

export function VideoTileStats({
  videoTrackID,
  audioTrackID,
}: VideoTileStatsProps) {
  const { tw } = useHMSTheme();

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

  const resolutionWithFPS =
    videoTrackStats?.frameHeight &&
    `${videoTrackStats?.frameHeight}x${videoTrackStats?.frameWidth}@${videoTrackStats?.framesPerSecond}` +
      (isPresent(videoTrackStats?.framesDropped)
        ? `(${videoTrackStats?.framesDropped} dropped)`
        : '');

  return (
    <div
      className={tw('absolute top-2 left-2 z-10 rounded-lg p-3 text-sm')}
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div className={tw('grid grid-cols-2 gap-1')}>
        {resolutionWithFPS && (
          <StatsRow label="Resolution@FPS" value={resolutionWithFPS} />
        )}
        {isPresent(videoTrackStats?.bitrate) && (
          <StatsRow
            label={
              (videoTrackStats?.type.includes('inbound')
                ? 'Subscribe'
                : 'Publish') + ' Bitrate (Video)'
            }
            value={formatBytes(videoTrackStats?.bitrate, 'b/s')}
          />
        )}
        {isPresent(audioTrackStats?.bitrate) && (
          <StatsRow
            label={
              (audioTrackStats?.type.includes('inbound')
                ? 'Subscribe'
                : 'Publish') + ' Bitrate (Audio)'
            }
            value={formatBytes(audioTrackStats?.bitrate, 'b/s')}
          />
        )}
        <TrackPacketsLostRow stats={videoTrackStats} />
        <TrackPacketsLostRow stats={audioTrackStats} />
        {isPresent(videoTrackStats?.jitter) && (
          <StatsRow
            label="Jitter (Video)"
            value={videoTrackStats?.jitter?.toString()}
          />
        )}
        {isPresent(audioTrackStats?.jitter) && (
          <StatsRow
            label="Jitter (Audio)"
            value={audioTrackStats?.jitter?.toString()}
          />
        )}
      </div>
    </div>
  );
}
