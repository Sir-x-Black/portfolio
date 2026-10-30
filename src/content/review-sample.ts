/**
 * Code shown in the review example. It must match the compiled cases in
 * evidence/spring-security-review/cases/ (package line and Spring imports
 * omitted); tests/review-sample.test.ts enforces that.
 */

export type MarkStyle = 'circle' | 'underline';

export interface Mark {
  text: string;
  issue: number;
  style: MarkStyle;
}

export type Segment = string | Mark;

export interface CodeLine {
  segments: Segment[];
  /** Reviewed view: the line differs from the model answer. */
  changed?: boolean;
  /** Reviewed view: first changed line that resolves this issue. */
  resolves?: number;
}

const mark = (text: string, issue: number, style: MarkStyle): Mark => ({ text, issue, style });

export const answerLines: CodeLine[] = [
  { segments: ['import ', mark('javax.servlet', 1, 'circle'), '.http.HttpServletResponse;'] },
  { segments: [''] },
  { segments: ['@Configuration'] },
  { segments: ['@EnableWebSecurity'] },
  { segments: ['public class SecurityConfig ', mark('extends WebSecurityConfigurerAdapter', 2, 'underline'), ' {'] },
  { segments: [''] },
  { segments: ['  @Override'] },
  { segments: ['  protected void configure(HttpSecurity http) throws Exception {'] },
  { segments: ['    http.', mark('authorizeRequests()', 3, 'underline')] },
  { segments: ['        .', mark('antMatchers', 4, 'circle'), '("/api/public/**").permitAll()'] },
  { segments: ['        .anyRequest().authenticated()'] },
  { segments: ['        .and()'] },
  { segments: ['        .', mark('exceptionHandling()', 3, 'underline')] },
  { segments: ['        .authenticationEntryPoint((req, res, e) ->'] },
  { segments: ['            res.sendError(HttpServletResponse.SC_UNAUTHORIZED));'] },
  { segments: ['  }'] },
  { segments: ['}'] },
];

export const reviewedLines: CodeLine[] = [
  { segments: ['import jakarta.servlet.http.HttpServletResponse;'], changed: true, resolves: 1 },
  { segments: [''] },
  { segments: ['@Configuration'] },
  { segments: ['@EnableWebSecurity'] },
  { segments: ['public class SecurityConfig {'], changed: true, resolves: 2 },
  { segments: [''] },
  { segments: ['  @Bean'], changed: true },
  { segments: ['  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {'], changed: true },
  { segments: ['    http'], changed: true },
  { segments: ['        .authorizeHttpRequests(auth -> auth'], changed: true, resolves: 3 },
  { segments: ['            .requestMatchers("/api/public/**").permitAll()'], changed: true, resolves: 4 },
  { segments: ['            .anyRequest().authenticated())'], changed: true },
  { segments: ['        .exceptionHandling(ex -> ex'], changed: true },
  // Only re-indented, so not marked as a change.
  { segments: ['            .authenticationEntryPoint((req, res, e) ->'] },
  { segments: ['                res.sendError(HttpServletResponse.SC_UNAUTHORIZED)));'], changed: true },
  { segments: ['    return http.build();'], changed: true },
  { segments: ['  }'] },
  { segments: ['}'] },
];

export const lineText = (line: CodeLine): string =>
  line.segments.map((segment) => (typeof segment === 'string' ? segment : segment.text)).join('');
