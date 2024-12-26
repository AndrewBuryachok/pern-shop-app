export const getDateWeekAfter = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};
