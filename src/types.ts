export type AudioLevelDisplayType = 'inline-wave' | 'inline-circle' | 'border';

export type ButtonDisplayType = 'circle' | 'rectangle';

// styler is a function which takes in css class and returns another embeddable class
export type StylerType<T> = (s: keyof T) => string | undefined;
