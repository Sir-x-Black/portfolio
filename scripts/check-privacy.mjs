// Fails the build if private data would be published: in the built site (dist/)
// or in any file the repository would commit. Usage: node scripts/check-privacy.mjs dist

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { DENYLIST_FILE, loadDenylist, scanText } from './privacy-rules.mjs';

const dist = process.argv[2] ?? 'dist';
const FORBIDDEN_FILES = [/^\.env/, /\.pem$/, /\.key$/, /\.p12$/, /\.keystore$/, /\.jks$/, /\.pdf$/i, /\.docx?$/i];
const KIND_BY_EXTENSION = {
  '.html': 'html',
  '.txt': 'text',
  '.xml': 'text',
  '.js': 'code',
  '.mjs': 'code',
  '.css': 'code',
  '.json': 'code',
  '.svg': 'code',
  '.map': 'code',
  '.webmanifest': 'code',
};
const REPO_TEXT = /\.(md|txt|ts|tsx|js|mjs|cjs|json|css|html|yml|yaml|java|svg|xml)$|^\.[\w-]+$|(^|\/)_headers$/i;
const REPO_SKIP = new Set(['package-lock.json']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

/** Files git would commit: tracked plus untracked-but-not-ignored. */
function repositoryFiles() {
  const git = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' });
  if (git.status !== 0) return null;
  return git.stdout.split('\n').filter(Boolean);
}

const denylist = loadDenylist();
const problems = [];
const forbidden = (name) => FORBIDDEN_FILES.some((pattern) => pattern.test(name.split('/').pop() ?? name));

let builtFiles = 0;
for (const file of walk(dist)) {
  const name = relative(dist, file).replaceAll('\\', '/');
  if (forbidden(name)) {
    problems.push(`dist/${name}: file type must not be deployed`);
    continue;
  }
  const kind = KIND_BY_EXTENSION[extname(file).toLowerCase()];
  if (!kind) continue;
  builtFiles += 1;
  for (const finding of scanText(readFileSync(file, 'utf8'), { kind, denylist })) problems.push(`dist/${name}: ${finding}`);
}

const repoFiles = repositoryFiles();
let scannedRepo = 0;
for (const name of repoFiles ?? []) {
  if (forbidden(name)) problems.push(`${name}: file type must not be committed`);
  if (REPO_SKIP.has(name) || !REPO_TEXT.test(name) || !existsSync(name)) continue;
  scannedRepo += 1;
  for (const finding of scanText(readFileSync(name, 'utf8'), { kind: 'repo', denylist })) problems.push(`${name}: ${finding}`);
}

const denylistNote = denylist.length
  ? `${denylist.length} private denylist entries from ${DENYLIST_FILE}`
  : `generic rules only (no ${DENYLIST_FILE} on this machine)`;
const repoNote = repoFiles ? `${scannedRepo} repository files` : 'repository files skipped (git not available)';

if (problems.length) {
  console.error(`Privacy check failed (${builtFiles} built files, ${repoNote}, ${denylistNote}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`Privacy check passed: ${builtFiles} built files, ${repoNote}, ${denylistNote}.`);
