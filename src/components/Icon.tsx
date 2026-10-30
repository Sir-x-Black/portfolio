export type IconName = 'mail' | 'linkedin' | 'github' | 'copy' | 'check' | 'cross' | 'print' | 'file';

// Brand marks from Simple Icons (CC0). Interface icons are drawn on a 24px grid with a 1.75 stroke.
const brand: Partial<Record<IconName, string>> = {
  github:
    'M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3',
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
};

const strokes: Partial<Record<IconName, string>> = {
  mail: 'M3.5 5.5h17v13h-17z M3.8 6l8.2 6.6L20.2 6',
  copy: 'M8.5 8.5h11v11h-11z M15.5 8.5v-4h-11v11h4',
  check: 'M4.5 12.5l4.8 4.8L19.5 7',
  cross: 'M6.5 6.5l11 11 M17.5 6.5l-11 11',
  print: 'M7 9V3.5h10V9 M7 17.5H4.5v-8h15v8H17 M7 14h10v6.5H7z',
  file: 'M6 3.5h8.5L19 8v12.5H6z M14 3.5V8.5h5 M9 12.5h7 M9 16h7',
};

export function Icon({ name }: { name: IconName }) {
  const fill = brand[name];
  return (
    <svg className={`icon icon--${name}`} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      {fill ? (
        <path d={fill} fill="currentColor" />
      ) : (
        <path d={strokes[name]} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
