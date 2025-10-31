export const fiveMinutesFromNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  return d;
};

export const fiveDaysFromNow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d;
};
