export const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  });

  return formatter.format(value);
};
