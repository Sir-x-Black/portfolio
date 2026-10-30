import type { ReactNode } from 'react';
import type { Note } from '../content/types';
import { AnchorKeys, normalizeAnchor, Rich } from './Rich';

interface AnnotatedProps {
  notes: Note[];
  children: ReactNode;
  className?: string;
  /** Rendered first in the margin, before the notes (e.g. a heading). */
  marginStart?: ReactNode;
  as?: 'div' | 'article';
  labelledBy?: string;
}

/**
 * A block of main-column content with its margin notes. On wide screens the notes
 * sit in the margin rail; on narrow screens they follow the block. Hovering or
 * focusing a note highlights the ==phrase== it annotates, and vice versa (CSS only).
 */
export function Annotated({ notes, children, className, marginStart, as: Tag = 'div', labelledBy }: AnnotatedProps) {
  const keys = new Map<string, number>();
  notes.forEach((note, index) => {
    if (note.anchor) keys.set(normalizeAnchor(note.anchor), index + 1);
  });

  return (
    <Tag className={['annotated', className].filter(Boolean).join(' ')} aria-labelledby={labelledBy}>
      <AnchorKeys.Provider value={keys}>
        <div className="annotated__main">{children}</div>
      </AnchorKeys.Provider>
      {(notes.length > 0 || marginStart) && (
        <div className="annotated__margin">
          {marginStart}
          {notes.map((note, index) => (
            <p key={note.lead} className={`note note--${note.kind}`} data-k={note.anchor ? index + 1 : undefined}>
              <span className="note__lead">{note.lead}</span> <Rich text={note.body} />
            </p>
          ))}
        </div>
      )}
    </Tag>
  );
}
