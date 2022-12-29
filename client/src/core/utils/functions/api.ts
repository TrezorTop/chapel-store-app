export const buildRequestUrl = <T extends object>(url: string, data: T) => {
  return Object.entries(data).reduce(
    (acc, current) => (current[1] ? acc + `${current[0]}=${current[1]}&` : acc),
    `${url}?`,
  );
};
