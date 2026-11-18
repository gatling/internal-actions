import {getISOWeek} from './date-utils';

// Noon local time: getISOWeek reads the local calendar date, and noon is clear of any daylight saving change.
function at(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

describe('getISOWeek', () => {
  // Expected values from the system's `date -j -f %Y-%m-%d <date> +%G-%V`, not from this code.
  test.each([
    ['2020-12-31', 2020, 53],
    ['2021-01-03', 2020, 53],
    ['2021-01-04', 2021, 1],
    ['2025-12-28', 2025, 52],
    ['2025-12-29', 2026, 1],
    ['2026-01-01', 2026, 1],
    ['2026-11-18', 2026, 47],
    ['2026-12-31', 2026, 53],
    ['2027-01-01', 2026, 53],
    ['2027-01-03', 2026, 53],
    ['2027-01-04', 2027, 1],
    ['2027-12-31', 2027, 52],
    ['2028-01-02', 2027, 52],
    ['2028-01-03', 2028, 1],
    ['2029-12-31', 2030, 1],
    ['2032-01-04', 2032, 1],
  ])('%s is in week %i-W%i', (date, year, week) => {
    expect(getISOWeek(at(date))).toEqual({year, week});
  });

  test('every day from 2000 to 2040 follows the ISO 8601 week rules', () => {
    let previous = getISOWeek(at('1999-12-31'));
    for (const day = at('2000-01-01'); day.getFullYear() <= 2040; day.setDate(day.getDate() + 1)) {
      const current = getISOWeek(day);
      if (day.getDay() !== 1) {
        // A week only changes on a Monday.
        expect(current).toEqual(previous);
      } else if (current.week === 1) {
        // Week 1 follows the last week, 52 or 53, of the year before.
        expect(current.year).toEqual(previous.year + 1);
        expect([52, 53]).toContain(previous.week);
      } else {
        expect(current).toEqual({year: previous.year, week: previous.week + 1});
      }
      // 4 January is always in week 1, and 28 December always in the last week of its own year.
      if (day.getMonth() === 0 && day.getDate() === 4) {
        expect(current).toEqual({year: day.getFullYear(), week: 1});
      }
      if (day.getMonth() === 11 && day.getDate() === 28) {
        expect(current.year).toEqual(day.getFullYear());
      }
      previous = current;
    }
  });
});
