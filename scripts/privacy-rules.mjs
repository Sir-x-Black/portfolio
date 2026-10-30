// Rules for what must never be published. Used by scripts/check-privacy.mjs, which
// runs at the end of every build on dist/ and on every file the repository would
// commit, and by tests/privacy.test.ts and tests/render.test.ts.
//
// Private values themselves are NOT stored here. A phone number has so little
// entropy that even a hash of it can be brute-forced, so the exact strings live
// in notes/private-denylist.txt, which is git-ignored and only exists locally.
// The generic rules below are what CI enforces.

import { existsSync, readFileSync } from 'node:fs';

export const ALLOWED_EMAILS = new Set(['gg.palavesino@gmail.com']);

export const DENYLIST_FILE = 'notes/private-denylist.txt';

const SECRET_PATTERNS = [
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Stripe secret key', /\b(sk|rk)_live_[0-9A-Za-z]{16,}/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  [
    'secret-looking assignment',
    /\b(api[_-]?key|apikey|secret|client[_-]?secret|password|passwd|access[_-]?key|auth[_-]?token|token)["']?\s*[:=]\s*["'][^"'\s]{8,}["']/i,
  ],
];

// Applied to the visible text and attribute values of HTML, and to plain text files.
const TEXT_RULES = [
  ['tel: link', /\btel:/i],
  ['phone keyword followed by a number', /\b(tel[eé]fono|telefono|phone|tel|celular|cel|cell|mobile|m[oó]vil|movil|whatsapp)\b\W{0,3}\+?\(?\d/i],
  ['street address word', /\b(calle|avenida|barrio|manzana|boulevard|bulevar)\b/i],
  ['street abbreviation (Av., Bv., Mza.)', /\b([Aa]v|[Aa]vda|[Bb]v|[Bb]var|[Bb]lvd|[Mm]za|[Mm]z)\.\s*[A-ZÁÉÍÓÚÑ0-9]/],
  ['house or flat number (Casa 12, Dpto 3)', /\b(casa|lote|dpto|depto|departamento)\s*\d/i],
  ['block/house shorthand (X:Y Z:00 style)', /\b[MC]:\s?[A-Z0-9]{1,3}\b/],
  [
    'street address in English',
    /\b\d{1,5}\s+(?:[A-Z][a-z]+\s+){1,3}(?:[Ss]treet|[Ss]t\.|[Aa]venue|[Aa]ve\.|[Rr]oad|[Rr]d\.|[Ll]ane|[Dd]rive|[Bb]oulevard)\b/,
  ],
  ['national ID keyword', /\b(DNI|CUIL|CUIT|pasaporte|passport)\b/i],
  ['national ID number format', /\b\d{2}\.\d{3}\.\d{3}\b/],
];

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

// A run of digits with phone-style separators, optionally starting with + or (.
const PHONE_CANDIDATE = /(?<![\w.])\+?\(?\+?\d[\d\s().-]{5,}\d(?![\w.])/g;
const YEAR = /^(19|20)\d\d$/;

/** Literal strings from the local, git-ignored denylist (one per line, # for comments). */
export function loadDenylist(file = DENYLIST_FILE) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

/** Visible text and attribute values of an HTML document, without scripts, styles or SVG geometry. */
export function htmlText(html) {
  const attributes = [...html.matchAll(/\s(?:href|content|alt|title|aria-label|value|data-[\w-]+)\s*=\s*"([^"]*)"/g)].map((m) => m[1]);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const text = html
    .replace(/<!--[\s\S]*?-->/g, '') // React's text separators would otherwise split phrases
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|\u00a0/g, ' ')
    .replace(/&amp;/g, '&');
  // " | " between sources, so digits from different attributes never join into one number.
  return [text, ...attributes, ...jsonLd].join(' | ');
}

/** Digit strings of every phone-like run, ignoring runs that are only a list of years. */
function phoneDigits(text) {
  const runs = [];
  for (const [candidate] of text.matchAll(PHONE_CANDIDATE)) {
    const groups = candidate.split(/[^\d]+/).filter(Boolean);
    if (groups.every((group) => YEAR.test(group))) continue;
    runs.push(groups.join(''));
  }
  return runs;
}

const collapse = (text) => text.replace(/\s+/g, ' ').toLowerCase();

/**
 * Findings for one file's text. `kind` decides which rules apply:
 *   'html'  published documents: visible text and attributes get every rule
 *   'text'  published plain text (robots.txt, sitemap): every rule
 *   'code'  published scripts, styles and data: secrets, emails, tel: strings
 *   'repo'  files the repository would commit: secrets, emails and the private
 *           denylist only, since docs and these rules legitimately mention
 *           phones and addresses
 * The private denylist, secrets and emails apply to every kind.
 */
export function scanText(source, { kind = 'code', denylist = [] } = {}) {
  const findings = [];
  const readable = kind === 'html' ? htmlText(source) : source;
  const flat = collapse(readable);
  const runs = phoneDigits(readable);

  denylist.forEach((entry, index) => {
    const digits = entry.replace(/\D/g, '');
    const numeric = /^[\d\s().+-]+$/.test(entry) && digits.length >= 6;
    const hit = numeric ? runs.some((run) => run.includes(digits)) || flat.includes(entry.toLowerCase()) : flat.includes(collapse(entry));
    if (hit) findings.push(`matches private denylist entry #${index + 1}`);
  });

  for (const [label, pattern] of SECRET_PATTERNS) if (pattern.test(source)) findings.push(label);

  for (const match of source.matchAll(EMAIL)) {
    const email = match[0].toLowerCase();
    if (!ALLOWED_EMAILS.has(email)) findings.push(`unexpected email address ${email}`);
  }

  if (kind === 'repo') return [...new Set(findings)];
  if (kind === 'code') {
    if (/["'`]tel:/i.test(source)) findings.push('tel: link');
    return [...new Set(findings)];
  }

  for (const [label, pattern] of TEXT_RULES) {
    const match = readable.match(pattern);
    if (match) findings.push(`${label}: "${match[0].trim().slice(0, 40)}"`);
  }
  for (const run of runs) {
    if (run.length >= 8 && run.length <= 15) findings.push(`phone-like number (${run.length} digits)`);
  }
  return [...new Set(findings)];
}
