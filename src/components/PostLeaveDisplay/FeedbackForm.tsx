import React, { useMemo, Fragment, useState, useEffect } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Button } from '../Button';
import thumbsup from '../../../public/thumbsup.png';
import thumbsdown from '../../../public/thumbsdown.png';

import { MessageModal } from '../MessageModal';



export interface FeedbackFormClasses {
    feedbackSection?: string;
    feedbackIconSection?: string;
    feedbackColumn?: string;
    cancelFeedback?: string;
}


export interface FeedbackFormProps {
    classes?: FeedbackFormClasses;
    showModal?: boolean;
    setShowModal?: (value: boolean) => void;
}

const defaultClasses = {
    sliderContainer: 'w-full',
    slider: 'rounded-lg w-full p-2 flex items-center ',
    divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
    feedbackSection: "flex justify-evenly",
    feedbackIconSection: "w-full h-32 mt-10 mb-2",
    feedbackColumn: "flex-col text-center justify-evenly cursor-pointer",
    cancelFeedback: "justify-center pt-5 mr-48"
};


export const FeedbackForm = ({
    classes,
    showModal,
    setShowModal = () => { },
}: FeedbackFormProps) => {
    const { tw } = useHMSTheme();
    const styler = useMemo(
        () =>
            hmsUiClassParserGenerator<FeedbackFormClasses>({
                tw,
                classes,
                defaultClasses,
                tag: 'hmsui-feedback-form',
            }),
        [],
    );

    useEffect(() => {
        if (showModal === undefined) {
            return;
        }
        setOpen(showModal);
    }, [showModal]);


    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <MessageModal
            title="How was your meeting experience ?"
            show={open}
            onClose={handleClose}
            classes={{ header: 'mb-2' }}
            modalType='feedback'
            body={
                <Fragment>
                    <div className={styler("feedbackSection")}>
                        <div className={styler("feedbackColumn")}><img src={thumbsup} className={styler("feedbackIconSection")} alt="thumbsup" /><div>Good</div></div>
                        <div className={styler("feedbackColumn")}><img src={thumbsdown} className={styler("feedbackIconSection")} alt="thumbsdown" /><div>Bad</div></div>
                    </div>
                </Fragment>
            }
            footer={
                <Fragment>
                    <div className={styler("cancelFeedback")}>
                        <Button
                            onClick={() => setShowModal(false)}
                            variant="no-fill"
                            size="sm"
                            style={{ color: "#6085BC" }}>
                            Cancel
                        </Button>
                    </div>
                </Fragment>
            }
        />
    );
};