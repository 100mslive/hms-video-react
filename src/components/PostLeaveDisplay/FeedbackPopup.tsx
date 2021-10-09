import React, { useMemo, SetStateAction, Dispatch } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import thumbsup from '../../../public/thumbsup.png';
import thumbsdown from '../../../public/thumbsdown.png';
import { FeedbackForm } from './FeedbackForm';
import { Button } from '../Button';

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
    setFeedbackBody?: Dispatch<SetStateAction<JSX.Element>>;
    setModalFooter?: Dispatch<SetStateAction<JSX.Element>>;
    popupFooter: JSX.Element;
    setModalTitle?: Dispatch<SetStateAction<string>>;
}

const defaultClasses = {
    feedbackSection: "flex justify-evenly",
    feedbackIconSection: "w-full h-24 mt-10 mb-2",
    feedbackColumn: "flex-col text-center justify-evenly cursor-pointer",
    footerFeedback:"flex  mr-44 space-x-5"
};


export const FeedbackPopup: React.FunctionComponent<FeedbackPopupProps> = ({
    classes,
    setShowModal = () => { },
    setFeedbackBody = () => { },
    setModalTitle = () => { },
    setModalFooter = () => { },
    popupFooter
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

    const likeHandler = () => {
        console.info('Like Clicked');
        setShowModal(false);
    }

    const getFeedbackHandler = () => {
        setFeedbackBody(<FeedbackForm />)
        setModalTitle('What went wrong ?')
        setModalFooter(getFeedbackFormFooter())
    }

    const getFeedbackFormFooter = () => {
        return (
            <div className={styler("footerFeedback")}>
                <div className={styler("cancelFeedback")}>
                    <Button
                        variant="emphasized"
                        size="md"
                        disabled={true}
                    >
                        Submit
                    </Button>
                </div>

                <div className={styler("cancelFeedback")}>
                    <Button
                        onClick={() => { setShowModal(false); setModalFooter(popupFooter) }}
                        variant="no-fill"
                        size="md"
                        style={{ color: "#6085BC" }}>
                        Cancel
                    </Button>
                </div>

            </div>
        )
    }

    return (
        <div className={styler("feedbackSection")}>
            <div onClick={likeHandler} className={styler("feedbackColumn")}>
                <img src={thumbsup} className={styler("feedbackIconSection")} alt="thumbsup" />
                <div>Good</div>
            </div>
            <div onClick={getFeedbackHandler} className={styler("feedbackColumn")}>
                <img src={thumbsdown} className={styler("feedbackIconSection")} alt="thumbsdown" />
                <div>Bad</div>
            </div>
        </div>
    );
};