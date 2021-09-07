// @ts-ignore
import { apply, TW } from 'twind';

export const resolveClasses = <T extends Record<string, any>>(
  defaults: T,
  custom?: Partial<T>,
): T => {
  if (!custom) {
    return defaults;
  }

  const hash = { ...defaults };

  for (const k in defaults) {
    if (custom.hasOwnProperty(k)) {
      Object.assign(hash, { [k]: `${defaults[k]} ${custom[k]}` });
    }
  }

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
  const finalClasses = resolveClasses<T>(defaultClasses, classes);
  if (tw) {
    return tw(
      `${tag}-${s}`,
      (customClasses && (customClasses[s] as unknown)) as string,
      // @ts-ignore
      apply(finalClasses[s]),
    );
  }
  // handle edge case of tw not being present
  else {
    return defaultStyler(defaultClasses, s);
  }
};
