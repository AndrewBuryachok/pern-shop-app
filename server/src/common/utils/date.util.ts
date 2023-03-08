export const getDateWeekAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

export const getDateMonthAgo = (month: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - month);
  return date;
};
