// @ts-ignore
import { apply, TW } from 'twind';

export const resolveClasses = (obj1: any, obj2: any) => {
  const hash: any = {};
  Object.keys(obj2).forEach(k => {
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

interface ParseClassProps<T> {
  tw: TW;
  /**
   * Classes passed by user
   */
  classes?: T;
  /**
   * Non-tailwind custom classes. Only use this as an escape hatch
   */
  customClasses?: T;
  /**
   * Default tailwind classes
   */
  defaultClasses: T;
  tag: string;
}

const defaultStyler = <T extends {}>(defaultClasses: T, s: keyof T) => {
  return defaultClasses[s] ? defaultClasses[s] : '';
};

export const hmsUiClassParserGenerator = <T extends {}>({
  tw,
  classes,
  customClasses,
  defaultClasses,
  tag,
}: ParseClassProps<T>) => (s: keyof T) => {
  const finalClasses = resolveClasses(classes || {}, defaultClasses);
  if (tw) {
    return tw(
      `${tag}-${s}`,
      (customClasses && (customClasses[s] as unknown)) as string,
      apply(finalClasses[s]),
    );
  }
  //handle edge case of tw not being present
  else {
    return defaultStyler(defaultClasses, s);
  }
};
