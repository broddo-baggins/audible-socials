import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Phone, Mail, BookOpen, Play, Users, Activity, ArrowRight, X } from 'lucide-react';
import { PageHeader, Button, EmptyState } from '../components/ui';

/**
 * Support: search first, then topic chips over a ruled list of answers,
 * the ways to reach a person as rows, and further resources as links.
 */
const categories = [
  { id: 'all', name: 'All topics' },
  { id: 'account', name: 'Account and billing' },
  { id: 'playback', name: 'Playback and audio' },
  { id: 'content', name: 'Content and library' },
  { id: 'social', name: 'Social features' },
  { id: 'apps', name: 'Apps and devices' },
];

const faqs = [
  { category: 'account', question: 'How do I update my payment method?', answer: 'Go to your Account settings and select "Billing & Payments". You can add, remove, or update your payment methods there.' },
  { category: 'playback', question: 'Why is my audiobook not playing?', answer: 'Check your internet connection and ensure you have an active subscription. Try restarting the app or switching devices.' },
  { category: 'content', question: 'How do I download audiobooks for offline listening?', answer: 'Tap the download button next to any title in your Library. Downloads are available on mobile apps and some desktop platforms.' },
  { category: 'social', question: 'How do I join a book club?', answer: 'Browse available clubs in the Socials section or create your own. Click "Join" to become a member.' },
  { category: 'apps', question: 'Which devices support Audible?', answer: 'Audible works on iOS, Android, web browsers, Amazon devices, and select smart speakers.' },
  { category: 'account', question: 'How do I cancel my subscription?', answer: 'Visit your Account settings and select "Manage Subscription". You can cancel at any time with no penalties.' },
];

const contactMethods = [
  { title: 'Live chat', description: 'Get instant help from our support team', icon: MessageCircle, available: '24/7', action: 'Start chat' },
  { title: 'Phone support', description: 'Speak directly with a support specialist', icon: Phone, available: 'Mon to Fri, 9 AM to 6 PM EST', action: 'Call now', href: 'tel:18882834253' },
  { title: 'Email support', description: 'Send us a detailed message about your issue', icon: Mail, available: 'Response within 24 hours', action: 'Send email', to: '/contact' },
];

const resources = [
  { title: 'User guide', description: 'Step-by-step guides for all features', icon: BookOpen, action: 'Browse guide' },
  { title: 'Video tutorials', description: 'Visual guides and walkthroughs', icon: Play, action: 'Watch videos' },
  { title: 'Community forum', description: 'Connect with other listeners', icon: Users, action: 'Join discussion', to: '/social' },
  { title: 'System status', description: 'Check service availability', icon: Activity, action: 'View status' },
];

const suggestions = ['download issues', 'payment problems', 'account help', 'audio quality'];

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchId = useId();

  const q = searchQuery.trim().toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const filteredFaqs = faqs
    .filter((faq) => selectedCategory === 'all' || faq.category === selectedCategory)
    .filter((faq) => !words.length || words.some((w) => `${faq.question} ${faq.answer}`.toLowerCase().includes(w.replace(/s$/, ''))));

  return (
    <div className="page pb-20">
      <PageHeader
        title="Support center"
        description="Answers to common questions, help with your account, and the ways to reach our support team."
      >
        <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
          <label htmlFor={searchId} className="block text-sm font-medium text-ink mb-1.5">Search for help</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              placeholder="For example, downloads or billing"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-full border border-line-strong bg-surface pl-12 pr-12 text-base text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk">
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-3">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSearchQuery(s)}
                className="inline-flex h-8 items-center rounded-full bg-surface-sunk px-3 text-sm text-ink hover:bg-line"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      </PageHeader>

      {/* Answers */}
      <section aria-labelledby="faq-title" className="mt-6 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <div>
          <h2 id="faq-title" className="t-h2 text-ink">Common questions</h2>
          <div role="group" aria-label="Filter by topic" className="mt-5 flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-1">
            {categories.map((c) => {
              const selected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors lg:w-full lg:rounded-lg lg:px-3 ${selected ? 'bg-ink text-paper' : 'border border-line-strong text-ink hover:bg-surface lg:border-transparent'}`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {filteredFaqs.length === 0 ? (
            <EmptyState
              title="No answers match that yet"
              description="Try a different word, or show every topic. Our team can also help directly."
              action="Show all answers"
              onAction={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            />
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {filteredFaqs.map((faq) => (
                <li key={faq.question} className="py-5">
                  <h3 className="t-h3 text-ink">{faq.question}</h3>
                  <p className="mt-1.5 text-ink-2 max-w-[68ch]">{faq.answer}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/faq" className="mt-6 inline-flex items-center gap-1.5 font-medium text-ink hover:underline underline-offset-4">
            View all FAQs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* People */}
      <section aria-labelledby="need-help" className="mt-16 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:p-10">
        <h2 id="need-help" className="t-h2 text-ink">Still need help?</h2>
        <p className="mt-2 text-ink-2">Choose the best way to reach our support team.</p>
        <ul className="mt-6 divide-y divide-line border-t border-line">
          {contactMethods.map((m) => {
            const Icon = m.icon;
            const cls = 'inline-flex h-11 shrink-0 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-paper';
            return (
              <li key={m.title} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-5">
                <Icon className="hidden h-5 w-5 shrink-0 text-ink-2 sm:block" strokeWidth={1.75} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <h3 className="t-h3 text-ink">{m.title}</h3>
                  <p className="text-ink-2">{m.description}</p>
                </div>
                <p className="text-[0.8125rem] text-ink-3 sm:w-56">{m.available}</p>
                {m.to ? (
                  <Link to={m.to} className={cls}>{m.action}</Link>
                ) : m.href ? (
                  <a href={m.href} className={cls}>{m.action}</a>
                ) : (
                  <Button variant="primary" className="shrink-0">{m.action}</Button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Resources */}
      <section aria-labelledby="resources" className="mt-16 md:mt-20">
        <h2 id="resources" className="t-h2 text-ink">More resources</h2>
        <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
          {resources.map((r) => {
            const Icon = r.icon;
            const inner = (
              <>
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" strokeWidth={1.75} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{r.title}</span>
                  <span className="block text-[0.9375rem] text-ink-2">{r.description}</span>
                </span>
                <span className="shrink-0 self-center text-sm font-medium text-ink">{r.action}</span>
              </>
            );
            const cls = 'group flex w-full items-start gap-4 py-4 text-left';
            return (
              <li key={r.title} className="border-t border-line">
                {r.to ? <Link to={r.to} className={cls}>{inner}</Link> : <button type="button" className={cls}>{inner}</button>}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Support;
