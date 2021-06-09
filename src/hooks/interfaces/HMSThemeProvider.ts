import { TW } from 'twind';

export interface appBuilder {
  logo?: string;
  logoClass?: string;
  theme?: 'light' | 'dark';
  videoTileAspectRatio?: {
    width: number;
    height: number;
  };
  enableScreenShare?: boolean;
  enableChat?: boolean;
  avatarType?: 'initial';
}

export default interface HMSThemeProps {
  tw: TW;
  tailwindConfig: any;
  appBuilder: appBuilder;
}
