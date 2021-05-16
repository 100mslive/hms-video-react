import { TW } from 'twind';

export interface appBuilder {
  logo?: string;
  theme?: 'light' | 'dark';
  showAvatar?: boolean;
  videoTileAspectRatio?: {
    width: number;
    height: number;
  };
  enableScreenShare?: boolean;
  enableChat?: boolean;
}

export default interface HMSThemeProps {
  tw: TW;
  tailwindConfig: any;
  appBuilder: appBuilder;
}
