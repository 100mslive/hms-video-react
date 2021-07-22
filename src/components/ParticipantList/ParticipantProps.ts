import { HMSPeerWithMuteStatus } from '@100mslive/hms-video-store';
import { HMSPeer } from '@100mslive/hms-video-store';

export interface ParticipantListClasses {
  root?: string;
  buttonRoot?: string;
  buttonOpen?: string;
  buttonClosed?: string;
  buttonInner?: string;
  buttonText?: string;
  carat?: string;
  menuRoot?: string;
  menuSection?: string;
  menuItem?: string;
  menuText?: string;
  menuIconContainer?: string;
  offIcon?: string;
  onIcon?: string;
}

export interface ParticipantListProps {
  participantList?: HMSPeerWithMuteStatus[];
  classes?: ParticipantListClasses;
  onToggle?: (open: boolean) => void;
  onRoleChangeClick?: (peer: HMSPeer) => void;
}
