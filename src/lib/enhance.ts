/**
 * Progressive enhancement: the only JavaScript the site ships. Every page works
 * without it; these handlers add the parts that need a script.
 */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The review marks draw themselves with a CSS animation on load. If the example
 * starts below the fold (phones, short windows), hold the animation until it is
 * actually on screen, so the one orchestrated moment isn't spent off-screen.
 */
function deferReviewMarks(doc: Document): void {
  const sheet = doc.querySelector<HTMLElement>('[data-review]');
  const code = sheet?.querySelector<HTMLElement>('.code');
  if (!sheet || !code || reducedMotion() || !('IntersectionObserver' in window)) return;

  // The block holds the sheet and its margin notes, whose numbers light up in sync.
  const block = sheet.closest<HTMLElement>('.annotated') ?? sheet;
  let first = true;
  // Positions come from the observer rather than getBoundingClientRect(), so
  // reading them never forces a synchronous layout.
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries.at(-1);
      if (!entry) return;
      if (first) {
        first = false;
        const viewport = entry.rootBounds?.height ?? window.innerHeight;
        if (entry.boundingClientRect.top < viewport * 0.85) {
          observer.disconnect();
          return;
        }
        block.classList.add('is-deferred');
      }
      if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
        block.classList.remove('is-deferred');
        observer.disconnect();
      }
    },
    { threshold: 0.4 },
  );
  observer.observe(code);
}

function enableCopy(doc: Document): void {
  if (!navigator.clipboard?.writeText) return;
  for (const button of doc.querySelectorAll<HTMLButtonElement>('button[data-copy]')) {
    const status = button.parentElement?.querySelector<HTMLElement>('[role="status"]');
    let reset: number | undefined;
    button.hidden = false;
    button.addEventListener('click', async () => {
      window.clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        button.classList.add('is-done');
        if (status) status.textContent = button.dataset.copied ?? '';
      } catch {
        if (status) status.textContent = button.dataset.failed ?? '';
      }
      reset = window.setTimeout(() => {
        button.classList.remove('is-done');
        if (status) status.textContent = '';
      }, 2500);
    });
  }
}

/**
 * A region that scrolls sideways (the code sample on narrow screens) must be
 * reachable by keyboard. Only add it to the tab order while it actually scrolls.
 */
function focusableScrollers(doc: Document): void {
  const scrollers = doc.querySelectorAll<HTMLElement>('[data-scroller]');
  if (!scrollers.length || !('ResizeObserver' in window)) return;
  // ResizeObserver callbacks run after layout, so measuring here is free. Observing
  // the content too catches the width change when the web fonts arrive.
  const observer = new ResizeObserver(() => {
    for (const scroller of scrollers) {
      if (scroller.scrollWidth > scroller.clientWidth + 1) scroller.tabIndex = 0;
      else scroller.removeAttribute('tabindex');
    }
  });
  for (const scroller of scrollers) {
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
  }
}

function enablePrint(doc: Document): void {
  for (const button of doc.querySelectorAll<HTMLButtonElement>('button[data-print]')) {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  }
}

export function enhance(doc: Document): void {
  deferReviewMarks(doc);
  focusableScrollers(doc);
  enableCopy(doc);
  enablePrint(doc);
}
