import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, ArrowRight, Download, Trash2 } from 'lucide-react';
import { Button, Badge, Avatar, PageHeader } from '../components/ui';
import ListeningStats from '../components/stats/ListeningStats';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import SocialDashboard from '../components/social/SocialDashboard';

// /settings, /help and /notifications open the settings tab; the last two scroll to their section.
const TAB_FOR_PATH = { '/settings': 'settings', '/help': 'settings', '/notifications': 'settings' };
const SECTION_FOR_PATH = { '/help': 'help', '/notifications': 'notifications' };

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

/**
 * Account: your profile, your social life and your settings, as three text
 * tabs on a hairline. Profile pairs your numbers with the membership panel;
 * settings are plain divide-y lists with help at the end.
 */
const Account = () => {
  const { pathname } = useLocation();
  // The tab follows the route until you pick one; a new route resets it.
  const [picked, setPicked] = useState({ path: pathname, tab: TAB_FOR_PATH[pathname] || 'profile' });
  const activeTab = picked.path === pathname ? picked.tab : (TAB_FOR_PATH[pathname] || 'profile');
  const setActiveTab = (tab) => setPicked({ path: pathname, tab });

  useEffect(() => {
    const section = SECTION_FOR_PATH[pathname];
    if (section) {
      requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ block: 'start' }));
    }
  }, [pathname]);

  // Mock user data - replace with actual user context
  const user = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: null,
    memberSince: '2023-01-15',
    plan: 'Premium',
    credits: 2,
    creditsUsed: 10,
    renewalDate: '2025-12-12',
    hoursListened: 147,
    booksFinished: 23,
    currentStreak: 12,
    favoriteGenres: [
      { name: 'Science Fiction', count: 8 },
      { name: 'Fantasy', count: 6 },
      { name: 'Mystery', count: 5 },
      { name: 'Self Development', count: 4 },
    ],
    badges: ['completionist', 'speed_reader', 'genre_explorer', 'veteran_listener'],
  };

  // Listening stats for the component
  const listeningStats = {
    hoursListened: user.hoursListened,
    booksFinished: user.booksFinished,
    currentStreak: user.currentStreak,
    longestStreak: 45,
    favoriteGenre: 'Science Fiction',
    averageRating: 4.3,
    thisMonthHours: 18,
    thisYearBooks: 23,
  };

  const settingsSections = [
    {
      title: 'Playback',
      items: [
        { label: 'Default playback speed', value: '1.0x' },
        { label: 'Auto-skip silence', value: 'On' },
        { label: 'Remember position', value: 'On' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { label: 'New releases', value: 'On' },
        { label: 'Club updates', value: 'On' },
        { label: 'Friend activity', value: 'Off' },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { label: 'Show listening activity', value: 'Friends only' },
        { label: 'Allow friend requests', value: 'On' },
        { label: 'Profile visibility', value: 'Public' },
      ],
    },
    {
      title: 'Language and region',
      items: [
        { label: 'Language', value: 'English' },
        { label: 'Region', value: 'United States' },
      ],
    },
  ];

  const helpLinks = [
    { label: 'Frequently asked questions', to: '/faq' },
    { label: 'Contact support', to: '/contact' },
    { label: 'Terms of service', to: '/terms' },
    { label: 'Privacy policy', to: '/privacy' },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'social', label: 'Social' },
    { id: 'settings', label: 'Settings' },
  ];

  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    setActiveTab(tabs[next].id);
    document.getElementById(`account-tab-${tabs[next].id}`)?.focus();
  };

  const fmtDate = (iso, opts) => new Date(iso).toLocaleDateString('en-US', opts);

  return (
    <div className="page pb-16">
      <PageHeader title="Account" description="Your profile, membership and settings in one place.">
        <div role="tablist" aria-label="Account sections" className="flex gap-6 border-b border-line">
          {tabs.map((tab, i) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`account-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="account-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`relative h-12 text-[0.9375rem] font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                {tab.label}
                {selected && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-hl" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </PageHeader>

      <div id="account-panel" role="tabpanel" aria-labelledby={`account-tab-${activeTab}`} className="pt-4">
        {activeTab === 'profile' && (
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
            <div className="min-w-0 space-y-16">
              {/* Who you are */}
              <section aria-label="Profile" className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <Avatar src={user.avatar} name={user.name} size="xl" />
                <div className="min-w-0 flex-1">
                  <h2 className="t-h2 text-ink">{user.name}</h2>
                  <p className="mt-1 text-[0.9375rem] text-ink-2">{user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="primary">{user.plan} member</Badge>
                    <Badge variant="outline">
                      Member since {fmtDate(user.memberSince, { year: 'numeric', month: 'long' })}
                    </Badge>
                  </div>
                  <Button variant="outline" className="mt-5" leftIcon={<Settings className="h-4 w-4" strokeWidth={1.75} />}>
                    Edit profile
                  </Button>
                </div>
              </section>

              <section aria-labelledby="account-stats">
                <h2 id="account-stats" className="t-h2 mb-6 text-ink">Listening statistics</h2>
                <ListeningStats stats={listeningStats} />
              </section>

              <section aria-labelledby="account-badges">
                <h2 id="account-badges" className="t-h2 mb-6 text-ink">Achievements and badges</h2>
                <BadgeDisplay earnedBadges={user.badges} />
              </section>
            </div>

            {/* Sidebar */}
            <aside className="min-w-0 space-y-12">
              <section aria-labelledby="account-membership" className="rounded-2xl border border-line bg-surface p-6">
                <h2 id="account-membership" className="t-h3 text-ink">{user.plan} membership</h2>
                <p className="mt-1 t-meta">Renews on {fmtDate(user.renewalDate, { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-line py-5">
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1 t-meta">Credits available</dt>
                    <dd className="order-1 font-serif text-4xl font-medium leading-none text-ink tabular">{user.credits}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1 t-meta">Credits used</dt>
                    <dd className="order-1 font-serif text-4xl font-medium leading-none text-ink-2 tabular">{user.creditsUsed}</dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-3">
                  <Button fullWidth variant="primary">Upgrade plan</Button>
                  <Button fullWidth variant="outline">Manage subscription</Button>
                </div>
              </section>

              <section aria-labelledby="account-month">
                <h2 id="account-month" className="t-h3 text-ink">This month</h2>
                <dl className="mt-4 divide-y divide-line border-y border-line">
                  <div className="py-3">
                    <div className="flex items-baseline justify-between">
                      <dt className="text-[0.9375rem] text-ink-2">Hours listened</dt>
                      <dd className="font-semibold text-ink tabular">{user.hoursListened} h</dd>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                      <div className="h-full rounded-full bg-ink" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between py-3">
                    <dt className="text-[0.9375rem] text-ink-2">Books finished</dt>
                    <dd className="font-semibold text-ink tabular">{user.booksFinished}</dd>
                  </div>
                  <div className="flex items-baseline justify-between py-3">
                    <dt className="text-[0.9375rem] text-ink-2">Current streak</dt>
                    <dd className="font-semibold text-ink tabular">{user.currentStreak} days</dd>
                  </div>
                </dl>
              </section>

              <section aria-labelledby="account-genres">
                <h2 id="account-genres" className="t-h3 text-ink">Favourite genres</h2>
                <ul className="mt-4 space-y-3">
                  {user.favoriteGenres.map((genre, i) => (
                    <li key={genre.name}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className={i === 0 ? 'font-semibold text-ink' : 'text-ink-2'}>{genre.name}</span>
                        <span className="text-ink-2 tabular">{genre.count} books</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
                        <div
                          className={`h-full rounded-full ${i === 0 ? 'bg-hl ring-1 ring-inset ring-ink' : 'bg-ink'}`}
                          style={{ width: `${(genre.count / user.booksFinished) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="max-w-6xl">
            <SocialDashboard />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
            <div className="min-w-0 space-y-12">
              {settingsSections.map((section) => (
                <section key={section.title} id={slug(section.title)} aria-labelledby={`${slug(section.title)}-title`} className="scroll-mt-24">
                  <h2 id={`${slug(section.title)}-title`} className="t-h2 text-ink">{section.title}</h2>
                  <dl className="mt-4 divide-y divide-line border-y border-line">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-6 py-3.5">
                        <dt className="text-[0.9375rem] text-ink">{item.label}</dt>
                        <dd className="text-[0.9375rem] text-ink-2 tabular">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <section id="help" aria-labelledby="help-title" className="scroll-mt-24">
                <h2 id="help-title" className="t-h2 text-ink">Help and support</h2>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {helpLinks.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="group flex min-h-12 items-center justify-between gap-4 py-3 text-[0.9375rem] text-ink">
                        <span className="group-hover:underline underline-offset-4">{l.label}</span>
                        <ArrowRight className="h-4 w-4 text-ink-3 group-hover:text-ink" strokeWidth={1.75} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="min-w-0">
              <section aria-labelledby="account-actions" className="rounded-2xl border border-line bg-surface p-6">
                <h2 id="account-actions" className="t-h3 text-ink">Account actions</h2>
                <div className="mt-5 flex flex-col gap-3">
                  <Button fullWidth variant="primary">Edit profile</Button>
                  <Button fullWidth variant="outline" onClick={() => document.getElementById('privacy')?.scrollIntoView({ block: 'start' })}>Privacy settings</Button>
                  <Button fullWidth variant="outline" leftIcon={<Download className="h-4 w-4" strokeWidth={1.75} />}>Download data</Button>
                </div>
                <div className="mt-6 border-t border-line pt-5">
                  <Button fullWidth variant="outline" className="text-danger! hover:bg-danger-wash!" leftIcon={<Trash2 className="h-4 w-4" strokeWidth={1.75} />}>
                    Delete account
                  </Button>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
