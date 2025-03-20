export const isNumber = (value: any): boolean => {
  return !isNaN(Number(value));
};

export const isValidURL = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};
