import React, { PropsWithChildren } from 'react';
import { apply, tw } from 'twind';

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
  textParagraph: 'my-2 text-gray-300',
};

type Rec = { [key: string]: string } | ContainerClasses;
const resolveClasses = (user: Rec, def: Rec) => {
  const hash: any = {};
  Object.keys(def).map(k => {
    if (user.hasOwnProperty(k)) {
      hash[k] = `${(def as any)[k]} ${(user as any)[k]}`;
    } else {
      hash[k] = (def as any)[k];
    }
  });
  return hash;
};
const twa = (s: string, r: string): string => tw(r, apply(s));

type NativeAttrs = Omit<React.DetailsHTMLAttributes<any>, keyof Props>;
export type ContainerProps = Props & NativeAttrs;

export const NestedContainer: React.FC<PropsWithChildren<ContainerProps>> = ({
  classes,
}) => {
  const finalClasses: ContainerClasses = resolveClasses(
    classes,
    defaultClasses,
  );
  return (
    <div className={twa(finalClasses.rootContainer, 'rootContainer')}>
      <div className={twa(finalClasses.wrapperContainer, 'wrapperContainer')}>
        <div className={twa(finalClasses.textContainer, 'textContainer')}>
          <h1 className={twa(finalClasses.textHeader, 'textHeader')}>
            Text Header
          </h1>
          <p className={twa(finalClasses.textParagraph, 'textParagraph')}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
            recusandae sit laborum blanditiis ipsum quas qui sunt pariatur odio
            impedit.
          </p>
        </div>
      </div>
    </div>
  );
};
