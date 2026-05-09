import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const packageJsonFile = path.join(rootDir, 'package.json');
const packageLockFile = path.join(rootDir, 'package-lock.json');
const buildStateFile = path.join(rootDir, '.version-build-state.json');
const shouldWriteBuildState = process.argv.includes('--build');

function getVersionFromGitCount(fallbackVersion) {
  try {
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    if (/^\d+$/.test(commitCount)) {
      return `0.${commitCount}`;
    }
  } catch {
    // Keep fallback for environments where git metadata is unavailable.
  }
  return fallbackVersion;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function getBuildNumber(version) {
  if (!shouldWriteBuildState) {
    const existingState = readJson(buildStateFile);
    if (existingState?.version === version && Number.isInteger(existingState.buildCount) && existingState.buildCount > 0) {
      return `${version}.${existingState.buildCount}`;
    }
    return `${version}.1`;
  }

  const existingState = readJson(buildStateFile);
  const nextBuildCount = existingState?.version === version && Number.isInteger(existingState.buildCount) && existingState.buildCount > 0
    ? existingState.buildCount + 1
    : 1;
  const nextState = { version, buildCount: nextBuildCount };
  fs.writeFileSync(buildStateFile, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');
  return `${version}.${nextBuildCount}`;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
const version = getVersionFromGitCount(packageJson.version ?? '0.0');
const buildNumber = getBuildNumber(version);
if (packageJson.version !== version) {
  packageJson.version = version;
  writeJson(packageJsonFile, packageJson);
  console.log(`Updated package.json version to ${version}`);
}

if (shouldWriteBuildState) {
  console.log(`Updated build number to ${buildNumber}`);
}

if (fs.existsSync(packageLockFile)) {
  const packageLock = JSON.parse(fs.readFileSync(packageLockFile, 'utf8'));
  let changed = false;

  if (packageLock.version !== version) {
    packageLock.version = version;
    changed = true;
  }

  if (packageLock.packages?.['']?.version !== version) {
    packageLock.packages[''].version = version;
    changed = true;
  }

  if (changed) {
    writeJson(packageLockFile, packageLock);
    console.log(`Updated package-lock.json version to ${version}`);
  }
}