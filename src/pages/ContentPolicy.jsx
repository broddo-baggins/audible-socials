import { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';

/**
 * Content Policy, set as a reading page (the legal reading layout shared by
 * Terms, Privacy, Cookies and Content policy): PageHeader with the date, a
 * sticky contents list on the left at lg+ (a disclosure below lg), and the
 * text in a 68ch column at 16px/1.7. The policy text itself is unchanged.
 */

/** Marks the section nearest the top of the viewport as current. */
const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-96px 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
};

const lastUpdated = 'January 15, 2025';

const contentGuidelines = [
  { title: 'Original Content Creation', description: 'Guidelines for creating and publishing original audio content on our platform', rules: ['All content must be original or properly licensed', 'Creators must have rights to publish submitted material', 'Content should respect intellectual property rights', 'Proper attribution required for adapted works', 'No plagiarism or unauthorized copying of existing works'] },
  { title: 'Community Standards', description: 'Standards for user-generated content and community interactions', rules: ['Respectful and inclusive language in all communications', 'No harassment, discrimination, or hate speech', 'Appropriate content for diverse audiences', 'Accurate and truthful information sharing', 'Constructive feedback and reviews encouraged'] },
  { title: 'Content Moderation', description: 'How we moderate content to maintain a safe and enjoyable platform', rules: ['Automated systems and human review for content screening', 'Community reporting system for inappropriate content', 'Fair and transparent moderation processes', 'Appeals process for content removal decisions', 'Regular updates to moderation guidelines'] },
  { title: 'Prohibited Content', description: 'Types of content that are not allowed on our platform', rules: ['Illegal activities, instructions, or encouragement', 'Hate speech, discrimination, or harassment', 'Misinformation and conspiracy theories', 'Spam, scams, or deceptive content', 'Copyright infringement or unauthorized material'] },
];

const contentCategories = [
  { category: 'Audiobooks', guidelines: ['Must be properly licensed or in public domain', 'Narration quality standards must be met', 'Accurate representation of original work', 'Appropriate content ratings and warnings', 'Regular quality checks and updates'] },
  { category: 'Podcasts', guidelines: ['Clear disclosure of sponsorships and advertising', 'Fact-checking for informational content', 'Proper music licensing for included tracks', 'Content warnings for sensitive topics', 'Regular publishing schedule expectations'] },
  { category: 'User Reviews', guidelines: ['Honest and genuine opinions only', 'No fake or incentivized reviews', 'Constructive criticism encouraged', 'No personal attacks or inappropriate language', 'One review per user per title'] },
  { category: 'Social Features', guidelines: ['Respectful discussions and debates', 'No spamming or repetitive content', 'Privacy considerations for shared information', 'Appropriate use of tags and categories', 'Community guidelines must be followed'] },
];

const enforcementActions = [
  { action: 'Content Warning', description: 'First offense - content flagged with warning', severity: 'Low', level: 1 },
  { action: 'Content Removal', description: 'Content violating policy removed from platform', severity: 'Medium', level: 2 },
  { action: 'Account Suspension', description: 'Temporary suspension for repeated violations', severity: 'High', level: 3 },
  { action: 'Account Termination', description: 'Permanent ban for severe or repeated violations', severity: 'Critical', level: 4 },
];

const appealProcess = [
  'Submit appeal within 30 days of decision',
  'Provide detailed explanation and evidence',
  'Review by content moderation team',
  'Decision communicated within 7 business days',
  'Right to further appeal if unsatisfied',
];

const reporting = [
  { title: 'Report Content', text: 'Use the "Report" button on any piece of content' },
  { title: 'Contact Support', text: 'Email content-policy@audible.com', email: 'content-policy@audible.com' },
  { title: 'Emergency', text: 'For immediate threats: emergency@audible.com', email: 'emergency@audible.com' },
];

const toc = [
  { id: 'guidelines', label: 'Content Guidelines' },
  { id: 'categories', label: 'Category-Specific Guidelines' },
  { id: 'enforcement', label: 'Enforcement Actions' },
  { id: 'appeals', label: 'Appeals Process' },
  { id: 'reporting', label: 'Reporting Violations' },
  { id: 'updates', label: 'Policy Updates' },
];
const tocIds = toc.map((t) => t.id);

const Toc = ({ active }) => (
  <ol className="space-y-0.5">
    {toc.map((t) => (
      <li key={t.id}>
        <a
          href={`#${t.id}`}
          aria-current={active === t.id ? 'location' : undefined}
          className={`block border-l-[3px] py-1.5 pl-3 text-sm leading-snug hover:text-ink ${active === t.id ? 'border-hl font-medium text-ink' : 'border-transparent text-ink-2'}`}
        >
          {t.label}
        </a>
      </li>
    ))}
  </ol>
);

/** Severity as a four-step ink meter beside its word, so it never relies on colour. */
const SeverityMeter = ({ level }) => (
  <span className="inline-flex items-end gap-0.5" aria-hidden="true">
    {[1, 2, 3, 4].map((n) => (
      <span key={n} className={`w-1.5 rounded-sm ${n <= level ? 'bg-ink' : 'bg-line'}`} style={{ height: `${6 + n * 3}px` }} />
    ))}
  </span>
);

const sectionCls = 'scroll-mt-24 border-t border-line pt-8 pb-10';
const withEmail = (text, email) => {
  if (!email) return text;
  const [before, after] = text.split(email);
  return <>{before}<a href={`mailto:${email}`} className="link">{email}</a>{after}</>;
};

const ContentPolicy = () => {
  const active = useActiveSection(tocIds);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Content Policy"
        description={<>Last updated <time dateTime="2025-01-15">{lastUpdated}</time></>}
      />

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="mb-8 lg:mb-0">
          <details className="rounded-lg border border-line bg-surface lg:hidden">
            <summary className="flex min-h-11 cursor-pointer items-center px-4 font-medium text-ink">On this page</summary>
            <div className="border-t border-line px-1 py-2"><Toc active={active} /></div>
          </details>
          <div className="sticky top-24 hidden lg:block">
            <p className="t-label mb-3 text-ink-3">On this page</p>
            <Toc active={active} />
          </div>
        </nav>

        <article className="max-w-[68ch] text-base leading-[1.7] text-ink-2">
          <div className="mb-10 space-y-4 text-[1.0625rem] text-ink">
            <p>
              At Audible, we are committed to providing a safe, respectful, and enjoyable platform for
              audio entertainment. Our Content Policy outlines the standards and guidelines that govern
              all content on our platform, including user-generated content, reviews, and community interactions.
            </p>
            <p>
              This policy applies to all users, creators, and content on the Audible platform. By using
              our services, you agree to comply with these guidelines. We reserve the right to remove
              content and take enforcement actions as described below.
            </p>
          </div>

          <section id="guidelines" aria-labelledby="guidelines-h" className={sectionCls}>
            <h2 id="guidelines-h" className="t-h2 text-ink">Content Guidelines</h2>
            <div className="mt-6 space-y-8">
              {contentGuidelines.map((g) => (
                <div key={g.title}>
                  <h3 className="t-h3 text-ink">{g.title}</h3>
                  <p className="mt-1">{g.description}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-ink-3">
                    {g.rules.map((r) => <li key={r} className="pl-1">{r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="categories" aria-labelledby="categories-h" className={sectionCls}>
            <h2 id="categories-h" className="t-h2 text-ink">Category-Specific Guidelines</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {contentCategories.map((c) => (
                <div key={c.category} className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-semibold text-ink">{c.category}</dt>
                  <dd>
                    <ul className="list-disc space-y-1 pl-5 marker:text-ink-3">
                      {c.guidelines.map((g) => <li key={g} className="pl-1">{g}</li>)}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="enforcement" aria-labelledby="enforcement-h" className={sectionCls}>
            <h2 id="enforcement-h" className="t-h2 text-ink">Enforcement Actions</h2>
            <p className="mt-4">
              We take violations of our Content Policy seriously. Depending on the severity and frequency
              of violations, we may take the following enforcement actions:
            </p>
            <ol className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface">
              {enforcementActions.map((a) => (
                <li key={a.action} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:gap-6 md:px-5">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink">{a.action}</h3>
                    <p className="text-[0.9375rem]">{a.description}</p>
                  </div>
                  <p className={`flex shrink-0 items-center gap-2 text-sm sm:w-36 sm:pt-0.5 ${a.level >= 3 ? 'text-danger' : 'text-ink'}`}>
                    <SeverityMeter level={a.level} />
                    <span className="font-medium">{a.severity} Severity</span>
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="appeals" aria-labelledby="appeals-h" className={sectionCls}>
            <h2 id="appeals-h" className="t-h2 text-ink">Appeals Process</h2>
            <p className="mt-4">
              If you believe content was removed in error or an enforcement action was taken unfairly,
              you have the right to appeal the decision:
            </p>
            <ol className="mt-5 space-y-3">
              {appealProcess.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink text-xs font-semibold text-ink tabular">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-l-[3px] border-ink bg-surface py-3 pl-4 pr-3 text-[0.9375rem]">
              <strong className="font-semibold text-ink">Contact:</strong> For appeals and content policy questions, email{' '}
              <a href="mailto:content-policy@audible.com" className="link">content-policy@audible.com</a> or visit our Support Center.
            </p>
          </section>

          <section id="reporting" aria-labelledby="reporting-h" className={sectionCls}>
            <h2 id="reporting-h" className="t-h2 text-ink">Reporting Violations</h2>
            <div className="mt-5 rounded-lg bg-surface-sunk p-5 md:p-6">
              <h3 className="t-h3 text-ink">Help Keep Our Community Safe</h3>
              <p className="mt-1">
                If you encounter content that violates our policies, please report it immediately.
                All reports are reviewed by our moderation team within 24 hours.
              </p>
              <dl className="mt-4 divide-y divide-line border-t border-line text-[0.9375rem]">
                {reporting.map((r) => (
                  <div key={r.title} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="font-semibold text-ink">{r.title}</dt>
                    <dd>{withEmail(r.text, r.email)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section id="updates" aria-labelledby="updates-h" className={sectionCls}>
            <h2 id="updates-h" className="t-h2 text-ink">Policy Updates</h2>
            <p className="mt-4">
              We regularly review and update our Content Policy to ensure it reflects our community standards
              and legal requirements. Major changes will be communicated to users in advance.
            </p>
            <p className="mt-4 text-sm text-ink-3">Last updated: {lastUpdated}</p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ContentPolicy;
