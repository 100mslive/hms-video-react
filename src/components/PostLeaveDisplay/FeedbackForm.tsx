

import React, { useMemo, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { RowLayout } from './RowLayout';


import './index.css';

export interface FeedbackFormClasses {
    feedbackSection?: string;
    feedbackIconSection?: string;
    feedbackColumn?: string;
    cancelFeedback?: string;
    checkBoxLabel?: string;
    feedbackChoiceSection?: string;
    formLabel?: string;

}


export interface FeedbackFormProps {
    classes?: FeedbackFormClasses;
    setShowModal?: (value: boolean) => void;
    onChoiceChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    setUserComment: Dispatch<SetStateAction<string>>;
    userComment:string;
    userCommentHandler:(event:ChangeEvent<HTMLTextAreaElement>)=>void


}

const defaultClasses = {
    feedbackChoiceSection: 'mt-2',
    formLabel: 'text-sm text-gray-400 mb-2 block'
};


export const FeedbackForm = ({
    classes,
    onChoiceChangeHandler,
    userComment,
    userCommentHandler
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
            <div className="feedback">
                <div className="form">
                    <label htmlFor="feedbackText" className={styler("formLabel")}>Additional Comments</label>
                    <textarea value={userComment} onChange={userCommentHandler} name="feedbackText"></textarea>
                </div>
            </div>
        </div>
    );
};