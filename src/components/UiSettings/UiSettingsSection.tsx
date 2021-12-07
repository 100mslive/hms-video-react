import React, { useMemo, Fragment } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface UiSettingsSectionClasses {
  sectionContainer?: string;
  title?: string;
  body?: string;
}

const defaultClasses = {
  sectionContainer: 'w-full',
  title:
    'flex flex-1 lg:text-2xl sm:text-xl self-center items-center text-gray-100 dark:text-white font-medium py-2',
  body: 'w-full',
};

export interface UiSettingsSectionProps {
  classes?: UiSettingsSectionClasses;
  title: string;
  body: React.ReactNode;
}

export const UiSettingsSection = ({
  classes,
  title,
  body,
}: UiSettingsSectionProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<UiSettingsSectionClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-uisettings-section',
      }),
    [],
  );

  return (
    <Fragment>
      <div className={styler('title')}>{title}</div>
      <div className={styler('body')}>{body}</div>
    </Fragment>
  );
};
