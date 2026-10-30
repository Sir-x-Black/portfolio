import type { YearMonth } from './types';

/**
 * Language-neutral facts, defined once so the English and Spanish pages can't
 * disagree. Every value comes from the résumé or from a public page.
 */
export const facts = {
  name: {
    display: 'Gonzalo Palavesino',
    full: 'Gonzalo Gabriel Palavesino',
    given: 'Gonzalo',
    family: 'Palavesino',
  },
  email: 'gg.palavesino@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/gonzalo-gabriel-palavesino',
    github: 'https://github.com/Sir-x-Black',
    projectDuckStore: 'https://play.google.com/store/apps/details?id=com.blackcorp.project.duck',
    projectDuckSite: 'https://sir-x-black.github.io/',
    /** Public repository of this site. Null hides the links to it. */
    source: 'https://github.com/Sir-x-Black/portfolio' as string | null,
  },
  location: {
    city: 'Mendoza',
    country: 'Argentina',
    countryCode: 'AR',
  },
  employer: 'NTT DATA Europe & LATAM',
  roles: {
    ntt: { start: { year: 2021, month: 11 }, end: null },
    cumbresoft: { start: { year: 2020, month: 5 }, end: { year: 2021, month: 11 } },
    municipality: { start: { year: 2019, month: 12 }, end: { year: 2020, month: 2 } },
  } satisfies Record<string, { start: YearMonth; end: YearMonth | null }>,
} as const;

/** Official documentation cited by the review example. All checked to resolve. */
export const docs = {
  bootMigration: 'https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide',
  noAdapter: 'https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter',
  authorizeHttpRequests: 'https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html',
  oracleMerge: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/MERGE.html',
  oracleTemporaryTables: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/admin/managing-tables.html',
} as const;
