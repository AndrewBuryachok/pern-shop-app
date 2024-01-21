export const getDateWeekAfter = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

export const getDateMonthBefore = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};
