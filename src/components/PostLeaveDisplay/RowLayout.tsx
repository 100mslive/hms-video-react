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
    choice1: string;
    choice2?: string;
    onChoiceChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const defaultClasses = {
    checkBoxLabel: 'text-sm space-x-3 flex items-center',
    feedbackRow: 'flex items-center w-4/5 m-auto mt-5 mb-5',
    rowItem: 'flex-grow w-2/4 cursor-pointer'
};


export const RowLayout: React.FunctionComponent<RowLayoutProps> = ({
    classes,
    choice1,
    choice2,
    onChoiceChangeHandler
}: RowLayoutProps) => {
    const { tw } = useHMSTheme();
    const styler = useMemo(
        () =>
            hmsUiClassParserGenerator<RowLayoutClasses>({
                tw,
                classes,
                defaultClasses,
                tag: 'hmsui-row-layout'
            }),
        [],
    );






    return (
        <div className={styler('feedbackRow')}>
            <div className={styler('rowItem')}>
                <label className={styler('checkBoxLabel')}>
                    <input onChange={onChoiceChangeHandler} value={choice1} type="checkbox" />
                    <span>{choice1}</span>
                </label>
            </div>
            {choice2 && <div className={styler('rowItem')}>
                <label className={styler('checkBoxLabel')}>
                    <input onChange={onChoiceChangeHandler} type="checkbox" value={choice2} />
                    <span>{choice2}</span>
                </label>
            </div>
            }
        </div>
    );
};