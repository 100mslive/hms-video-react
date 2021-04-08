export interface Peer {
  id: string;
  displayName: string;
}

export type AudioLevelDisplayType =
  | 'inline-wave'
  | 'inline-circle'
  | 'border'
  | 'avatar-circle';
