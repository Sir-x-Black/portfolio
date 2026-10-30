import { createContext, Fragment, useContext, type ReactNode } from 'react';
import type { Rich as RichText } from '../content/types';
import { isExternal } from '../lib/paths';

/** Maps a normalized anchor phrase to the index of the margin note that annotates it. */
export const AnchorKeys = createContext<ReadonlyMap<string, number>>(new Map());

/** Lowercase, without inline-code backticks, so content and notes can match loosely. */
export const normalizeAnchor = (text: string): string => text.replaceAll('`', '').trim().toLowerCase();

const TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|==(.+?)==|\*\*(.+?)\*\*/g;

/** Keeps a product and its version on one line ("Spring Boot 3", "Java 17", "Oracle 19c"). */
const VERSIONED = /\b(Java|Boot|Angular|Oracle|Security|RxJS|Hibernate|Database|Jakarta EE) (?=\d)/g;
const keepVersions = (text: string): string => text.replace(VERSIONED, '$1\u00a0');

function Anchor({ text }: { text: string }) {
  const keys = useContext(AnchorKeys);
  const key = keys.get(normalizeAnchor(text));
  return (
    <span className="anchor" data-k={key}>
      {parse(text)}
    </span>
  );
}

function parse(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, code, label, href, anchor, strong] = match;
    const at = match.index;
    if (at > last) nodes.push(keepVersions(text.slice(last, at)));
    const key = `${at}`;
    if (code !== undefined) {
      nodes.push(
        <code key={key} translate="no">
          {code}
        </code>,
      );
    } else if (label !== undefined && href !== undefined) {
      nodes.push(
        <a key={key} href={href} rel={isExternal(href) ? 'external' : undefined}>
          {parse(label)}
        </a>,
      );
    } else if (anchor !== undefined) {
      nodes.push(<Anchor key={key} text={anchor} />);
    } else if (strong !== undefined) {
      nodes.push(<strong key={key}>{parse(strong)}</strong>);
    }
    last = at + whole.length;
  }
  if (last < text.length) nodes.push(keepVersions(text.slice(last)));
  return nodes;
}

/** Renders the small inline markup used in content strings (see content/types.ts). */
export function Rich({ text }: { text: RichText }) {
  return <Fragment>{parse(text)}</Fragment>;
}

/** Plain text of a content string, for attributes and metadata. */
export const plain = (text: RichText): string =>
  text.replace(TOKEN, (_whole, code?: string, label?: string, _href?: string, anchor?: string, strong?: string) =>
    plain(code ?? label ?? anchor ?? strong ?? ''),
  );
