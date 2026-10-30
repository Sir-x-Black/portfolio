import type { MarkStyle } from '../content/review-sample';

/**
 * Hand-drawn review marks, generated at build time.
 *
 * Code is set in JetBrains Mono, whose advance width is 0.6em, so a mark's box
 * is known from its character count without measuring the DOM. The SVG is sized
 * in em and positioned around the token by CSS; the path is drawn in a viewBox
 * of 20 units per em. A fixed seed per mark keeps every build identical.
 */

const UNITS_PER_EM = 20;
const ADVANCE_EM = 0.6;
const LINE_EM = 1.7; // must match --code-line-height
export const PAD_X_EM = 0.5;
export const PAD_Y_EM = 0.32;

export interface HandMark {
  widthEm: number;
  heightEm: number;
  viewBox: string;
  d: string;
}

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Smooth path through points (Catmull-Rom converted to cubic Béziers). */
function smooth(points: [number, number][]): string {
  const [first] = points;
  if (!first) return '';
  let d = `M${round(first[0])} ${round(first[1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
}

/** A loose loop that starts upper left, goes round once and overshoots, like a pen circling a word. */
function loop(w: number, h: number, padX: number, padY: number, random: () => number): string {
  const cx = padX + w / 2;
  const cy = padY + h / 2;
  const rx = w / 2 + padX * 0.78;
  const ry = h / 2 + padY * 0.72;
  const tilt = ((random() - 0.5) * 4 * Math.PI) / 180;
  const start = Math.PI * (1.08 + random() * 0.1);
  const sweep = Math.PI * 2 * (1.07 + random() * 0.05);
  const wobble = random() * Math.PI * 2;
  const steps = 28;
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = start + sweep * t;
    // The loop opens slightly as it goes round, so the overshoot doesn't retrace the start.
    const grow = 0.94 + 0.1 * t + 0.025 * Math.sin(angle * 2 + wobble);
    const x = Math.cos(angle) * rx * grow;
    const y = Math.sin(angle) * ry * grow;
    points.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]);
  }
  return smooth(points);
}

/** A quick underline that rises a little and wavers, drawn left to right. */
function underline(w: number, h: number, padX: number, padY: number, random: () => number): string {
  const y = padY + h - 1.5;
  const x0 = padX - 2;
  const x1 = padX + w + 3;
  const segments = Math.max(3, Math.round(w / 60));
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const waver = (random() - 0.5) * 2.2;
    points.push([x0 + (x1 - x0) * t, y + waver - t * 2]);
  }
  return smooth(points);
}

export function handMark(chars: number, style: MarkStyle, seed: number): HandMark {
  const random = seeded(seed);
  const w = chars * ADVANCE_EM * UNITS_PER_EM;
  const h = LINE_EM * UNITS_PER_EM;
  const padX = PAD_X_EM * UNITS_PER_EM;
  const padY = PAD_Y_EM * UNITS_PER_EM;
  const totalW = w + padX * 2;
  const totalH = h + padY * 2;
  const em = (units: number) => Math.round((units / UNITS_PER_EM) * 100) / 100;
  return {
    widthEm: em(totalW),
    heightEm: em(totalH),
    viewBox: `0 0 ${round(totalW)} ${round(totalH)}`,
    d: style === 'circle' ? loop(w, h, padX, padY, random) : underline(w, h, padX, padY, random),
  };
}
