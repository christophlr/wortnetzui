import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const packageJsonFile = path.join(rootDir, 'package.json');
const packageLockFile = path.join(rootDir, 'package-lock.json');

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

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
const version = getVersionFromGitCount(packageJson.version ?? '0.0');
if (packageJson.version !== version) {
  packageJson.version = version;
  writeJson(packageJsonFile, packageJson);
  console.log(`Updated package.json version to ${version}`);
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