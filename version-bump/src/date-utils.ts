export function getISOWeek(date: Date): number {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  // Go to Thursday of the current week (ISO week)
  tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
  // Compute the first week of year
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  // Compute the week number
  return Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 + 1) / 7) + 1;
}

export function formatDateToYYYYMMDDHHmm(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}`;
}
