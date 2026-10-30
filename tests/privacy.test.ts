import { describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ES module shared with the build scripts
import { scanText } from '../scripts/privacy-rules.mjs';

type Kind = 'html' | 'text' | 'code' | 'repo';
const scan = (source: string, kind: Kind, denylist: string[] = []): string[] => scanText(source, { kind, denylist });

// Every value below is invented. Real private values live only in the git-ignored
// notes/private-denylist.txt. Secret-shaped samples are assembled at run time, so
// the literal patterns never sit in the repository, where this project's own
// check and GitHub's push protection would rightly reject them.
const join = (...parts: string[]) => parts.join('');

describe('privacy rules catch', () => {
  it.each([
    ['a tel: link', '<a href="tel:351-123-4567">Call</a>'],
    ['an Argentine mobile with country code', '<p>+54 9 261 555 1234</p>'],
    ['a bracketed country code', '<p>(+54) 9 261 555-1234</p>'],
    ['a US number', '<p>+1 415 555 2671</p>'],
    ['a local number with spaces', '<p>261 555 1234</p>'],
    ['a phone label', '<p>Tel: 4123-4567</p>'],
    ['a mobile label', '<p>Mobile: 555 0199</p>'],
    ['a number hidden in a data attribute', '<button data-copy="+54 261 555 1234">Copy</button>'],
    ['an avenue', '<p>Av. San Martín 1234</p>'],
    ['a boulevard', '<p>Bv. Sarmiento 500</p>'],
    ['block and house words', '<p>Mza. J Casa 52</p>'],
    ['block and house shorthand', '<p>M:Q C:77</p>'],
    ['a street word', '<p>Calle Falsa 123</p>'],
    ['an English street address', '<p>12 Main Street</p>'],
    ['an ID keyword', '<p>DNI 30.123.456</p>'],
    ['an ID number format', '<p>30.123.456</p>'],
    ['an unexpected email', join('<p>someone', '@', 'example.com</p>')],
  ])('%s', (_label, html) => {
    expect(scan(html, 'html')).not.toEqual([]);
  });

  it.each([
    ['an API key in JSON', join('{"api', 'Key":"abcd1234efgh5678"}')],
    ['a fine-grained GitHub token', join('github', '_pat_', '11ABCDEFG0123456789_abcdefghijklmnopqrstuv')],
    ['a Google API key', join('AI', 'za', 'SyA-1234567890abcdefghijklmnopqrstu')],
    ['a private key block', join('-----BEGIN RSA ', 'PRIVATE KEY-----')],
    ['a tel: string in a script', 'location.href = "tel:3515551234"'],
  ])('%s in code', (_label, code) => {
    expect(scan(code, 'code')).not.toEqual([]);
  });

  it('a denylisted number in another format', () => {
    expect(scan('<p>261 555 1234</p>', 'html', ['2615551234'])).toContain('matches private denylist entry #1');
  });

  it('a denylisted phrase split by React text separators', () => {
    expect(scan('<p>Street 1<!-- -->, <!-- -->Mendoza</p>', 'html', ['Street 1, Mendoza'])).toContain('matches private denylist entry #1');
  });

  it('a denylisted value in a committed file, such as an example in a rule label', () => {
    expect(scan("['block/house shorthand (M:Q C:77 style)', /x/]", 'repo', ['M:Q', 'C:77'])).toEqual([
      'matches private denylist entry #1',
      'matches private denylist entry #2',
    ]);
  });
});

describe('privacy rules leave alone', () => {
  it.each([
    ['dates', '<p>Nov 2021 – present</p>'],
    ['a list of years', '<span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span>'],
    ['counts in both languages', '<p>More than 13,000 records</p><p>Más de 13.000 registros</p>'],
    ['version numbers', '<p>Spring Boot 3.5.16 (Spring Security 6.5.11)</p>'],
    ['a time zone and a status code', '<p>UTC−3. Respond 401.</p>'],
    ['the published email', '<a href="mailto:gg.palavesino@gmail.com">gg.palavesino@gmail.com</a>'],
    ['image dimensions in separate tags', '<meta content="1200" /><meta content="630" />'],
    ['code line numbers', '<span>10</span><span>3</span>.authorizeHttpRequests(auth -&gt; auth<span>11</span><span>4</span>'],
  ])('%s', (_label, html) => {
    expect(scan(html, 'html')).toEqual([]);
  });

  it('docs that talk about phones and addresses, in repository mode', () => {
    expect(scan('Generic rules catch `tel:` links, street addresses and DNI numbers.', 'repo')).toEqual([]);
  });
});
