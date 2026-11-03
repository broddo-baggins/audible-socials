import { useEffect, useState } from 'react';
import { PageHeader, Badge } from '../components/ui';

/**
 * Cookie Policy, set as a reading page (the legal reading layout shared by
 * Terms, Privacy, Cookies and Content policy): PageHeader with the date, a
 * sticky contents list on the left at lg+ (a disclosure below lg), and the
 * text in a 68ch column at 16px/1.7. The legal text itself is unchanged.
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

const cookieTypes = [
  { title: 'Essential Cookies', description: 'Required for basic website functionality and security', purpose: 'These cookies are necessary for the website to function properly and cannot be disabled.', examples: ['Authentication and session management', 'Security features and fraud prevention', 'Load balancing and server optimization', 'Remembering your cookie preferences'], duration: 'Session or up to 1 year', required: true },
  { title: 'Performance Cookies', description: 'Help us understand how visitors interact with our website', purpose: 'These cookies collect information about how you use our website to help us improve performance.', examples: ['Page load times and error tracking', 'Most visited pages and features', 'Device and browser information', 'Anonymous usage statistics'], duration: 'Up to 2 years', required: false },
  { title: 'Functional Cookies', description: 'Enable enhanced features and personalization', purpose: 'These cookies allow us to remember your preferences and provide enhanced features.', examples: ['Language and region preferences', 'Customized content and recommendations', 'Playback settings and audio preferences', 'Saved searches and filters'], duration: 'Up to 2 years', required: false },
  { title: 'Marketing Cookies', description: 'Used to deliver relevant advertisements and measure campaign effectiveness', purpose: 'These cookies help us show you relevant ads and measure the effectiveness of our marketing campaigns.', examples: ['Displaying personalized advertisements', 'Tracking ad campaign performance', 'Retargeting based on website visits', 'Social media advertising integration'], duration: 'Up to 1 year', required: false },
];

const thirdPartyCookies = [
  { provider: 'Google Analytics', purpose: 'Website analytics and performance monitoring', type: 'Performance', duration: 'Up to 2 years' },
  { provider: 'Stripe', purpose: 'Payment processing and fraud prevention', type: 'Essential', duration: 'Session' },
  { provider: 'Facebook Pixel', purpose: 'Advertising and audience insights', type: 'Marketing', duration: 'Up to 1 year' },
  { provider: 'Amazon Web Services', purpose: 'Content delivery and cloud services', type: 'Essential', duration: 'Session' },
];

const manageInstructions = [
  { browser: 'Chrome', steps: ['Click the three dots in the top right corner', 'Go to Settings > Privacy and security > Cookies and other site data', 'Choose your preferred cookie settings'] },
  { browser: 'Firefox', steps: ['Click the menu button and select Settings', 'Go to Privacy & Security > Cookies and Site Data', 'Adjust your cookie preferences'] },
  { browser: 'Safari', steps: ['Go to Safari > Preferences > Privacy', 'Choose your cookie blocking preferences', 'Manage website data if needed'] },
  { browser: 'Edge', steps: ['Click the three dots > Settings > Cookies and site permissions', 'Manage cookie settings for individual sites', 'Control tracking prevention'] },
];

// key: the stored preference; essential cookies have none and cannot be turned off
const cookieChoices = [
  { label: 'Essential cookies (required)', key: null },
  { label: 'Performance cookies', key: 'performance' },
  { label: 'Functional cookies', key: 'functional' },
  { label: 'Marketing cookies', key: 'marketing' },
];

const toc = [
  { id: 'what-are-cookies', label: 'What Are Cookies?' },
  { id: 'types', label: 'Types of Cookies We Use' },
  { id: 'third-party', label: 'Third-Party Cookies' },
  { id: 'managing', label: 'Managing Your Cookie Preferences' },
  { id: 'additional', label: 'Additional Information' },
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

const sectionCls = 'scroll-mt-24 border-t border-line pt-8 pb-10';

const COOKIE_PREFS_KEY = 'cookie_preferences';
const DEFAULT_PREFS = { performance: true, functional: true, marketing: false };

const loadPrefs = () => {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(COOKIE_PREFS_KEY) || '{}') };
  } catch {
    return DEFAULT_PREFS;
  }
};

const Cookies = () => {
  const [prefs, setPrefs] = useState(loadPrefs);
  const togglePref = (key) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable (private mode); the toggle still works for this visit
      }
      return next;
    });
  };
  const active = useActiveSection(tocIds);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Cookie Policy"
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
          <section id="what-are-cookies" aria-labelledby="what-h" className="scroll-mt-24 pb-10">
            <h2 id="what-h" className="t-h2 text-ink">What Are Cookies?</h2>
            <div className="mt-4 space-y-4">
              <p>
                Cookies are small text files that are stored on your device when you visit our website.
                They help us provide you with a better browsing experience by remembering your preferences
                and understanding how you use our services.
              </p>
              <p>
                This Cookie Policy explains what cookies we use, why we use them, and how you can control
                your cookie preferences. For more information about how we handle your personal information,
                please see our Privacy Policy.
              </p>
            </div>
          </section>

          <section id="types" aria-labelledby="types-h" className={sectionCls}>
            <h2 id="types-h" className="t-h2 text-ink">Types of Cookies We Use</h2>
            <div className="mt-6 space-y-8">
              {cookieTypes.map((type) => (
                <div key={type.title}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="t-h3 text-ink">{type.title}</h3>
                    <Badge variant={type.required ? 'primary' : 'outline'} size="sm">{type.required ? 'Required' : 'Optional'}</Badge>
                  </div>
                  <p className="mt-1">{type.description}</p>
                  <p className="mt-3"><strong className="font-semibold text-ink">Purpose:</strong> {type.purpose}</p>
                  <p className="mt-3 font-semibold text-ink">Examples:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-ink-3">
                    {type.examples.map((ex) => <li key={ex} className="pl-1">{ex}</li>)}
                  </ul>
                  <p className="mt-3"><strong className="font-semibold text-ink">Duration:</strong> {type.duration}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="third-party" aria-labelledby="third-h" className={sectionCls}>
            <h2 id="third-h" className="t-h2 text-ink">Third-Party Cookies</h2>
            <p className="mt-4">
              We also use cookies from third-party service providers to help us deliver our services.
              These providers are carefully selected and we only share necessary information with them.
            </p>
            <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-surface" tabIndex={0} role="region" aria-label="Third-party cookies table">
              <table className="w-full min-w-[34rem] text-left text-[0.9375rem]">
                <caption className="sr-only">Third-party cookies</caption>
                <thead className="border-b border-line">
                  <tr>
                    {['Provider', 'Purpose', 'Type', 'Duration'].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-sm font-semibold text-ink">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {thirdPartyCookies.map((c) => (
                    <tr key={c.provider}>
                      <th scope="row" className="px-4 py-3 font-medium text-ink">{c.provider}</th>
                      <td className="px-4 py-3 leading-snug">{c.purpose}</td>
                      <td className="px-4 py-3">{c.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="managing" aria-labelledby="managing-h" className={sectionCls}>
            <h2 id="managing-h" className="t-h2 text-ink">Managing Your Cookie Preferences</h2>

            <h3 className="mt-6 t-h3 text-ink">Cookie Settings</h3>
            <p className="mt-1">
              You can control your cookie preferences through our cookie consent banner or settings panel.
              Changes will take effect on your next visit.
            </p>
            <fieldset className="mt-4 rounded-lg border border-line bg-surface px-4 py-2">
              <legend className="sr-only">Cookie Settings</legend>
              {cookieChoices.map((c) => (
                <label key={c.label} className={`flex min-h-11 items-center gap-3 border-b border-line py-2 text-ink last:border-b-0 ${c.key ? 'cursor-pointer' : ''}`}>
                  {c.key ? (
                    <input type="checkbox" checked={prefs[c.key]} onChange={() => togglePref(c.key)} className="h-5 w-5 accent-[var(--ink)]" />
                  ) : (
                    <input type="checkbox" checked disabled className="h-5 w-5 accent-[var(--ink)]" />
                  )}
                  {c.label}
                </label>
              ))}
            </fieldset>

            <h3 className="mt-10 t-h3 text-ink">Browser Settings</h3>
            <p className="mt-1">
              You can also manage cookies through your browser settings.
              Here&apos;s how for popular browsers:
            </p>
            <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {manageInstructions.map((b) => (
                <div key={b.browser}>
                  <h4 className="font-semibold text-ink">{b.browser}</h4>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-[0.9375rem] marker:text-ink-3 marker:tabular-nums">
                    {b.steps.map((s) => <li key={s} className="pl-1">{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <section id="additional" aria-labelledby="additional-h" className={sectionCls}>
            <h2 id="additional-h" className="t-h2 text-ink">Additional Information</h2>
            <h3 className="mt-6 font-semibold text-ink">Cookie Updates</h3>
            <p className="mt-1">
              We may update this Cookie Policy from time to time. We will notify you of any material
              changes and obtain your consent where required by law.
            </p>
            <h3 className="mt-6 font-semibold text-ink">Contact Us</h3>
            <p className="mt-1">
              If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@audible.com" className="link">privacy@audible.com</a>.
            </p>
          </section>

          <p className="text-sm text-ink-3">
            This cookie policy was last updated on {lastUpdated}.
            For more information about our privacy practices, please see our Privacy Policy.
          </p>
        </article>
      </div>
    </div>
  );
};

export default Cookies;
