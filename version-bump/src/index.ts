import * as core from "@actions/core";
import * as github from "@actions/github";
import {bumpVersion, findMaxVersion, isBumpType, parseVersion, Version, versionToString} from "./version";

async function run() {
  try {
    const prefix = core.getInput('prefix') ?? 'v';
    const [owner, repo] = (core.getInput('repo') ?? `${github.context.repo.owner}/${github.context.repo.repo}`).split("/");
    const githubToken = core.getInput("github-token");
    const bumpType = core.getInput('bump');

    if (!isBumpType(bumpType)) {
      core.setFailed(`Invalid bump type: ${bumpType}`);
      return;
    }

    core.info(`bump '${bumpType}' is valid`);

    const octokit = github.getOctokit(githubToken);
    const tags = await octokit.paginate(octokit.rest.repos.listTags, {
      owner,
      repo,
      per_page: 100
    }, (response) => response.data.map((tagObject) => {
      const tagName = tagObject.name;
      core.debug(`read '${tagName}' tag '${tagName}'`);
      return tagName;
    }));

    const existingVersions = tags
      .filter((name) => name.startsWith(prefix))
      .map(name => name.slice(prefix.length))
      .flatMap((version) => {
        const foundVersion = parseVersion(version);
        return foundVersion ? [foundVersion] : [];
      });

    core.startGroup('tags');
    existingVersions.forEach((version) => core.info(`tag '${versionToString(version)}'`));
    core.endGroup();

    const maxExistingVersion: Version = findMaxVersion(existingVersions);

    core.setOutput('current-major', maxExistingVersion.major);
    core.setOutput('current-minor', maxExistingVersion.minor);
    core.setOutput('current-patch', maxExistingVersion.patch);
    core.setOutput('current-build', maxExistingVersion.build);
    core.setOutput('current-marker', maxExistingVersion.marker);

    const maxExistingVersionString = versionToString(maxExistingVersion);
    core.setOutput('current-version', maxExistingVersionString);
    core.setOutput('current-tag', `${prefix}${maxExistingVersionString}`);
    core.info(`current version: '${maxExistingVersionString}'`);

    const nextVersion = bumpVersion(maxExistingVersion, bumpType);

    core.setOutput('next-major', nextVersion.major);
    core.setOutput('next-minor', nextVersion.minor);
    core.setOutput('next-patch', nextVersion.patch);
    core.setOutput('next-build', nextVersion.build);
    core.setOutput('next-marker', nextVersion.marker);

    const nextVersionString = versionToString(nextVersion);
    core.setOutput('next-version', nextVersionString);
    core.setOutput('next-tag', `${prefix}${nextVersionString}`);
    core.info(`next version: '${nextVersionString}'`);
  } catch (e) {
    core.setFailed(`Error during bump version: ${e}`);
  }
}

run();
