export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const isEmptyString = (data: string): boolean => typeof data === "string" && data.trim().length == 0;
