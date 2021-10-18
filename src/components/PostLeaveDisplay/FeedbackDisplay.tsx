import React, {
  useMemo,
  useState,
  ChangeEvent,
  useEffect,
  Fragment,
} from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { FeedbackForm } from './FeedbackForm';
import { Button } from '../Button';
import { FeedbackPopup } from './FeedbackPopup';
import { MessageModal } from '../MessageModal';
export interface FeedbackDisplayClasses {
  cancelFeedback?: string;
  footerFeedback?: string;
}
export interface FeedbackDisplayProps {
  classes?: FeedbackDisplayClasses;
  showModal: boolean;
  setShowModal?: (value: boolean) => void;
  footer: JSX.Element;
}

const defaultClasses = {
  cancelFeedback: 'justify-center pt-5',
  footerFeedback: 'flex  mr-40 space-x-5',
};
export const FeedbackDisplay: React.FunctionComponent<FeedbackDisplayProps> = ({
  classes,
  showModal,
  setShowModal = () => {},
  footer,
}: FeedbackDisplayProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<FeedbackDisplayClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-feedback-display',
      }),
    [],
  );

  const [feedbackBody, setFeedbackBody] = useState(<></>);
  const [modalTitle, setModalTitle] = useState(
    'How was your meeting experience ?',
  );
  const [modalFooter, setModalFooter] = useState(footer);
  const [userFeedbackChoices, setUserFeedbackChoices] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [feedbackData, setFeedbackData] = useState<{
    choices: string[];
    comment: string;
  }>({ choices: [], comment: '' });
  const [currentSection, setCurrentSection] = useState(true);
  const getFeedbackForm = (showChoice: boolean) => {
    return (
      <FeedbackForm
        userComment={userComment}
        setUserComment={setUserComment}
        onChoiceChangeHandler={onChoiceChangeHandler}
        userCommentHandler={userCommentHandler}
        showChoice={showChoice}
      />
    );
  };
  const [initialState, setInitialState] = useState(false);

  const getFeedbackHandler = () => {
    setFeedbackBody(getFeedbackForm(true));
    setModalTitle('What went wrong ?');
    setModalFooter(getFeedbackFormFooter());
    setInitialState(true);
    setCurrentSection(true);
    setFeedbackData({ choices: [], comment: '' });
  };

  const getPostiveFeedbackHandler = () => {
    setFeedbackBody(getFeedbackForm(false));
    setModalTitle('What did you like the most ?');
    setModalFooter(getFeedbackFormFooter());
    setInitialState(true);
    setCurrentSection(false);
    setFeedbackData({ choices: [], comment: '' });
  };
  const addChoiceToState = (selectedChoice: string) => {
    setFeedbackData(currentData => {
      return {
        choices: [...currentData.choices, selectedChoice],
        comment: currentData.comment,
      };
    });
  };
  const userCommentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserComment(event.target.value);
    setFeedbackData(currentData => {
      return { choices: [...currentData.choices], comment: event.target.value };
    });
  };

  const removeChoiceFromState = (unselectedChoice: string) => {
    setFeedbackData(currentData => {
      let updatedChoices: string[];
      updatedChoices = currentData.choices.filter(
        (item: string) => item !== unselectedChoice,
      );
      return { choices: [...updatedChoices], comment: feedbackData.comment };
    });
  };
  const onChoiceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setUserFeedbackChoices(currentValue => currentValue + 1);
      addChoiceToState(event.target.value);
    } else {
      setUserFeedbackChoices(currentValue => currentValue - 1);
      removeChoiceFromState(event.target.value);
    }
  };
  const getUserFeedback = () => {
    setFeedbackData(currentData => {
      console.info(currentData);
      return currentData;
    });
    setToDefault();
  };

  const setToDefault = () => {
    setShowModal(false);
    setModalFooter(footer);
    setUserFeedbackChoices(0);
    setUserComment('');
    setInitialState(false);
  };

  useEffect(() => {
    if (initialState) {
      setModalFooter(getFeedbackFormFooter());
    }
    setInitialState(true);
  }, [userFeedbackChoices]);

  useEffect(() => {
    if (initialState) {
      setFeedbackBody(getFeedbackForm(currentSection));
      setModalFooter(getFeedbackFormFooter());
    }
  }, [userComment]);
  const getFeedbackFormFooter = () => {
    return (
      <div className={styler('footerFeedback')}>
        <div className={styler('cancelFeedback')}>
          <Button
            variant="emphasized"
            size="md"
            disabled={
              userFeedbackChoices > 0 || userComment.length > 0 ? false : true
            }
            onClick={getUserFeedback}
          >
            Submit
          </Button>
        </div>

        <div className={styler('cancelFeedback')}>
          <Button
            onClick={() => {
              setToDefault();
            }}
            variant="no-fill"
            size="md"
            style={{ color: '#6085BC' }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setFeedbackBody(
      <FeedbackPopup
        setShowModal={setShowModal}
        getFeedbackHandler={getFeedbackHandler}
        getPostiveFeedbackHandler={getPostiveFeedbackHandler}
      />,
    );
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <MessageModal
      title={modalTitle}
      show={showModal}
      onClose={handleClose}
      classes={{ header: 'mb-2' }}
      modalType="feedback"
      body={<Fragment>{feedbackBody}</Fragment>}
      footer={<Fragment>{modalFooter}</Fragment>}
    />
  );
};
