export const buildRequestUrl = <T extends object>(url: string, data: T) => {
  return Object.keys(data).reduce(
    (acc, current) => acc + `${current}=${data[current as keyof T]}&`,
    `${url}?`,
  );
};
