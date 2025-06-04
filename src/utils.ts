/* eslint-disable @typescript-eslint/no-explicit-any */
export const getLocalItem = (key: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key);
  }
  return null;
};

export const setLocalItem = (key: string, value: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.setItem(key, value);
  }
  return null;
};