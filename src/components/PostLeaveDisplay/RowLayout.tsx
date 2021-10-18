import React, { ChangeEvent, useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
export interface RowLayoutClasses {
  feedbackSection?: string;
  feedbackIconSection?: string;
  feedbackColumn?: string;
  cancelFeedback?: string;
  checkBoxLabel?: string;
  feedbackRow?: string;
  rowItem?: string;
}
export interface RowLayoutProps {
  classes?: RowLayoutClasses;
  choice: string;
  onChoiceChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const defaultClasses = {
  checkBoxLabel: 'text-sm space-x-3 flex items-center',
  feedbackRow: 'flex items-center w-48 m-auto mt-5 mb-5 ml-8',
  rowItem: 'flex-grow w-2/4 cursor-pointer',
};
export const RowLayout: React.FunctionComponent<RowLayoutProps> = ({
  classes,
  choice,
  onChoiceChangeHandler,
}: RowLayoutProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<RowLayoutClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-row-layout',
      }),
    [],
  );

  return (
    <div className={styler('feedbackRow')}>
      <div className={styler('rowItem')}>
        <label className={styler('checkBoxLabel')}>
          <input
            onChange={onChoiceChangeHandler}
            value={choice}
            type="checkbox"
          />
          <span>{choice}</span>
        </label>
      </div>
    </div>
  );
};
