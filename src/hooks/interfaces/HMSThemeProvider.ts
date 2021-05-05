export interface appBuilder {
  logo?: string;
  theme?: 'light' | 'dark';
}

export default interface HMSThemeProps {
  tailwindConfig: any;
  appBuilder: appBuilder;
}
