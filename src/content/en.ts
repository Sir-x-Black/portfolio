import { docs, facts } from './facts';
import type { SiteContent } from './types';

const { roles } = facts;

export const en: SiteContent = {
  locale: 'en',
  meta: {
    title: 'Gonzalo Palavesino | Software engineer (Java, Spring Boot, Oracle SQL)',
    description:
      'Java software engineer (Spring Boot, Oracle SQL) with six years in production, open to AI training, code evaluation and Spanish-language AI work.',
    ogImageAlt: 'Gonzalo Palavesino, software engineer. A line of Java code circled in red by a reviewer.',
    cvTitle: 'Résumé | Gonzalo Palavesino',
    cvDescription: 'Résumé of Gonzalo Palavesino, software engineer: Java, Spring Boot, Oracle SQL and PL/SQL, OpenShift.',
    notFoundTitle: 'Page not found | Gonzalo Palavesino',
  },
  ui: {
    skipToContent: 'Skip to content',
    primaryNav: 'Sections',
    nav: { aiFit: 'AI training', experience: 'Experience', work: 'Selected work', contact: 'Contact' },
    cvLink: 'Résumé',
    otherLanguage: { label: 'Leer en español', name: 'Español' },
    yes: 'Yes',
    no: 'No',
    present: 'present',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  hero: {
    name: facts.name.display,
    role: 'Software engineer. Java, Spring Boot, Oracle SQL.',
    thesis: 'I find what’s wrong in code and write down why.',
    intro:
      'At NTT DATA I lead technical development on a digital-government platform: more than 10 Spring Boot microservices, Oracle data changes in production, the Java 17 and Spring Boot 3 migration, incident analysis and code reviews. I’m looking for AI training and evaluation work that asks for the same habits: read an answer closely, find what’s wrong, and explain it so it can be fixed.',
    actions: { email: 'Email me', cv: 'Read the résumé', linkedin: 'LinkedIn', github: 'GitHub' },
    factsLabel: 'At a glance',
    facts: [
      'Software Engineer at NTT DATA since November 2021.',
      'Mendoza, Argentina (UTC−3).',
      'Spanish: native. English: upper-intermediate (B2), with advanced reading and writing.',
    ],
  },
  review: {
    title: 'A plausible AI answer, reviewed',
    disclaimer:
      'A constructed example: I wrote it to show how I review code. It doesn’t come from a client or from an AI-training project.',
    promptLabel: 'Prompt',
    prompt:
      'Spring Boot 3 app. Leave `/api/public/**` open, require authentication everywhere else, and respond 401 instead of redirecting to a login page.',
    viewLegend: 'Show',
    views: { answer: 'Model answer', reviewed: 'After review' },
    codeLabel: 'Code of the model answer and its corrected version',
    excerptNote: 'Excerpt: package and Spring imports omitted.',
    notesTitle: 'Review notes',
    sourcePrefix: 'Source:',
    issues: [
      {
        id: 1,
        title: '`javax.servlet` doesn’t exist in Spring Boot 3',
        body: 'Spring Boot 3 moved to Jakarta EE, so servlet classes live in `jakarta.servlet`. The import fails, and so does every use of `HttpServletResponse`.',
        source: { label: 'Spring Boot 3.0 migration guide', href: docs.bootMigration },
      },
      {
        id: 2,
        title: '`WebSecurityConfigurerAdapter` was removed',
        body: 'Spring Security 6 dropped the adapter, and the `configure` override goes with it. Security is now a `SecurityFilterChain` bean.',
        source: { label: 'Spring blog, configuring security without the adapter', href: docs.noAdapter },
      },
      {
        id: 3,
        title: '`authorizeRequests()` and `exceptionHandling()` are marked for removal',
        body: 'Both no-argument forms are deprecated for removal. The lambda versions, `authorizeHttpRequests(…)` and `exceptionHandling(…)`, replace them and make the `.and()` chaining unnecessary.',
        source: { label: 'Spring Security reference, authorize HTTP requests', href: docs.authorizeHttpRequests },
      },
      {
        id: 4,
        title: '`antMatchers` is gone',
        body: 'Removed in Spring Security 6. `requestMatchers` replaces it and takes the same path patterns.',
        source: { label: 'Spring Security reference, authorize HTTP requests', href: docs.authorizeHttpRequests },
      },
    ],
    rubricTitle: 'Rubric',
    rubric: [
      { label: 'Does what the prompt asks', answer: { pass: true }, reviewed: { pass: true } },
      {
        label: 'Compiles on Spring Boot 3',
        answer: { pass: false, detail: '6 errors, 3 root causes' },
        reviewed: { pass: true, detail: 'no warnings' },
      },
      {
        label: 'Uses current Spring Security APIs',
        answer: { pass: false, detail: '4 issues' },
        reviewed: { pass: true },
      },
    ],
    verdictLabel: 'Verdict',
    verdict: {
      answer: 'Right intent, outdated API. It’s written in the Spring Security 5 style and doesn’t compile on Spring Boot 3.',
      reviewed:
        'Same behavior on the current API: `/api/public/**` stays open, everything else needs authentication, and unauthenticated requests get a 401.',
    },
    verification:
      'Both versions were compiled with `javac -Xlint:all` against Spring Boot 3.5.16’s libraries (Spring Security 6.5.11) to confirm this verdict.',
    evidenceLink: 'Run the compile check yourself.',
  },
  aiFit: {
    heading: 'Where my work meets AI training',
    intro:
      'AI training platforms describe the work as rating and ranking answers, writing grading rubrics, and writing prompts that make models fail. ==I haven’t worked on an AI training project yet.== This is the part of my software work that transfers, and where it comes from.',
    columns: { task: 'Task', needs: 'What it takes', evidence: 'Closest experience' },
    rows: [
      {
        task: 'Rate and rank code answers',
        needs: 'Seeing when plausible code is wrong, and saying which answer is better and why.',
        evidence:
          'Code reviews as my team’s technical point of reference. Leading the Java 17 and Spring Boot 3 migration taught me which APIs changed, a common place for generated code to go wrong.',
      },
      {
        task: 'Write grading rubrics',
        needs: 'Turning “good” into explicit checks that two reviewers would apply the same way.',
        evidence: 'Security checkpoints and assessments for production releases. Test execution tracked across 31 business processes.',
      },
      {
        task: 'Write prompts that make models fail',
        needs: 'Knowing a domain well enough to ask what a confident answer will get wrong.',
        evidence:
          'Six years of Java and SQL in production. I’m an active user of AI coding tools and helped bring Claude Code into my team’s workflow.',
      },
      {
        task: 'Explain errors and write corrections',
        needs: 'Pinning down the cause and writing it up so someone else can act on it.',
        evidence:
          'Production incidents traced to code, data or configuration with Kibana and Dynatrace. Technical, architecture and security documentation for releases.',
      },
      {
        task: 'Review Spanish-language answers',
        needs: 'Native-speaker judgment of grammar, tone and regional usage.',
        evidence: 'Native Spanish speaker from Argentina. At NTT DATA, and before that at the Municipality of Mendoza, I’ve worked on Spanish-language public-sector software.',
      },
    ],
    notes: [
      {
        kind: 'claim',
        lead: 'What I’m not claiming.',
        body: 'Experience on AI training projects, or in machine-learning engineering. What I bring is six years of building production software and, since 2021, reviewing, verifying and documenting it at NTT DATA.',
        anchor: 'I haven’t worked on an AI training project yet.',
      },
      {
        kind: 'gloss',
        lead: 'Coding domains.',
        body: 'Java (8 to 21), Spring Boot, SQL and PL/SQL on Oracle, TypeScript with Angular.',
      },
    ],
  },
  experience: {
    heading: 'Experience',
    timelineLabel: 'Timeline of roles since December 2019, drawn to scale',
    timelineNote: 'Roles since 2019, drawn to scale.',
    roles: [
      {
        id: 'ntt',
        title: 'Software Engineer',
        org: facts.employer,
        short: 'NTT DATA',
        location: 'Argentina',
        ...roles.ntt,
        context:
          'A digital case-file platform for a city government in Argentina, integrated with the government’s document-management and electronic case-file systems.',
        bullets: [
          'Lead technical development and maintenance of more than 10 Java 17 and Spring Boot 3 microservices with an Angular front end, deployed on ==OpenShift== across DEV, HML, QA and PRD.',
          'Led the migration from Java 11 to 17 and from Spring Boot 2 to 3 (`javax` to `jakarta`, Hibernate 6, Spring Security with `SecurityFilterChain`), and upgraded dependencies to meet the client’s security compliance requirements.',
          'Planned the incremental front-end migration from Angular 14 to 19, including RxJS 7 and Angular Material.',
          'Build REST and SOAP integrations with external government systems, including analysis of connectivity failures and proposals for retry mechanisms.',
          'Design and run ==idempotent== Oracle 19c scripts in SQL and PL/SQL for bulk loads and updates in production (MERGE, global temporary tables, verification before DML). One release processed more than 13,000 records.',
          'Coordinated data remediation for the QA environment across 73 schema tables, and tracked test execution for 31 business processes.',
          'Troubleshoot production incidents through logs and metrics in Kibana and Dynatrace, tracing root causes to code, data or configuration.',
          'Write technical, architecture and security documentation for production releases, including security checkpoints and assessments, plus Postman collections of more than 200 requests for QA.',
          'Manage GitLab repositories and CI/CD pipelines, and track work in Jira with Agile practices.',
          'Act as the team’s technical point of reference: knowledge sharing, code reviews, and bringing AI tools (Claude Code) into our workflow.',
        ],
        notes: [
          {
            kind: 'private',
            lead: 'Not public.',
            body: 'Client code, data and documents are confidential. In an interview I can walk through approaches, not artifacts.',
          },
          {
            kind: 'gloss',
            lead: 'OpenShift.',
            body: 'Red Hat’s Kubernetes platform. DEV, HML (homologación, the client’s acceptance environment), QA and PRD are the platform’s four environments.',
            anchor: 'OpenShift',
          },
          {
            kind: 'gloss',
            lead: 'Idempotent.',
            body: 'A script that leaves the same result whether it runs once or twice, so a retry can’t duplicate or corrupt data.',
            anchor: 'idempotent',
          },
        ],
      },
      {
        id: 'cumbresoft',
        title: 'Java Developer',
        org: 'CumbreSoft',
        short: 'CumbreSoft',
        location: 'Mendoza, Argentina',
        ...roles.cumbresoft,
        bullets: [
          'Developed Java web applications with ZK Framework, and SQL queries on relational databases.',
          'Automated administrative procedures and business-process workflows with Sayges and BonitaSoft (BPM).',
          'Provided technical support to users and clients.',
        ],
        notes: [],
      },
      {
        id: 'municipality',
        title: 'Java Development Intern',
        org: 'Municipality of the City of Mendoza',
        short: 'Municipality of Mendoza',
        location: 'Mendoza, Argentina',
        ...roles.municipality,
        bullets: ['Took part in digitizing municipal processes with Sayges.', 'Developed features in Java with ZK Framework.'],
        notes: [],
      },
    ],
    thread: {
      kind: 'gloss',
      lead: 'A common thread.',
      body: 'Every role so far has meant building software for administrative procedures: municipal processes, business workflows, and a city government’s case files.',
    },
  },
  work: {
    heading: 'Selected work',
    intro: 'Two pieces of professional work, described without client details, and one personal project.',
    cases: [
      {
        id: 'migration',
        title: 'Moving a platform to Java 17 and Spring Boot 3',
        kind: 'Professional work at NTT DATA',
        sections: [
          {
            label: 'Context',
            body: 'A digital case-file platform for a city government: more than 10 Spring Boot microservices and an Angular front end on OpenShift, integrated over REST and SOAP with the government’s document and case-file systems.',
          },
          {
            label: 'Problem',
            body: 'The services ran on Java 11 and Spring Boot 2, and the client’s security compliance requirements called for upgraded dependencies.',
          },
          {
            label: 'My part',
            body: 'I led the migration: Java 11 to 17, Spring Boot 2 to 3, the ==`javax` to `jakarta`== namespace change, Hibernate 6, and Spring Security rewritten around `SecurityFilterChain`. I also planned the front end’s incremental path from Angular 14 to 19.',
          },
          {
            label: 'Decisions',
            body: 'The front-end plan is incremental rather than one jump: Angular is updated one major version at a time, which is how Angular’s own update tooling works.',
          },
          {
            label: 'Outcome',
            body: 'The services run on Java 17 and Spring Boot 3 with upgraded dependencies. The example at the top of this page shows the kind of breakage this migration deals with.',
          },
        ],
        links: [],
        notes: [
          {
            kind: 'gloss',
            lead: 'In short.',
            body: 'Jakarta EE renamed the Java EE `javax.*` packages to `jakarta.*`, so every import of servlet, persistence or validation classes had to change.',
            anchor: '`javax` to `jakarta`',
          },
          { kind: 'private', lead: 'Not public.', body: 'No code or client documents can be shown.' },
        ],
      },
      {
        id: 'oracle',
        title: 'Production data changes that are safe to run twice',
        kind: 'Professional work at NTT DATA',
        sections: [
          { label: 'Context', body: 'Some releases needed bulk loads and updates of production data in Oracle 19c.' },
          { label: 'My part', body: 'I design and run those scripts, in SQL and PL/SQL.' },
          {
            label: 'Decisions',
            body: 'Idempotent by construction: [`MERGE`](' +
              docs.oracleMerge +
              ') instead of blind inserts and updates, ==global temporary tables== to stage the data, and verification queries before any DML runs. The aim is a script that can be re-run after an interruption without duplicating or corrupting rows.',
          },
          {
            label: 'Outcome',
            body: 'More than 13,000 records processed in a single release.',
          },
        ],
        links: [],
        notes: [
          {
            kind: 'gloss',
            lead: 'Global temporary table.',
            body:
              'An Oracle table whose rows are visible only to the session that inserted them, and disappear at commit or when the session ends, depending on how it’s defined. [Oracle documentation](' +
              docs.oracleTemporaryTables +
              ').',
            anchor: 'global temporary tables',
          },
          { kind: 'private', lead: 'Not public.', body: 'Scripts and data belong to the client.' },
        ],
      },
      {
        id: 'duck',
        title: 'Project Duck: shipping an Android game',
        kind: 'Personal project, 2026',
        sections: [
          {
            label: 'Context',
            body: 'A personal project: an idle clicker game made with Godot Engine and published on Google Play under the BlackCorp name.',
          },
          {
            label: 'What shipped',
            body: 'Sign-in with Google or email, progress that follows the player to a new phone, an online leaderboard, raids on other players’ yards, ads and in-app purchases.',
          },
          {
            label: 'Beyond the code',
            body: 'A store release is a long list of someone else’s rules: a privacy policy, terms of service, an account-deletion page, a content rating, an `app-ads.txt` file for AdMob, and license credits for Godot and its third-party components. All of them are published.',
          },
          {
            label: 'Why it’s here',
            body: 'Annotation and evaluation work runs on detailed guidelines. Getting an app through a store’s policies is practice at following them to the letter.',
          },
        ],
        links: [
          { label: 'Google Play listing', href: facts.links.projectDuckStore },
          { label: 'Project Duck site and policies', href: facts.links.projectDuckSite },
        ],
        notes: [
          { kind: 'public', lead: 'Public.', body: 'The store listing, and the game’s site with its policy pages and the credits for the engine, plugins, fonts and sounds made by others.' },
          { kind: 'private', lead: 'Not public.', body: 'The game’s source code.' },
        ],
      },
    ],
  },
  skills: {
    heading: 'Tools and technologies',
    intro: 'Grouped by where I’ve used them, so it’s clear which ones carry production weight.',
    groups: [
      {
        label: 'In my current role at NTT DATA',
        items: [
          'Java 17',
          'Spring Boot 3',
          'Spring Security',
          'Hibernate 6 and JPA',
          'REST',
          'SOAP',
          'Oracle Database 19c',
          'SQL',
          'PL/SQL',
          'Angular',
          'TypeScript',
          'RxJS',
          'Angular Material',
          'OpenShift',
          'Kubernetes',
          'GitLab CI/CD',
          'Kibana',
          'Dynatrace',
          'Postman',
          'Jira',
          'Claude Code',
        ],
      },
      {
        label: 'Also in my toolkit',
        items: [
          'Java 8, 11 and 21',
          'Spring Cloud Config',
          'Maven',
          'JUnit',
          'Lombok',
          'DBeaver',
          'Docker',
          'Tomcat',
          'Git',
          'Linux',
          'JavaScript',
          'Python',
          'HTML',
          'CSS',
          'Bootstrap',
          'TDD',
          'Scrum',
        ],
      },
      { label: 'Earlier roles', items: ['ZK Framework', 'BonitaSoft (BPM)', 'Sayges'] },
      { label: 'Personal projects', items: ['Godot Engine'] },
    ],
  },
  education: {
    heading: 'Education and languages',
    items: [
      {
        title: 'Bachelor’s degree in Computer Science and Software Development',
        school: 'Universidad del Aconcagua',
        status: 'Not completed',
      },
      { title: 'Informatics Engineering (Ingeniería en Informática)', school: 'Universidad de Mendoza', status: 'Three years completed' },
      { title: 'PC Repair, Maintenance and Networking Technician', school: 'Instituto Escuelas Newton' },
      { title: 'High school diploma in Humanities and Social Sciences', school: 'Escuela Secundaria Maestro Alfredo Bravo' },
    ],
    languagesHeading: 'Languages',
    languages: [
      { name: 'Spanish', level: 'Native' },
      { name: 'English', level: 'Upper-intermediate (B2): advanced reading and writing, intermediate speaking' },
    ],
  },
  contact: {
    heading: 'Contact',
    intro: 'Email is the best way to reach me, in English or Spanish.',
    copy: 'Copy address',
    copied: 'Copied',
    copyFailed: 'Couldn’t copy. Select the address instead.',
    linkedin: 'LinkedIn profile',
    github: 'GitHub profile',
    location: 'Mendoza, Argentina. UTC−3.',
    availability: 'Open to remote AI training and evaluation projects, and to software engineering roles.',
  },
  footer: {
    colophon:
      'Built with React, TypeScript and Vite. Set in Newsreader, Public Sans and JetBrains Mono.',
    source: 'Source on GitHub',
    rights: `© ${__BUILD_MONTH__.slice(0, 4)} ${facts.name.display}`,
  },
  cv: {
    heading: 'Résumé',
    print: 'Print or save as PDF',
    back: 'Back to the portfolio',
    summaryHeading: 'Summary',
    summary:
      'Software engineer with six years of professional Java development, and Spring Boot microservices since 2021. Works on large-scale digital-government software: Oracle SQL and PL/SQL, OpenShift and Kubernetes, REST and SOAP integrations. Led the Java 17 and Spring Boot 3 migration and planned the Angular 14 to 19 upgrade; troubleshoots production incidents with Kibana and Dynatrace; writes technical and security documentation for releases. The team’s technical point of reference and an active user of AI tools in development.',
    experienceHeading: 'Experience',
    skillsHeading: 'Technical skills',
    educationHeading: 'Education',
    languagesHeading: 'Languages',
    projectsHeading: 'Personal project',
    project:
      '**Project Duck**, an Android game built with Godot Engine and published on Google Play (2026): accounts, cloud-synced progress, online leaderboard, ads and in-app purchases, with its privacy, terms and account-deletion pages.',
  },
  notFound: {
    heading: 'This page isn’t here.',
    body: 'The address may be mistyped, or the page may have moved.',
    home: 'Go to the portfolio',
  },
};
