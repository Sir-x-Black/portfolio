# Spring Security review: compile check

The portfolio's first screen shows a constructed example: a plausible AI-generated answer to a Spring Boot 3 security question, the four problems in it, and the corrected code. This folder holds the code behind that example so its verdict can be checked rather than taken on trust.

The example was written for the portfolio. It does not come from a client, an employer or an AI-training project.

## The prompt

> Spring Boot 3 app. Leave `/api/public/**` open, require authentication everywhere else, and respond 401 instead of redirecting to a login page.

## Cases

| Case | What it is | Expected result |
|---|---|---|
| [`answer`](cases/answer/SecurityConfig.java) | The model answer shown on the site | Does not compile |
| [`reviewed`](cases/reviewed/SecurityConfig.java) | The corrected version shown on the site | Compiles with no warnings under `-Xlint:all` |
| [`olddsl`](cases/olddsl/SecurityConfig.java) | Control: issues 1, 2 and 4 fixed, the old DSL kept | Compiles, with `authorizeRequests()` and `exceptionHandling()` flagged for removal |
| [`antmatchers`](cases/antmatchers/SecurityConfig.java) | Control: current DSL, but `antMatchers` kept | Does not compile |

The control cases isolate claims that the `answer` case can't prove on its own, because javac stops reporting some problems once others fail.

## What javac reports for the model answer

Six errors from three root causes, plus one call marked for removal:

| Issue | Compiler output |
|---|---|
| 1. `javax.servlet` | `package javax.servlet.http does not exist`, and later `cannot find symbol: variable HttpServletResponse` |
| 2. `WebSecurityConfigurerAdapter` | `cannot find symbol: class WebSecurityConfigurerAdapter` (import and `extends`), then `method does not override or implement a method from a supertype` on `@Override` |
| 3. Old DSL | `[removal] authorizeRequests() in HttpSecurity has been deprecated and marked for removal` |
| 4. `antMatchers` | `cannot find symbol: method antMatchers(String)` |

The check also corrected the review itself. The first draft of note 3 said `.and()` was deprecated; javac does not flag it in this chain, so the note now names the two calls the compiler does flag, `authorizeRequests()` and the no-argument `exceptionHandling()`.

## Run it

Requires Node 22+ and a JDK 17+ `javac` on `PATH`.

```sh
npm run verify:example
```

The script downloads eight jars from Maven Central into `.cache/` (git-ignored), checks each against a pinned SHA-256 hash, compiles every case with `javac -Xlint:all`, and fails if any claim in the table above does not hold. Versions are the ones `spring-boot-dependencies` 3.5.16 manages: Spring Security 6.5.11, Spring Framework 6.2.19 and Jakarta Servlet API 6.0.0.

A test in `tests/` checks that the code shown on the site matches these files line for line, so the page cannot drift from what was compiled.
