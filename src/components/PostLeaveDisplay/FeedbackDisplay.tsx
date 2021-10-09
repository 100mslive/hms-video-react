import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';



import { MessageModal } from '../MessageModal';
import { FeedbackPopup } from './FeedbackPopup';




export interface FeedbackDisplayClasses {
    cancelFeedback?: string;
}


export interface FeedbackDisplayProps {
    classes?: FeedbackDisplayClasses;
    showModal: boolean;
    setShowModal?: (value: boolean) => void;
    footer: JSX.Element
}

const defaultClasses = {
    cancelFeedback: "justify-center pt-5 mr-48"
};


export const FeedbackDisplay: React.FunctionComponent<FeedbackDisplayProps> = ({
    classes,
    showModal,
    setShowModal = () => { },
    footer
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
    const [modalTitle, setModalTitle] = useState('How was your meeting experience ?');
    const [modalFooter, setModalFooter] = useState(footer);

    

    useEffect(() => {
        setFeedbackBody(<FeedbackPopup
            setFeedbackBody={setFeedbackBody}
            setShowModal={setShowModal}
            setModalTitle={setModalTitle}
            setModalFooter={setModalFooter}
            popupFooter={footer}
        />)

    }, [showModal])
    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <MessageModal
            title={modalTitle}
            show={showModal}
            onClose={handleClose}
            classes={{ header: 'mb-2' }}
            modalType='feedback'
            body={
                <Fragment>
                    {feedbackBody}
                </Fragment>
            }
            footer={
                <Fragment>
                    {modalFooter}
                </Fragment>
            }
        />
    );
};