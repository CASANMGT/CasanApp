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

export const isHttpUrl = (path: string): boolean => {
  try {
    const url = new URL(path);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const isFilePath = (path: string): boolean => {
  return (
    !isHttpUrl(path) &&
    (path.startsWith("/") || path.startsWith("./") || path.startsWith("../"))
  );
};
