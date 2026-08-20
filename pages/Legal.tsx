import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Eyebrow } from '../components/site/Primitives';
import { Reveal } from '../components/site/Backgrounds';
import { ShieldCheck, ScrollText } from 'lucide-react';

/**
 * Privacy Policy and Terms of Service.
 *
 * These are drafted to cover how the site actually behaves today: one contact
 * form, no analytics, no advertising cookies, no third-party trackers. If
 * analytics or a chat widget are added later, the "What we collect" and
 * "Cookies" sections must be updated to match.
 *
 * NOTE: reviewed for accuracy against the codebase, but not legal advice —
 * worth a lawyer's eye before relying on it commercially.
 */

const COMPANY = 'Layer Sync Technologies (Private) Limited';
const EMAIL = 'support@layersyncai.com';
const UPDATED = 'August 2026';

const Shell: React.FC<{
  eyebrow: React.ReactNode;
  title: string;
  intro: string;
  children: React.ReactNode;
  dark: boolean;
}> = ({ eyebrow, title, intro, children, dark }) => (
  <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
    <section className="relative pt-36 md:pt-48 pb-10 md:pb-16 px-4 md:px-6 overflow-hidden">
      <div className="ambient-glow absolute top-[10%] right-[10%] w-[35vw] h-[35vw] blur-[150px] bg-brand-green/10 pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h1 className="hero-heading mb-6 text-shimmer">{title}</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="sub-heading">{intro}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary">
            Last updated {UPDATED}
          </p>
        </Reveal>
      </div>
    </section>

    <section className="pb-24 md:pb-36 px-4 md:px-6">
      <div className="max-w-3xl mx-auto legal-body">{children}</div>
    </section>
  </div>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl md:text-2xl font-light text-gray-900 dark:text-dark-text-primary mt-12 mb-4 first:mt-0">
    {children}
  </h2>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm md:text-[15px] text-gray-600 dark:text-dark-text-secondary leading-relaxed mb-4">
    {children}
  </p>
);

const UL: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-2.5 mb-4">
    {items.map((it, i) => (
      <li key={i} className="flex items-start gap-3 text-sm md:text-[15px] text-gray-600 dark:text-dark-text-secondary leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2 flex-shrink-0" />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

export const Privacy: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  return (
    <Shell
      dark={isDarkMode ?? true}
      eyebrow={<><ShieldCheck className="w-3 h-3" /> Privacy</>}
      title="Privacy Policy"
      intro="What we collect when you contact us, why we hold it, and how to get it removed. Written to be read, not to be survived."
    >
      <H2>Who we are</H2>
      <P>
        {COMPANY} ("LayerSync", "we") is a software company registered in Zimbabwe and based in
        Harare. We build custom operations software, including SynCRM. For anything in this policy,
        contact us at <a href={`mailto:${EMAIL}`} className="text-brand-orange underline">{EMAIL}</a>.
      </P>
      <P>
        We are the data controller for personal information submitted through this website.
      </P>

      <H2>What we collect</H2>
      <P>
        We collect only what you type into our diagnostic form. There is no account system, no
        newsletter sign-up, and no tracking pixel on this site. Specifically:
      </P>
      <UL
        items={[
          <><strong>Your name</strong> — so we know who we're talking to.</>,
          <><strong>Your business and role</strong> — so we can prepare properly for the conversation.</>,
          <><strong>Your email address</strong> — so we can reply.</>,
          <><strong>Your WhatsApp number</strong> — optional, only if you'd prefer we reach you there.</>,
          <><strong>What you tell us about your operation</strong> — the free-text description of what's breaking.</>,
        ]}
      />
      <P>
        Our web host records standard server logs (IP address, browser type, pages requested) for
        security and reliability. We do not use these to build a profile of you.
      </P>

      <H2>Why we hold it (lawful basis)</H2>
      <P>
        We process this information on the basis of <strong>legitimate interest</strong> — you asked
        us to get in touch about a possible engagement, and we need your details to do that. Where
        required, and for any marketing beyond replying to your enquiry, we rely on your{' '}
        <strong>consent</strong>, which you can withdraw at any time.
      </P>

      <H2>What we don't do</H2>
      <UL
        items={[
          'We do not sell, rent, or trade your personal information. Ever.',
          'We do not run advertising or analytics trackers on this site.',
          'We do not add you to a mailing list because you filled in the form.',
          'We do not use your enquiry to train AI models.',
        ]}
      />

      <H2>Cookies</H2>
      <P>
        This site sets no advertising or analytics cookies. We store one item in your browser's local
        storage — your light/dark theme preference — so the site looks the same next time you visit.
        That never leaves your device and identifies nobody.
      </P>

      <H2>Who else sees it</H2>
      <P>
        Your enquiry is read by the LayerSync team. We use a small number of service providers to
        run the site and store enquiries — our web host and our database provider — who process the
        data on our instructions only. We do not share it with anyone else, and we do not disclose
        it to third parties for their own purposes.
      </P>

      <H2>How long we keep it</H2>
      <P>
        We keep enquiries for up to <strong>24 months</strong> from your last contact with us, so we
        have context if we speak again. After that we delete them. If we go on to work together, the
        engagement is covered by our contract with you rather than by this policy.
      </P>

      <H2>Your rights</H2>
      <P>
        If you are in the UK, the EU, or another jurisdiction with equivalent law, you have the right
        to access the personal data we hold about you, to have it corrected or deleted, to object to
        or restrict how we use it, and to receive a copy in a portable format. You also have the
        right to complain to your local data protection authority.
      </P>
      <P>
        To exercise any of these, email{' '}
        <a href={`mailto:${EMAIL}`} className="text-brand-orange underline">{EMAIL}</a>. We will
        respond within 30 days, and there is no charge.
      </P>

      <H2>International transfers</H2>
      <P>
        We are based in Zimbabwe, and our hosting and database providers operate data centres outside
        your country. If you contact us from the UK or EU, your information will be transferred
        outside that area. We rely on appropriate safeguards with our providers and keep the amount
        of data involved to the minimum described above.
      </P>

      <H2>Security</H2>
      <P>
        Enquiries are transmitted over an encrypted connection and stored in an access-controlled
        database. Access is limited to the people who need it to reply to you. No system is perfect,
        but we build for regulated environments and apply the same standards to our own data.
      </P>

      <H2>Changes</H2>
      <P>
        If we change this policy we will update the date at the top. If a change materially affects
        how we handle information you have already given us, we will contact you directly.
      </P>

      <P>
        Questions? Email <a href={`mailto:${EMAIL}`} className="text-brand-orange underline">{EMAIL}</a>{' '}
        or see our <Link to="/terms" className="text-brand-orange underline">Terms of Service</Link>.
      </P>
    </Shell>
  );
};

export const Terms: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  return (
    <Shell
      dark={isDarkMode ?? true}
      eyebrow={<><ScrollText className="w-3 h-3" /> Terms</>}
      title="Terms of Service"
      intro="The terms that apply to this website. Client engagements are governed by a separate signed agreement, not by this page."
    >
      <H2>About these terms</H2>
      <P>
        This website is operated by {COMPANY}, registered in Zimbabwe. By using the site you accept
        these terms. If you don't accept them, please don't use the site.
      </P>

      <H2>What this site is</H2>
      <P>
        This site describes what we build and how we work. Nothing on it is an offer, a quote, or a
        binding commitment. Any actual engagement between us is governed by a separate written
        agreement covering scope, price, timelines, warranties and liability — that agreement takes
        precedence over anything stated here.
      </P>

      <H2>Enquiries</H2>
      <P>
        When you submit the diagnostic form you're asking us to get in touch. That's it — it creates
        no obligation on either side. We aim to reply within one business day, but we don't guarantee
        a response or that we'll take on the work. How we handle the information you send is set out
        in our <Link to="/privacy" className="text-brand-orange underline">Privacy Policy</Link>.
      </P>

      <H2>Accuracy</H2>
      <P>
        We keep this site accurate and current, and we deliberately avoid publishing performance
        figures or client claims we cannot substantiate. Even so, the site is provided "as is",
        without warranty. Product screenshots show real software, but the data shown in them is
        demonstration data, and specific features may change as the product develops.
      </P>

      <H2>Our content</H2>
      <P>
        The content of this site — text, design, code, graphics and the LayerSync and SynCRM names
        and marks — belongs to us. You're welcome to read it, quote it with attribution, and share
        links to it. Please don't republish it as your own or use our branding to represent your own
        business.
      </P>

      <H2>Third-party links</H2>
      <P>
        Where we link out, we don't control those sites and aren't responsible for their content or
        their privacy practices.
      </P>

      <H2>Liability</H2>
      <P>
        To the extent permitted by law, we are not liable for any loss arising from your use of this
        website or reliance on its general information. Nothing here limits liability that cannot
        legally be limited, and nothing here affects the terms of a signed engagement between us.
      </P>

      <H2>Governing law</H2>
      <P>
        These terms are governed by the laws of Zimbabwe. Where you deal with us as a consumer in
        another jurisdiction, this does not remove protections you have under your own local law.
      </P>

      <H2>Contact</H2>
      <P>
        {COMPANY}, Harare, Zimbabwe —{' '}
        <a href={`mailto:${EMAIL}`} className="text-brand-orange underline">{EMAIL}</a>.
      </P>
    </Shell>
  );
};
