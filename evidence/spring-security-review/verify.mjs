// Compiles each case against the libraries Spring Boot 3.5.16 manages and checks
// that javac reports what the review on the site claims.
//
//   node evidence/spring-security-review/verify.mjs
//
// Needs a JDK 17+ `javac` on PATH. Jars are downloaded once from Maven Central into
// .cache/ and checked against the SHA-256 hashes pinned below.

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, '.cache');
const mavenCentral = 'https://repo1.maven.org/maven2';

// Versions managed by spring-boot-dependencies 3.5.16.
const jars = [
  ['org.springframework.security', 'spring-security-config', '6.5.11', '218685930013a2d1c126a896490ac3c44cf6fe90cf3d0286f2266bb877f916f7'],
  ['org.springframework.security', 'spring-security-web', '6.5.11', '50df9fc76162d33cf8b5410cf7a7a969abd42a5ecddb284aab4f453cb5512306'],
  ['org.springframework.security', 'spring-security-core', '6.5.11', '26ac26527cc015c5c71f3832add705a2410129a8f8de847054f2bc3b1d2e4465'],
  ['org.springframework', 'spring-context', '6.2.19', 'ead4b645f94a7f665f00093eaafde634e97b34524294de653b51e43e0b3fc4a4'],
  ['org.springframework', 'spring-beans', '6.2.19', '846dc8f30a639a36eb551ee99a30469be4d11bd285ca9daf164d98321571b404'],
  ['org.springframework', 'spring-core', '6.2.19', '52146689e71a911c92bac26677d73c692512a739893a57710cc233591756bff6'],
  ['org.springframework', 'spring-web', '6.2.19', 'ca88e364ecebee61163e2260e8a20584138eca74e28a050d6a2ef6302bad2f2d'],
  ['jakarta.servlet', 'jakarta.servlet-api', '6.0.0', 'c034eb1afb158987dbb53a5fea0cadf611c8dae8daadd59c44d9d5ab70129cef'],
];

// What the review claims about each case. `compiles` is the expected javac outcome;
// every pattern must appear in the compiler output; `noWarnings` means none at all.
const cases = [
  {
    name: 'answer',
    claim: 'The model answer does not compile on Spring Boot 3: 6 errors from 3 root causes.',
    compiles: false,
    // The rubric's "6 errors, 3 root causes": javax.servlet (the import and the
    // HttpServletResponse use), the removed adapter (its import, `extends` and the
    // @Override that no longer overrides anything) and antMatchers.
    errors: 6,
    expect: [
      /package javax\.servlet\.http does not exist/, // issue 1
      /symbol:\s+variable HttpServletResponse/, // issue 1, follow-on
      /symbol:\s+class WebSecurityConfigurerAdapter/, // issue 2
      /method does not override or implement a method from a supertype/, // issue 2, follow-on
      /\[removal\] authorizeRequests\(\) in HttpSecurity/, // issue 3
      /symbol:\s+method antMatchers\(String\)/, // issue 4
    ],
  },
  {
    name: 'reviewed',
    claim: 'The corrected version compiles with no warnings under -Xlint:all.',
    compiles: true,
    noWarnings: true,
    expect: [],
  },
  {
    name: 'olddsl',
    claim: 'The pre-lambda DSL compiles but is marked for removal (issue 3).',
    compiles: true,
    expect: [/\[removal\] authorizeRequests\(\) in HttpSecurity/, /\[removal\] exceptionHandling\(\) in HttpSecurity/],
  },
  {
    name: 'antmatchers',
    claim: 'antMatchers no longer exists, even in the lambda DSL (issue 4).',
    compiles: false,
    expect: [/symbol:\s+method antMatchers\(String\)/],
  },
];

async function ensureJar([group, artifact, version, sha256]) {
  const file = join(cacheDir, `${artifact}-${version}.jar`);
  if (!existsSync(file)) {
    const url = `${mavenCentral}/${group.replaceAll('.', '/')}/${artifact}/${version}/${artifact}-${version}.jar`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
    writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }
  const actual = createHash('sha256').update(readFileSync(file)).digest('hex');
  if (actual !== sha256) {
    rmSync(file);
    throw new Error(`SHA-256 mismatch for ${artifact}-${version}.jar: expected ${sha256}, got ${actual}`);
  }
  return file;
}

function compile(caseName, classpath) {
  const outDir = mkdtempSync(join(tmpdir(), `review-${caseName}-`));
  try {
    const result = spawnSync(
      'javac',
      ['-J-Duser.language=en', '-Xlint:all', '-proc:none', '-d', outDir, '-cp', classpath, join(here, 'cases', caseName, 'SecurityConfig.java')],
      { encoding: 'utf8' },
    );
    if (result.error) throw new Error(`Could not run javac: ${result.error.message}. Is a JDK 17+ on PATH?`);
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

mkdirSync(cacheDir, { recursive: true });
const classpath = (await Promise.all(jars.map(ensureJar))).join(delimiter);

let failures = 0;
for (const c of cases) {
  const { status, output } = compile(c.name, classpath);
  const problems = [];
  if ((status === 0) !== c.compiles) problems.push(c.compiles ? 'expected it to compile, it failed' : 'expected a compile error, it compiled');
  if (c.noWarnings && /warning:/.test(output)) problems.push('expected no warnings');
  const errorCount = (output.match(/: error: /g) ?? []).length;
  if (c.errors !== undefined && errorCount !== c.errors) problems.push(`expected ${c.errors} errors, javac reported ${errorCount}`);
  for (const pattern of c.expect) if (!pattern.test(output)) problems.push(`missing ${pattern}`);

  console.log(`${problems.length ? 'FAIL' : 'ok  '}  ${c.name.padEnd(12)} ${c.claim}`);
  if (problems.length) {
    failures += 1;
    for (const p of problems) console.log(`        ${p}`);
    console.log(output.replace(/^/gm, '        | '));
  }
}

if (failures) {
  console.error(`\n${failures} of ${cases.length} claims did not hold.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} claims hold (Spring Security 6.5.11, Spring Framework 6.2.19, Jakarta Servlet 6.0.0).`);
