import React, { useMemo, useEffect, ElementType, ChangeEvent } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { RowLayout } from './RowLayout';




export interface FeedbackFormClasses {
    feedbackSection?: string;
    feedbackIconSection?: string;
    feedbackColumn?: string;
    cancelFeedback?: string;
    checkBoxLabel?: string;
    feedbackChoiceSection?: string;
}


export interface FeedbackFormProps {
    classes?: FeedbackFormClasses;
    setShowModal?: (value: boolean) => void;
}

const defaultClasses = {
    feedbackChoiceSection: 'mt-5'
};


export const FeedbackForm = ({
    classes,
    setShowModal = () => { },
}: FeedbackFormProps) => {
    const { tw } = useHMSTheme();

    let feedbackOptions = [
        "I could not hear others",
        "I could not see others",
        "Others could not hear me",
        "Others could not see me",
        "Poor audio quality",
        "Poor video quality"
    ]
    let layoutSection = [];

    const onChoiceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        console.info(event.target.value);
    }



    for (let contentInd = 0; contentInd < feedbackOptions.length; contentInd += 2) {
        if (contentInd + 1 < feedbackOptions.length) {
            layoutSection.push(<RowLayout key={feedbackOptions[contentInd]} onChoiceChangeHandler={onChoiceChangeHandler} choice1={feedbackOptions[contentInd]} choice2={feedbackOptions[contentInd + 1]} />)
        }
        else {
            layoutSection.push(<RowLayout key={feedbackOptions[contentInd]} onChoiceChangeHandler={onChoiceChangeHandler} choice1={feedbackOptions[contentInd]} />)
        }
    }





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



    return (
        <div className={styler("feedbackChoiceSection")}>
            {layoutSection}
        </div>

    );
};