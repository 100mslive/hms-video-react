import { TW } from 'twind';

export interface appBuilder {
  logo?: string;
  theme?: 'light' | 'dark';
  videoTileAspectRatio?: {
    width: number;
    height: number;
  };
  enableScreenShare?: boolean;
  enableChat?: boolean;
  avatarType?: 'initial' | 'pebble';
}

export default interface HMSThemeProps {
  tw: TW;
  tailwindConfig: any;
  appBuilder: appBuilder;
}
