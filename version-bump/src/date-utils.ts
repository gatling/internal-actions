export interface ISOWeek {
  year: number;
  week: number;
}

/**
 * The ISO 8601 week of a date. Weeks start on Monday and belong to the year of their Thursday, so week 1 is the week
 * holding 4 January. Around the new year that year differs from the date's own: 2025-12-29 is in week 1 of 2026, and
 * 2027-01-01 in week 53 of 2026.
 */
export function getISOWeek(date: Date): ISOWeek {
  // The Thursday of the date's week, from the date's local calendar day, counted in UTC days, which are all 24 hours
  // long: a local day across a daylight saving change is not
  const thursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3 - (date.getDay() + 6) % 7));
  const year = thursday.getUTCFullYear();
  const dayOfYear = (thursday.getTime() - Date.UTC(year, 0, 1)) / 86400000;
  return {year, week: Math.floor(dayOfYear / 7) + 1};
}

export function formatDateToYYYYMMDDHHmm(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}`;
}
