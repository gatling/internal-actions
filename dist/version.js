"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBumpType = isBumpType;
exports.compareVersions = compareVersions;
exports.findMaxVersion = findMaxVersion;
exports.parseVersion = parseVersion;
exports.versionToString = versionToString;
exports.bumpVersion = bumpVersion;
const date_utils_1 = require("./date-utils");
const validBumpTypes = [
    'major',
    'minor',
    'patch',
    'build',
    'calver',
];
function isBumpType(input) {
    const base = input.endsWith('-milestone') ? input.slice(0, -'-milestone'.length) : input;
    return validBumpTypes.includes(base);
}
function compareVersions(a, b) {
    if (a.major !== b.major)
        return a.major - b.major;
    if (a.minor !== b.minor)
        return a.minor - b.minor;
    if (a.patch !== b.patch)
        return a.patch - b.patch;
    if (a.build !== undefined && b.build !== undefined && a.build !== b.build) {
        return (a.build ?? 0) - (b.build ?? 0);
    }
    if (a.build !== undefined && b.build === undefined)
        return 1;
    if (b.build !== undefined && a.build === undefined)
        return -1;
    if (a.marker && b.marker)
        return a.marker.localeCompare(b.marker);
    if (a.marker)
        return -1;
    if (b.marker)
        return 1;
    return 0;
}
function findMaxVersion(versions) {
    if (!versions || versions.length === 0)
        return { major: 0, minor: 0, patch: 0 };
    return versions.reduce((max, current) => compareVersions(max, current) >= 0 ? max : current);
}
function parseVersion(versionStr) {
    const regex = /^(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?(?:-([a-zA-Z0-9-]+))?$/;
    const match = versionStr.match(regex);
    if (!match) {
        return undefined;
    }
    const [, major, minor, patch, build, marker] = match;
    return {
        major: parseInt(major, 10),
        minor: parseInt(minor, 10),
        patch: parseInt(patch, 10),
        ...(build && { build: parseInt(build, 10) }),
        ...(marker && { marker }),
    };
}
function versionToString(version) {
    let result = `${version.major}.${version.minor}.${version.patch}`;
    if (version.build !== undefined)
        result += `.${version.build}`;
    if (version.marker)
        result += `-${version.marker}`;
    return result;
}
function bumpVersion(version, bumpType) {
    const isMilestone = bumpType.endsWith('-milestone');
    const baseType = (isMilestone ? bumpType.slice(0, -'-milestone'.length) : bumpType);
    const date = new Date();
    let bumped;
    switch (baseType) {
        case 'major':
            bumped = {
                major: version.major + 1,
                minor: 0,
                patch: 0,
                ...(version.build !== undefined ? { build: 0 } : {}),
            };
            break;
        case 'minor':
            bumped = {
                major: version.major,
                minor: version.minor + 1,
                patch: 0,
                ...(version.build !== undefined ? { build: 0 } : {}),
            };
            break;
        case 'patch':
            bumped = {
                major: version.major,
                minor: version.minor,
                patch: version.patch + 1,
                ...(version.build !== undefined ? { build: 0 } : {}),
            };
            break;
        case 'build':
            bumped = {
                major: version.major,
                minor: version.minor,
                patch: version.patch,
                build: (version.build ?? 0) + 1,
            };
            break;
        case 'calver':
            const major = date.getFullYear();
            const minor = (0, date_utils_1.getISOWeek)(date);
            const patch = (version.major === major && version.minor === minor) ? (version.marker ? version.patch : version.patch + 1) : 0;
            bumped = { major, minor, patch };
            break;
        default:
            throw new Error(`Invalid bump type: ${bumpType}`);
    }
    return isMilestone ? { ...bumped, marker: 'M' + (0, date_utils_1.formatDateToYYYYMMDDHHmm)(date) } : bumped;
}
