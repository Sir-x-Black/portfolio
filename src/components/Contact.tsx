import { facts } from '../content/facts';
import type { SiteContent } from '../content/types';
import { Annotated } from './Annotated';
import { Icon } from './Icon';
import { Rich } from './Rich';

export function Contact({ content }: { content: SiteContent }) {
  const { contact } = content;
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <Annotated
        notes={[]}
        marginStart={
          <div className="contact__details">
            <p>
              <Rich text={contact.location} />
            </p>
            <p>
              <Rich text={contact.availability} />
            </p>
          </div>
        }
      >
        <h2 id="contact-title" className="section__title">
          {contact.heading}
        </h2>
        <p className="section__intro">
          <Rich text={contact.intro} />
        </p>
        <p className="contact__email">
          <a href={`mailto:${facts.email}`}>{facts.email}</a>
        </p>
        {/* Enhanced by lib/enhance.ts; stays hidden where the Clipboard API isn't available. */}
        <p className="contact__copy">
          <button
            type="button"
            className="button"
            data-copy={facts.email}
            data-copied={contact.copied}
            data-failed={contact.copyFailed}
            hidden
          >
            <Icon name="copy" />
            <span>{contact.copy}</span>
          </button>
          <span className="contact__status" role="status" />
        </p>
        <ul className="contact__links">
          <li>
            <a className="text-link" href={facts.links.linkedin}>
              <Icon name="linkedin" />
              {contact.linkedin}
            </a>
          </li>
          <li>
            <a className="text-link" href={facts.links.github}>
              <Icon name="github" />
              {contact.github}
            </a>
          </li>
        </ul>
      </Annotated>
    </section>
  );
}
