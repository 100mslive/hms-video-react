import { Container } from 'postcss';
import React, { PropsWithChildren } from 'react';

interface Props {
  classes: { [key: string]: string } | ContainerClasses;
}

interface ContainerClasses {
  rootContainer: string;
  wrapperContainer: string;
  textContainer: string;
  textHeader: string;
  textParagraph: string;
}

const defaultClasses: ContainerClasses = {
  rootContainer: 'w-full p-4 bg-red-500',
  wrapperContainer: 'p-4 bg-blue-500',
  textContainer: 'p-4 bg-green-500',
  textHeader: 'my-4 text-4xl text-gray-500',
  textParagraph: 'my-2 stext-gray-300',
};

type Rec = Record<string, string>;
const resolveClasses = (user: Rec, def: Rec) => {
  const hash: any = {};
  Object.keys(def).map(k => {
    if (user.hasOwnProperty(k)) {
      hash[k] = `${def[k]} ${user[k]}`;
    } else {
      hash[k] = def[k];
    }
  });
  return hash;
};

type NativeAttrs = Omit<React.DetailsHTMLAttributes<any>, keyof Props>;
export type ContainerProps = Props & NativeAttrs;

export const NestedContainer: React.FC<PropsWithChildren<ContainerProps>> = ({
  classes,
}) => {
  // @ts-ignore
  const finalClasses = resolveClasses(classes, defaultClasses);
  console.log(finalClasses);
  return (
    <div className={finalClasses.rootContainer}>
      <div className={finalClasses.wrapperContainer}>
        <div className={finalClasses.textContainer}>
          <h1 className={finalClasses.textHeader}>Text Header</h1>
          <p className={finalClasses.textParagraph}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
            recusandae sit laborum blanditiis ipsum quas qui sunt pariatur odio
            impedit.
          </p>
        </div>
      </div>
    </div>
  );
};
