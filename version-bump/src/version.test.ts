import {bumpVersion, compareVersions, findMaxVersion, parseVersion, Version, versionToString} from './version';
import {getISOWeek} from "./date-utils";

describe('Version Utilities', () => {
  describe('compareVersions', () => {
    test('should compare equal versions', () => {
      const a: Version = {major: 1, minor: 2, patch: 3};
      const b: Version = {major: 1, minor: 2, patch: 3};
      expect(compareVersions(a, b)).toBe(0);
    });

    test('should compare major version difference', () => {
      const a: Version = {major: 2, minor: 2, patch: 3};
      const b: Version = {major: 1, minor: 2, patch: 3};
      expect(compareVersions(a, b)).toBe(1);
      expect(compareVersions(b, a)).toBe(-1);
    });

    test('should compare minor version difference', () => {
      const a: Version = {major: 1, minor: 3, patch: 3};
      const b: Version = {major: 1, minor: 2, patch: 3};
      expect(compareVersions(a, b)).toBe(1);
      expect(compareVersions(b, a)).toBe(-1);
    });

    test('should compare patch version difference', () => {
      const a: Version = {major: 1, minor: 2, patch: 4};
      const b: Version = {major: 1, minor: 2, patch: 3};
      expect(compareVersions(a, b)).toBe(1);
      expect(compareVersions(b, a)).toBe(-1);
    });

    test('should compare build version difference', () => {
      const a: Version = {major: 1, minor: 2, patch: 3, build: 2};
      const b: Version = {major: 1, minor: 2, patch: 3, build: 1};
      expect(compareVersions(a, b)).toBe(1);
      expect(compareVersions(b, a)).toBe(-1);
    });

    test('should handle undefined build', () => {
      const a: Version = {major: 1, minor: 2, patch: 3, build: 1};
      const b: Version = {major: 1, minor: 2, patch: 3};
      expect(compareVersions(a, b)).toBe(1);
      expect(compareVersions(b, a)).toBe(-1);
    });

    test('should compare marker difference', () => {
      const a: Version = {major: 1, minor: 2, patch: 3, marker: 'beta'};
      const b: Version = {major: 1, minor: 2, patch: 3, marker: 'alpha'};
      expect(compareVersions(a, b)).toBe(1);
      expect(compareVersions(b, a)).toBe(-1);
    });

    test('should handle undefined marker', () => {
      const a: Version = {major: 1, minor: 2, patch: 3, marker: 'alpha'};
      const b: Version = {major: 1, minor: 2, patch: 3};
      expect(compareVersions(a, b)).toBe(-1);
      expect(compareVersions(b, a)).toBe(1);
    });
  });

  describe('findMaxVersion', () => {
    const zeroVersion: Version = {major: 0, minor: 0, patch: 0};

    test('should find max version', () => {
      const versions: Version[] = [
        {major: 1, minor: 2, patch: 3},
        {major: 2, minor: 0, patch: 0},
        {major: 1, minor: 2, patch: 4},
      ];
      const max = findMaxVersion(versions);
      expect(max).toEqual({major: 2, minor: 0, patch: 0});
    });

    test('should handle single version', () => {
      const versions: Version[] = [{major: 1, minor: 2, patch: 3}];
      expect(findMaxVersion(versions)).toEqual({major: 1, minor: 2, patch: 3});
    });

    test('should handle empty array', () => {
      expect(findMaxVersion([])).toEqual(zeroVersion);
    });

    test('should handle null input', () => {
      expect(findMaxVersion(null as any)).toEqual(zeroVersion);
    });

    test('should handle undefined input', () => {
      expect(findMaxVersion(undefined as any)).toEqual(zeroVersion);
    });

    test('should handle versions with build and marker', () => {
      const versions: Version[] = [
        {major: 1, minor: 2, patch: 3, build: 1},
        {major: 1, minor: 2, patch: 3, marker: 'alpha'},
        {major: 1, minor: 2, patch: 3, build: 2},
      ];
      expect(findMaxVersion(versions)).toEqual({major: 1, minor: 2, patch: 3, build: 2});
    });
  });

  describe('parseVersion', () => {
    test('should parse basic version', () => {
      const result = parseVersion('1.2.3');
      expect(result).toEqual({major: 1, minor: 2, patch: 3});
    });

    test('should parse version with build', () => {
      const result = parseVersion('1.2.3.4');
      expect(result).toEqual({major: 1, minor: 2, patch: 3, build: 4});
    });

    test('should parse version with marker', () => {
      const result = parseVersion('1.2.3-alpha');
      expect(result).toEqual({major: 1, minor: 2, patch: 3, marker: 'alpha'});
    });

    test('should parse version with build and marker', () => {
      const result = parseVersion('1.2.3.4-beta');
      expect(result).toEqual({major: 1, minor: 2, patch: 3, build: 4, marker: 'beta'});
    });

    test('should be undefined for invalid version string', () => {
      expect(parseVersion('invalid')).toBeUndefined();
      expect(parseVersion('1.2')).toBeUndefined();
      expect(parseVersion('1.2.3_4')).toBeUndefined();
    });
  });

  describe('versionToString', () => {
    test('should convert basic version to string', () => {
      const version: Version = {major: 1, minor: 2, patch: 3};
      expect(versionToString(version)).toBe('1.2.3');
    });

    test('should convert version with build to string', () => {
      const version: Version = {major: 1, minor: 2, patch: 3, build: 4};
      expect(versionToString(version)).toBe('1.2.3.4');
    });

    test('should convert version with marker to string', () => {
      const version: Version = {major: 1, minor: 2, patch: 3, marker: 'alpha'};
      expect(versionToString(version)).toBe('1.2.3-alpha');
    });

    test('should convert version with build and marker to string', () => {
      const version: Version = {major: 1, minor: 2, patch: 3, build: 4, marker: 'beta'};
      expect(versionToString(version)).toBe('1.2.3.4-beta');
    });
  });

  describe('bumpVersion', () => {
    const simpleBaseVersion: Version = {major: 1, minor: 2, patch: 3};
    const baseVersion: Version = {major: 1, minor: 2, patch: 3, build: 4, marker: 'alpha'};

    test('should bump major simple version', () => {
      const result = bumpVersion(simpleBaseVersion, 'major');
      expect(result).toEqual({major: 2, minor: 0, patch: 0});
    });

    test('should bump major version', () => {
      const result = bumpVersion(baseVersion, 'major');
      expect(result).toEqual({major: 2, minor: 0, patch: 0, build: 0});
    });

    test('should bump minor simple version', () => {
      const result = bumpVersion(simpleBaseVersion, 'minor');
      expect(result).toEqual({major: 1, minor: 3, patch: 0});
    });

    test('should bump minor version', () => {
      const result = bumpVersion(baseVersion, 'minor');
      expect(result).toEqual({major: 1, minor: 3, patch: 0, build: 0});
    });

    test('should bump patch simple version', () => {
      const result = bumpVersion(simpleBaseVersion, 'patch');
      expect(result).toEqual({major: 1, minor: 2, patch: 4});
    });

    test('should bump patch version', () => {
      const result = bumpVersion(baseVersion, 'patch');
      expect(result).toEqual({major: 1, minor: 2, patch: 4, build: 0});
    });

    test('should bump build version', () => {
      const result = bumpVersion(baseVersion, 'build');
      expect(result).toEqual({major: 1, minor: 2, patch: 3, build: 5});
    });

    test('should bump build version from undefined', () => {
      const version: Version = {major: 1, minor: 2, patch: 3};
      const result = bumpVersion(version, 'build');
      expect(result).toEqual({major: 1, minor: 2, patch: 3, build: 1});
    });

    test('should bump calver', () => {
      const result = bumpVersion(baseVersion, 'calver');
      const {year, week} = getISOWeek(new Date());
      expect(result.major).toEqual(year);
      expect(result.minor).toEqual(week);
      expect(result.patch).toEqual(0);
    });

    test('should bump calver-milestone', () => {
      const result = bumpVersion(baseVersion, 'calver-milestone');
      const {year, week} = getISOWeek(new Date());
      expect(result.major).toEqual(year);
      expect(result.minor).toEqual(week);
      expect(result.patch).toEqual(0);
      expect(result.build).toBeUndefined();
      expect(result.marker).toMatch(/M(\d{12})/);
    });

    describe('calver around the new year', () => {
      afterEach(() => {
        jest.useRealTimers();
      });

      function today(year: number, month: number, day: number) {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(year, month - 1, day, 12));
      }

      test('should take the ISO week-year in the last days of December', () => {
        today(2025, 12, 30); // in 2026-W01
        expect(bumpVersion({major: 2025, minor: 52, patch: 1}, 'calver')).toEqual({major: 2026, minor: 1, patch: 0});
      });

      test('should count on within a week that spans the new year', () => {
        today(2027, 1, 2); // in 2026-W53
        expect(bumpVersion({major: 2026, minor: 53, patch: 0}, 'calver')).toEqual({major: 2026, minor: 53, patch: 1});
      });

      test('should number the first ISO week of a year whose 4 January is a Monday as week 1', () => {
        today(2027, 1, 4); // in 2027-W01
        expect(bumpVersion({major: 2026, minor: 53, patch: 1}, 'calver')).toEqual({major: 2027, minor: 1, patch: 0});
      });

      test('should give a milestone the ISO week-year and a marker of the calendar date', () => {
        today(2025, 12, 30); // in 2026-W01
        expect(bumpVersion({major: 2025, minor: 52, patch: 1}, 'calver-milestone'))
          .toEqual({major: 2026, minor: 1, patch: 0, marker: 'M202512301200'});
      });
    });

    test('should throw for invalid bump type', () => {
      expect(() => bumpVersion(baseVersion, 'invalid' as any)).toThrow('Invalid bump type: invalid');
    });
  });
});
