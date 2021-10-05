import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface SingleSectionClasses {
    sectionContainer?: string;
    title?:string,
    body?:string
}

const defaultClasses = {
    sectionContainer: 'w-full',
    title: 'flex flex-1 lg:text-2xl sm:text-xl self-center items-center text-gray-100 dark:text-white font-medium',
    body: 'w-full',
};

export interface SingleSectionProps {
    classes?: SingleSectionClasses;
    title: string;
    body: React.ReactNode;
}

export const SingleSection = ({
    classes,
    title,
    body
}: SingleSectionProps) => {
    const { tw } = useHMSTheme();
    const styler = useMemo(
        () =>
            hmsUiClassParserGenerator<SingleSectionClasses>({
                tw,
                classes,
                defaultClasses,
                tag: 'hmsui-single-section',
            }),
        [],
    );

    return (
        <Fragment>
            <div className={styler('title')}>{title}</div>
            <div className={styler('body')}>{body}</div>
        </Fragment>
    );
};
