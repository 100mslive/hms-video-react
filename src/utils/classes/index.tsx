import {useHMSTheme} from '../../hooks/HMSThemeProvider';
// @ts-ignore
import { apply} from 'twind';

export const resolveClasses = (obj1: any, obj2: any) => {
  const hash: any = {};
  Object.keys(obj2).map(k => {
    if (obj1.hasOwnProperty(k)) {
      hash[k] = `${(obj2 as any)[k]} ${(obj1 as any)[k]}`;
    } else {
      hash[k] = (obj2 as any)[k];
    }
  });
  return hash;
};

export const camelize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

interface ParseClassProps<T>{
  /**
   * Classes passed by user
   */
  classes?:T;
  /**
   * Non-tailwind custom classes. Only use this as an escape hatch
   */
  customClasses?:T;
  /**
   * Default tailwind classes
   */
  defaultClasses:T;
  tag:string;
} 

export const hmsUiClassParserGenerator = <T extends {}>({classes, customClasses, defaultClasses, tag}:ParseClassProps<T>) => (s:keyof T) =>{
  const {tw} = useHMSTheme();
  const finalClasses = resolveClasses(classes || {}, defaultClasses);
  return tw(`${tag}-${s}`, customClasses![s] as unknown as string ,apply(finalClasses[s]));
}