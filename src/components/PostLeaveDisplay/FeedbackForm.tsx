

import React, { ChangeEvent, Dispatch, SetStateAction, useMemo } from 'react';
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
    userComment: string;
    showChoice: boolean
    userCommentHandler: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

const defaultClasses = {
    feedbackChoiceSection: 'mt-2',
    formLabel: 'text-sm text-gray-400 mb-2 block'
};


export const FeedbackForm = ({
    classes,
    onChoiceChangeHandler,
    userComment,
    userCommentHandler,
    showChoice
}: FeedbackFormProps) => {
    const { tw } = useHMSTheme();

    const feedbackOptions = [
        "I could not hear others",
        "I could not see others",
        "Others could not hear me",
        "Others could not see me",
        "Poor audio quality",
        "Poor video quality"
    ]

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
            <div className="feedbackChoices" style={{ display: (showChoice) ? 'block' : 'none' }}>
                {feedbackOptions.reduce(
                    function (accumulator:Array<Array<string>>, currentValue, currentIndex, array: string[]) {
                        if (currentIndex % 2 === 0) {
                            accumulator.push(array.slice(currentIndex, currentIndex + 2));
                        }
                        return accumulator;
                    }, []).map((choices: string[]) => {
                        return (<RowLayout key={choices[0]} onChoiceChangeHandler={onChoiceChangeHandler} choice1={choices[0]} choice2={choices[1]} />)
                    }
                    )
                }
            </div>
            <div className="feedback">
                <div className="form">
                    <label htmlFor="feedbackText" className={styler("formLabel")}>Additional Comments</label>
                    <textarea value={userComment} onChange={userCommentHandler} name="feedbackText"></textarea>
                </div>
            </div>
        </div>
    );
};
