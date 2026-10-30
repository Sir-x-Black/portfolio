import type { SiteContent } from '../content/types';
import { AiFit } from '../components/AiFit';
import { Contact } from '../components/Contact';
import { Education } from '../components/Education';
import { Experience } from '../components/Experience';
import { Hero } from '../components/Hero';
import { SelectedWork } from '../components/SelectedWork';
import { Skills } from '../components/Skills';

export function HomePage({ content }: { content: SiteContent }) {
  return (
    <main id="main" className="page" tabIndex={-1}>
      <Hero content={content} />
      <AiFit content={content} />
      <Experience content={content} />
      <SelectedWork content={content} />
      <Skills content={content} />
      <Education content={content} />
      <Contact content={content} />
    </main>
  );
}
