import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

import { Thumbsup, Thumbsdown } from '../Icons';
export interface FeedbackPopupClasses {
  feedbackSection?: string;
  feedbackIconSection?: string;
  feedbackColumn?: string;
  cancelFeedback?: string;
  footerFeedback?: string;
}
export interface FeedbackPopupProps {
  classes?: FeedbackPopupClasses;
  setShowModal?: (value: boolean) => void;
  getFeedbackHandler?: () => void;
  getPostiveFeedbackHandler?: () => void;
}

const defaultClasses = {
  feedbackSection: 'flex justify-evenly mt-5',
  feedbackIconSection: 'w-full h-24 mt-10 mb-2',
  feedbackColumn: 'flex-col text-center justify-evenly cursor-pointer',
  footerFeedback: 'flex  mr-40 space-x-5',
};
export const FeedbackPopup: React.FunctionComponent<FeedbackPopupProps> = ({
  classes,
  setShowModal = () => {},
  getFeedbackHandler = () => {},
  getPostiveFeedbackHandler = () => {},
}: FeedbackPopupProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<FeedbackPopupClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-feedback-popup',
      }),
    [],
  );
  const IconStyles = { backgroundColor: '#fff', clipPath: 'circle(49%)' };
  return (
    <div className={styler('feedbackSection')}>
      <div
        onClick={getPostiveFeedbackHandler}
        className={styler('feedbackColumn')}
      >
        <Thumbsup style={IconStyles} />
        <div>Good</div>
      </div>
      <div onClick={getFeedbackHandler} className={styler('feedbackColumn')}>
        <Thumbsdown style={IconStyles} />
        <div>Bad</div>
      </div>
    </div>
  );
};
