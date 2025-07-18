export const normalizeHistoricalTime = (date: Date): Date => {
  const normalizedDate = new Date(date);

  const utcHours = normalizedDate.getUTCHours();
  const utcMinutes = normalizedDate.getUTCMinutes();
  const utcSeconds = normalizedDate.getUTCSeconds();

  // Create a new date with today's date but preserve the original time
  const today = new Date();
  return new Date(Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    utcHours,
    utcMinutes,
    utcSeconds,
  ));
};