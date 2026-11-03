import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { PageHeader, Button, EmptyState } from '../components/ui';

/**
 * FAQ: a search field, a topic index, and an accessible accordion per topic.
 * Each question is a real button with aria-expanded and aria-controls; its
 * answer is a labelled region.
 */
const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting started',
    faqs: [
      { id: 'what-is-audible', question: 'What is Audible?', answer: 'Audible is the world\'s largest audio entertainment service, offering audiobooks, podcasts, and original audio content. With over 425,000 titles available, you can listen to books on your phone, tablet, computer, or smart speaker.' },
      { id: 'how-to-sign-up', question: 'How do I sign up for Audible?', answer: 'Visit audible.com and click "Start your free trial". Choose your plan, enter your payment information, and start listening immediately. You get one free audiobook with your trial.' },
      { id: 'trial-info', question: 'What\'s included in the free trial?', answer: 'Your free trial includes one audiobook credit, access to all Audible channels, and the ability to listen to any title in our catalog. You can cancel anytime during your trial period.' },
    ],
  },
  {
    id: 'account-billing',
    title: 'Account and billing',
    faqs: [
      { id: 'payment-methods', question: 'What payment methods do you accept?', answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and digital payment methods like Apple Pay and Google Pay.' },
      { id: 'cancel-subscription', question: 'How do I cancel my subscription?', answer: 'You can cancel your subscription anytime from your Account settings. Go to "Manage Subscription" and select "Cancel Membership". You\'ll continue to have access until the end of your billing period.' },
      { id: 'refund-policy', question: 'What is your refund policy?', answer: 'If you\'re not satisfied with your purchase, you can return any audiobook within 365 days for a full refund, provided you have less than 50% of the title remaining.' },
    ],
  },
  {
    id: 'listening-playback',
    title: 'Listening and playback',
    faqs: [
      { id: 'download-books', question: 'How do I download audiobooks?', answer: 'On mobile apps, tap the download icon next to any title in your Library. Downloads are available for offline listening. Note that some titles may have DRM restrictions.' },
      { id: 'playback-speed', question: 'Can I change the playback speed?', answer: 'Yes. You can adjust playback speed from 0.5x to 3.0x in the player settings. This helps you listen at your preferred pace.' },
      { id: 'multiple-devices', question: 'Can I listen on multiple devices?', answer: 'Yes, you can listen on up to 16 different devices with one account. Your listening progress syncs automatically across all devices.' },
    ],
  },
  {
    id: 'social-features',
    title: 'Social features',
    faqs: [
      { id: 'book-clubs', question: 'How do book clubs work?', answer: 'Book clubs allow you to discuss audiobooks with other listeners. Join existing clubs or create your own. Share thoughts, ask questions, and connect with fellow readers.' },
      { id: 'friend-activity', question: 'Can I see what my friends are listening to?', answer: 'Yes. Connect with friends and see their listening activity in your social feed. You can also share your own listening progress and recommendations.' },
      { id: 'privacy-settings', question: 'How do I control my privacy settings?', answer: 'Go to Account Settings > Privacy to control who can see your listening activity, friend requests, and profile information. You have full control over your privacy.' },
    ],
  },
  {
    id: 'apps-devices',
    title: 'Apps and devices',
    faqs: [
      { id: 'supported-devices', question: 'Which devices support Audible?', answer: 'Audible works on iOS and Android devices, web browsers, Amazon Echo devices, Sonos speakers, and select smart TVs. Check our device compatibility page for the full list.' },
      { id: 'app-features', question: 'What features are available in the mobile app?', answer: 'Mobile apps include offline downloads, background playback, sleep timers, bookmarks, and social features. All premium features are available across platforms.' },
      { id: 'sync-progress', question: 'Does my progress sync between devices?', answer: 'Yes. Your bookmarks, playback position, and listening history automatically sync across all your devices when you\'re connected to the internet.' },
    ],
  },
  {
    id: 'technical-support',
    title: 'Technical support',
    faqs: [
      { id: 'audio-quality', question: 'What audio quality options are available?', answer: 'We offer multiple quality settings: Standard (64 kbps), High (128 kbps), and Enhanced (256 kbps). Higher quality uses more data and storage space.' },
      { id: 'troubleshooting', question: 'My app isn\'t working. What should I do?', answer: 'Try restarting the app, checking your internet connection, or updating to the latest version. If issues persist, contact our support team with details about your device and the problem.' },
      { id: 'account-security', question: 'How do I keep my account secure?', answer: 'Use a strong password, enable two-factor authentication, and never share your login credentials. Regularly review your account activity in the security settings.' },
    ],
  },
];

const AccordionItem = ({ faq, open, onToggle, category }) => {
  const btnId = `faq-q-${faq.id}`;
  const panelId = `faq-a-${faq.id}`;
  return (
    <li>
      <h3>
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
        >
          <span>
            {category && <span className="t-meta mb-1 block">{category}</span>}
            <span className="text-[1.0625rem] font-semibold text-ink group-hover:underline underline-offset-4 decoration-1">{faq.question}</span>
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-ink-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open} className="pb-5">
        <p className="max-w-[68ch] leading-[1.7] text-ink-2">{faq.answer}</p>
      </div>
    </li>
  );
};

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const searchId = useId();

  const toggleExpanded = (id) => {
    const next = new Set(expandedItems);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedItems(next);
  };

  const allFaqs = faqCategories.flatMap((category) =>
    category.faqs.map((faq) => ({ ...faq, category: category.title }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  const clearSearch = () => {
    setSearchQuery('');
    setExpandedItems(new Set());
  };

  return (
    <div className="page pb-20">
      <PageHeader
        title="Frequently asked questions"
        description={<>Quick answers to common questions. Cannot find what you are looking for? Visit the <Link to="/support" className="link">support center</Link> or <Link to="/contact" className="link">contact our team</Link>.</>}
      >
        <div className="max-w-2xl">
          <label htmlFor={searchId} className="block text-sm font-medium text-ink mb-1.5">Search FAQs</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              placeholder="For example, refunds or playback speed"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-full border border-line-strong bg-surface pl-12 pr-12 text-base text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} aria-label="Clear search" className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk">
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      </PageHeader>

      {searchQuery ? (
        <section aria-labelledby="results" className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="results" className="t-h2 text-ink" aria-live="polite">
              <span className="tabular">{filteredFaqs.length}</span> {filteredFaqs.length === 1 ? 'result' : 'results'}
            </h2>
            <Button variant="outline" onClick={clearSearch}>Clear search</Button>
          </div>
          {filteredFaqs.length === 0 ? (
            <EmptyState
              className="mt-6"
              title={`Nothing matches "${searchQuery}"`}
              description="Try another word, or ask our support team directly."
              action="Contact support"
              actionTo="/contact"
            />
          ) : (
            <ul className="mt-6 max-w-4xl divide-y divide-line border-y border-line">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} faq={faq} category={faq.category} open={expandedItems.has(faq.id)} onToggle={() => toggleExpanded(faq.id)} />
              ))}
            </ul>
          )}
        </section>
      ) : (
        <div className="mt-4 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Topics" className="lg:sticky lg:top-24 lg:self-start">
            <p className="t-label text-ink-3">Topics</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-0">
              {faqCategories.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="inline-flex h-9 items-center rounded-full border border-line-strong px-3.5 text-sm text-ink hover:bg-surface lg:h-auto lg:rounded-none lg:border-0 lg:px-0 lg:py-1.5 lg:text-[0.9375rem] lg:text-ink-2 lg:hover:bg-transparent lg:hover:text-ink lg:hover:underline underline-offset-4">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-4xl space-y-12">
            {faqCategories.map((category) => (
              <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-24">
                <h2 id={`${category.id}-title`} className="t-h2 text-ink">{category.title}</h2>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {category.faqs.map((faq) => (
                    <AccordionItem key={faq.id} faq={faq} open={expandedItems.has(faq.id)} onToggle={() => toggleExpanded(faq.id)} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}

      <section aria-labelledby="still" className="mt-16 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 id="still" className="t-h2 text-ink">Still have questions?</h2>
          <p className="mt-2 text-ink-2">Our support team is here to help, one person at a time.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-medium text-paper hover:bg-gray-800">Contact support</Link>
          <Link to="/support" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium text-ink hover:bg-paper">Visit support center</Link>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
