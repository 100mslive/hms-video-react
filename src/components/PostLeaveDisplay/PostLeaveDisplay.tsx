import React, { useMemo, useState } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { SunWithFace } from '../Icons';
import { Text } from '../Text';
import { Button } from '../Button';
import post_leave_img from './post_leave.png';

import { FeedbackDisplay } from './FeedbackDisplay';
interface Props {
  username?: string;
  classes?: PostLeaveDisplayClasses;
  joinRoomOnClick?: (event: React.MouseEvent) => void;
  goToDashboardOnClick?: (event: React.MouseEvent) => void;
  getFeedbackOnClick?: (values: any) => void;
  src?: string;
}
interface PostLeaveDisplayClasses {
  root: string;
  rootBg: string;
  rootOverlay: string;
  sunnyFaceIconDiv: string;
  divider: string;
  buttonWrapper: string;
  feedbackSection: string;
  cancelFeedback: string;
}

export const PostLeaveDisplay: React.FC<Props> = ({
  username = '',
  classes,
  joinRoomOnClick,
  goToDashboardOnClick,
  getFeedbackOnClick,
  src,
}) => {
  const defaultClasses: PostLeaveDisplayClasses = {
    root: `h-full text-white flex items-center justify-center`,
    rootBg: `w-37.5 h-42.5 rounded-2xl`,
    rootOverlay: `relative rounded-2xl  flex flex-col text-center items-center space-y-6`,
    sunnyFaceIconDiv: `mt-24 mb-6`,
    divider: `bg-gray-600  h-px w-96 my-8`,
    buttonWrapper: `space-x-5`,
    feedbackSection: `mt-48`,
    cancelFeedback: `justify-center pt-5 mr-48`,
  };
  const { tw } = useHMSTheme();
  const [showModal, setShowModal] = useState(false);
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PostLeaveDisplayClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-post-leave-display',
      }),
    [],
  );

  return (
    <div className={styler('root')}>
      <div
        className={styler('rootBg')}
        style={{
          backgroundImage: `url(${src || post_leave_img})`,
        }}
      >
        <div
          className={styler('rootOverlay')}
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
        >
          <div className={styler('sunnyFaceIconDiv')}>
            <SunWithFace />
          </div>
          <Text tag="h1" variant="heading">
            You left the room
          </Text>
          <Text tag="h1" variant="heading">
            Have a nice day {username} !
          </Text>
          <div className={styler('divider')}></div>
          <div className={styler('buttonWrapper')}>
            <Button variant="emphasized" onClick={joinRoomOnClick}>
              Join Again
            </Button>
            <Button onClick={goToDashboardOnClick}>Go to Dashboard</Button>
          </div>
          <div
            className={styler('feedbackSection')}
            style={{
              marginTop: `35%`,
            }}
          >
            <Button
              style={{
                backgroundColor: `#E3E3E3`,
                color: `#767676`,
              }}
              onClick={() => {
                if (getFeedbackOnClick) {
                  getFeedbackOnClick(setShowModal);
                }
              }}
            >
              Send Feedback
            </Button>
            <FeedbackDisplay
              setShowModal={setShowModal}
              showModal={showModal}
              footer={
                <div className={styler('cancelFeedback')}>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="no-fill"
                    size="sm"
                    style={{ color: '#6085BC' }}
                  >
                    Cancel
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
