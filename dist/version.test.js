"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("./version");
const date_utils_1 = require("./date-utils");
describe('Version Utilities', () => {
    describe('compareVersions', () => {
        test('should compare equal versions', () => {
            const a = { major: 1, minor: 2, patch: 3 };
            const b = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.compareVersions)(a, b)).toBe(0);
        });
        test('should compare major version difference', () => {
            const a = { major: 2, minor: 2, patch: 3 };
            const b = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.compareVersions)(a, b)).toBe(1);
            expect((0, version_1.compareVersions)(b, a)).toBe(-1);
        });
        test('should compare minor version difference', () => {
            const a = { major: 1, minor: 3, patch: 3 };
            const b = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.compareVersions)(a, b)).toBe(1);
            expect((0, version_1.compareVersions)(b, a)).toBe(-1);
        });
        test('should compare patch version difference', () => {
            const a = { major: 1, minor: 2, patch: 4 };
            const b = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.compareVersions)(a, b)).toBe(1);
            expect((0, version_1.compareVersions)(b, a)).toBe(-1);
        });
        test('should compare build version difference', () => {
            const a = { major: 1, minor: 2, patch: 3, build: 2 };
            const b = { major: 1, minor: 2, patch: 3, build: 1 };
            expect((0, version_1.compareVersions)(a, b)).toBe(1);
            expect((0, version_1.compareVersions)(b, a)).toBe(-1);
        });
        test('should handle undefined build', () => {
            const a = { major: 1, minor: 2, patch: 3, build: 1 };
            const b = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.compareVersions)(a, b)).toBe(1);
            expect((0, version_1.compareVersions)(b, a)).toBe(-1);
        });
        test('should compare marker difference', () => {
            const a = { major: 1, minor: 2, patch: 3, marker: 'beta' };
            const b = { major: 1, minor: 2, patch: 3, marker: 'alpha' };
            expect((0, version_1.compareVersions)(a, b)).toBe(1);
            expect((0, version_1.compareVersions)(b, a)).toBe(-1);
        });
        test('should handle undefined marker', () => {
            const a = { major: 1, minor: 2, patch: 3, marker: 'alpha' };
            const b = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.compareVersions)(a, b)).toBe(-1);
            expect((0, version_1.compareVersions)(b, a)).toBe(1);
        });
    });
    describe('findMaxVersion', () => {
        const zeroVersion = { major: 0, minor: 0, patch: 0 };
        test('should find max version', () => {
            const versions = [
                { major: 1, minor: 2, patch: 3 },
                { major: 2, minor: 0, patch: 0 },
                { major: 1, minor: 2, patch: 4 },
            ];
            const max = (0, version_1.findMaxVersion)(versions);
            expect(max).toEqual({ major: 2, minor: 0, patch: 0 });
        });
        test('should handle single version', () => {
            const versions = [{ major: 1, minor: 2, patch: 3 }];
            expect((0, version_1.findMaxVersion)(versions)).toEqual({ major: 1, minor: 2, patch: 3 });
        });
        test('should handle empty array', () => {
            expect((0, version_1.findMaxVersion)([])).toEqual(zeroVersion);
        });
        test('should handle null input', () => {
            expect((0, version_1.findMaxVersion)(null)).toEqual(zeroVersion);
        });
        test('should handle undefined input', () => {
            expect((0, version_1.findMaxVersion)(undefined)).toEqual(zeroVersion);
        });
        test('should handle versions with build and marker', () => {
            const versions = [
                { major: 1, minor: 2, patch: 3, build: 1 },
                { major: 1, minor: 2, patch: 3, marker: 'alpha' },
                { major: 1, minor: 2, patch: 3, build: 2 },
            ];
            expect((0, version_1.findMaxVersion)(versions)).toEqual({ major: 1, minor: 2, patch: 3, build: 2 });
        });
    });
    describe('parseVersion', () => {
        test('should parse basic version', () => {
            const result = (0, version_1.parseVersion)('1.2.3');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3 });
        });
        test('should parse version with build', () => {
            const result = (0, version_1.parseVersion)('1.2.3.4');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, build: 4 });
        });
        test('should parse version with marker', () => {
            const result = (0, version_1.parseVersion)('1.2.3-alpha');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, marker: 'alpha' });
        });
        test('should parse version with build and marker', () => {
            const result = (0, version_1.parseVersion)('1.2.3.4-beta');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, build: 4, marker: 'beta' });
        });
        test('should be undefined for invalid version string', () => {
            expect((0, version_1.parseVersion)('invalid')).toBeUndefined();
            expect((0, version_1.parseVersion)('1.2')).toBeUndefined();
            expect((0, version_1.parseVersion)('1.2.3_4')).toBeUndefined();
        });
    });
    describe('versionToString', () => {
        test('should convert basic version to string', () => {
            const version = { major: 1, minor: 2, patch: 3 };
            expect((0, version_1.versionToString)(version)).toBe('1.2.3');
        });
        test('should convert version with build to string', () => {
            const version = { major: 1, minor: 2, patch: 3, build: 4 };
            expect((0, version_1.versionToString)(version)).toBe('1.2.3.4');
        });
        test('should convert version with marker to string', () => {
            const version = { major: 1, minor: 2, patch: 3, marker: 'alpha' };
            expect((0, version_1.versionToString)(version)).toBe('1.2.3-alpha');
        });
        test('should convert version with build and marker to string', () => {
            const version = { major: 1, minor: 2, patch: 3, build: 4, marker: 'beta' };
            expect((0, version_1.versionToString)(version)).toBe('1.2.3.4-beta');
        });
    });
    describe('bumpVersion', () => {
        const simpleBaseVersion = { major: 1, minor: 2, patch: 3 };
        const baseVersion = { major: 1, minor: 2, patch: 3, build: 4, marker: 'alpha' };
        test('should bump major simple version', () => {
            const result = (0, version_1.bumpVersion)(simpleBaseVersion, 'major');
            expect(result).toEqual({ major: 2, minor: 0, patch: 0 });
        });
        test('should bump major version', () => {
            const result = (0, version_1.bumpVersion)(baseVersion, 'major');
            expect(result).toEqual({ major: 2, minor: 0, patch: 0, build: 0 });
        });
        test('should bump minor simple version', () => {
            const result = (0, version_1.bumpVersion)(simpleBaseVersion, 'minor');
            expect(result).toEqual({ major: 1, minor: 3, patch: 0 });
        });
        test('should bump minor version', () => {
            const result = (0, version_1.bumpVersion)(baseVersion, 'minor');
            expect(result).toEqual({ major: 1, minor: 3, patch: 0, build: 0 });
        });
        test('should bump patch simple version', () => {
            const result = (0, version_1.bumpVersion)(simpleBaseVersion, 'patch');
            expect(result).toEqual({ major: 1, minor: 2, patch: 4 });
        });
        test('should bump patch version', () => {
            const result = (0, version_1.bumpVersion)(baseVersion, 'patch');
            expect(result).toEqual({ major: 1, minor: 2, patch: 4, build: 0 });
        });
        test('should bump build version', () => {
            const result = (0, version_1.bumpVersion)(baseVersion, 'build');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, build: 5 });
        });
        test('should bump build version from undefined', () => {
            const version = { major: 1, minor: 2, patch: 3 };
            const result = (0, version_1.bumpVersion)(version, 'build');
            expect(result).toEqual({ major: 1, minor: 2, patch: 3, build: 1 });
        });
        test('should bump calver', () => {
            const result = (0, version_1.bumpVersion)(baseVersion, 'calver');
            const date = new Date();
            expect(result.major).toEqual(date.getFullYear());
            expect(result.minor).toEqual((0, date_utils_1.getISOWeek)(date));
            expect(result.patch).toEqual(0);
        });
        test('should bump calver-milestone', () => {
            const result = (0, version_1.bumpVersion)(baseVersion, 'calver-milestone');
            const date = new Date();
            expect(result.major).toEqual(date.getFullYear());
            expect(result.minor).toEqual((0, date_utils_1.getISOWeek)(date));
            expect(result.patch).toEqual(0);
            expect(result.build).toBeUndefined();
            expect(result.marker).toMatch(/M(\d{12})/);
        });
        test('should throw for invalid bump type', () => {
            expect(() => (0, version_1.bumpVersion)(baseVersion, 'invalid')).toThrow('Invalid bump type: invalid');
        });
    });
});
