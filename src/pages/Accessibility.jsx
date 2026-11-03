import { Link } from 'react-router-dom';
import { Volume2, Eye, Keyboard, Smartphone, Check, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui';

/**
 * Accessibility: a statement, then what is supported (a two-by-two list),
 * the player in detail (ruled rows), our commitments and where to get help.
 */
const accessibilityFeatures = [
  { title: 'Screen reader support', description: 'Full compatibility with popular screen readers including JAWS, NVDA, VoiceOver and TalkBack.', icon: Volume2, details: ['Proper ARIA labels and landmarks', 'Semantic HTML structure', 'Keyboard navigation support', 'Dynamic content announcements'] },
  { title: 'Visual accessibility', description: 'Options for people with visual impairments or colour vision deficiencies.', icon: Eye, details: ['High contrast mode available', 'Adjustable text sizes', 'Colour-blind friendly colour schemes', 'Screen magnification support'] },
  { title: 'Keyboard navigation', description: 'Complete functionality through the keyboard alone, following WCAG 2.1 guidelines.', icon: Keyboard, details: ['All interactive elements keyboard accessible', 'Logical tab order', 'Keyboard shortcuts for common actions', 'Focus indicators always visible'] },
  { title: 'Mobile accessibility', description: 'Built for every mobile device, with assistive technology support.', icon: Smartphone, details: ['Touch target sizes meet minimum requirements', 'Gesture alternatives available', 'Voice control compatibility', 'Switch control support'] },
];

const audioFeatures = [
  { title: 'Playback controls', description: 'Audio player controls designed with accessibility in mind.', features: ['Large, clearly labeled buttons', 'Playback speed adjustment (0.5x to 3.0x)', 'Sleep timer functionality', 'Bookmark and skip features', 'Resume playback from last position'] },
  { title: 'Audio quality options', description: 'Quality settings to suit different needs and preferences.', features: ['Standard quality (64 kbps)', 'High quality (128 kbps)', 'Enhanced quality (256 kbps)', 'Offline download capability', 'Background playback support'] },
  { title: 'Content navigation', description: 'Easy movement through audio with accessible controls.', features: ['Chapter navigation', 'Time-based seeking', 'Progress indicators', 'Content summaries available', 'Search within titles'] },
];

const commitments = [
  { title: 'WCAG 2.1 AA compliance', description: 'We strive to meet or exceed WCAG 2.1 AA guidelines across all our digital platforms.' },
  { title: 'Continuous improvement', description: 'Regular accessibility audits and user testing to find and remove barriers.' },
  { title: 'Inclusive design', description: 'Accessibility considered in every new feature and design decision.' },
  { title: 'User feedback', description: 'We actively seek and act on feedback from people with disabilities.' },
];

const resources = [
  { title: 'Accessibility settings', description: 'How to set up Listenable for your needs.', to: '/settings' },
  { title: 'Supported assistive technologies', description: 'The assistive technologies Listenable works with.', to: '#features' },
  { title: 'Keyboard shortcuts', description: 'A complete guide to keyboard navigation and shortcuts.', to: '#player' },
  { title: 'Contact the accessibility team', description: 'Get in touch with our accessibility support team.', to: '/contact' },
];

const CheckList = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-2">
        <Check className="mt-1 h-4 w-4 shrink-0 text-ink" strokeWidth={2} aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const AccessibilityPage = () => (
  <div className="page pb-20">
    <PageHeader
      title="Accessibility at Listenable"
      description="We are committed to making audio accessible to everyone. The platform is designed so that people with disabilities can use all of it."
    />

    {/* Statement */}
    <section aria-labelledby="mission" className="grid gap-6 border-t border-line pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-12">
      <h2 id="mission" className="t-h2 text-ink">Our accessibility mission</h2>
      <p className="font-serif text-[1.25rem] leading-[1.55] text-ink md:text-[1.5rem]">
        We believe stories have the power to connect, inspire and transform lives. That is why everyone, regardless of
        ability, should be able to reach our library of audiobooks, podcasts and original content. Accessibility is not
        a feature for us; it is a basic part of serving every listener.
      </p>
    </section>

    {/* Features */}
    <section id="features" aria-labelledby="features-title" className="mt-16 scroll-mt-24 md:mt-20">
      <h2 id="features-title" className="t-h2 text-ink">Accessibility features</h2>
      <p className="mt-2 text-ink-2">Support across all platforms and devices.</p>
      <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {accessibilityFeatures.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="border-t border-ink pt-5">
              <div className="flex items-center gap-2.5">
                <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="t-h3 text-ink">{f.title}</h3>
              </div>
              <p className="mt-2 mb-4 text-ink-2">{f.description}</p>
              <CheckList items={f.details} />
            </div>
          );
        })}
      </div>
    </section>

    {/* Player */}
    <section id="player" aria-labelledby="player-title" className="mt-16 scroll-mt-24 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:p-10">
      <h2 id="player-title" className="t-h2 text-ink">Audio experience features</h2>
      <p className="mt-2 text-ink-2">Features made for accessible listening.</p>
      <ul className="mt-6 divide-y divide-line border-t border-line">
        {audioFeatures.map((s) => (
          <li key={s.title} className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
            <div>
              <h3 className="t-h3 text-ink">{s.title}</h3>
              <p className="mt-1 text-ink-2">{s.description}</p>
            </div>
            <CheckList items={s.features} />
          </li>
        ))}
      </ul>
    </section>

    {/* Commitments */}
    <section aria-labelledby="commitments" className="mt-16 md:mt-20">
      <h2 id="commitments" className="t-h2 text-ink">Our commitments</h2>
      <p className="mt-2 text-ink-2">How accessibility stays at the centre of what we do.</p>
      <ol className="mt-6 grid border-t border-line md:grid-cols-2 md:gap-x-12">
        {commitments.map((c, i) => (
          <li key={c.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-line py-5">
            <span className="font-serif text-lg text-ink-3 tabular" aria-hidden="true">{i + 1}</span>
            <div>
              <h3 className="font-semibold text-ink">{c.title}</h3>
              <p className="mt-1 text-ink-2">{c.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    {/* Resources and help */}
    <section aria-labelledby="resources" className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <h2 id="resources" className="t-h2 text-ink">Resources and support</h2>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {resources.map((r) => {
            const content = (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{r.title}</span>
                  <span className="block text-[0.9375rem] text-ink-2">{r.description}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-2" strokeWidth={1.75} aria-hidden="true" />
              </>
            );
            const cls = 'group flex items-center gap-4 py-4';
            return (
              <li key={r.title}>
                {r.to.startsWith('#') ? <a href={r.to} className={cls}>{content}</a> : <Link to={r.to} className={cls}>{content}</Link>}
              </li>
            );
          })}
        </ul>
      </div>
      <aside aria-labelledby="need-help" className="self-start rounded-2xl bg-surface-sunk p-6 md:p-8">
        <h2 id="need-help" className="t-h2 text-ink">Need help with accessibility?</h2>
        <p className="mt-2 text-ink-2">Our accessibility team is here to help you get the most from Listenable.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">Contact the team</Link>
          <Link to="/faq" className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">Read the FAQ</Link>
        </div>
      </aside>
    </section>
  </div>
);

export default AccessibilityPage;
