
export const resolveClasses = (user: any, def: any) => {
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

export const camelize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};