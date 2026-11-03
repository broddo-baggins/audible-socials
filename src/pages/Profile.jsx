import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Crown, Settings, LogOut, Check, ArrowRight } from 'lucide-react';
import { getUserData, getJoinedClubs, getFriends, setPremium, signOut } from '../utils/localStorage';
import clubsData from '../data/clubs.json';
import usersData from '../data/users.json';
import booksData from '../data/books.json';
import PrivacySettings from '../components/settings/PrivacySettings';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import ListeningStats from '../components/stats/ListeningStats';
import PremiumBadge from '../components/shared/PremiumBadge';
import { Avatar, Cover, EmptyState, Skeleton } from '../components/ui';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'stats', label: 'Stats' },
  { id: 'badges', label: 'Badges' },
  { id: 'settings', label: 'Settings' },
];

/**
 * Profile: who you are on Listenable. A left-aligned header with your
 * numbers and credits, text tabs on a hairline, then clubs, friends and
 * membership on paper.
 */
const bookById = Object.fromEntries(booksData.map((b) => [b.id, b]));

export default function Profile() {
  const [userData, setUserData] = useState(getUserData);
  const [joinedClubs] = useState(() => {
    const clubIds = getJoinedClubs();
    return clubsData.filter(club => clubIds.includes(club.id));
  });
  const [friends] = useState(() => {
    const friendIds = getFriends();
    return usersData.filter(u => friendIds.includes(u.id));
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.hash === '#privacy' ? 'settings' : 'overview');

  const changePlan = (premium) => {
    if (!premium && !window.confirm('Cancel your Premium membership?')) return;
    setPremium(premium);
    setUserData(getUserData());
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!userData) {
    return (
      <div className="page pt-8 md:pt-12" aria-busy="true">
        <span className="sr-only">Loading your profile</span>
        <div className="flex items-center gap-5">
          <Skeleton variant="avatar" className="h-20 w-20" />
          <div className="flex-1 space-y-3"><Skeleton variant="title" width="1/3" /><Skeleton width="1/4" /></div>
        </div>
        <div className="mt-10 h-12 border-b border-line" />
        <div className="mt-8 space-y-4"><Skeleton variant="card" /><Skeleton variant="card" /></div>
      </div>
    );
  }

  const maxClubs = userData.isPremium ? 3 : 2;
  const displayName = userData.name === 'You' ? 'Your profile' : userData.name;

  // The stats tab draws from the numbers stored on your account.
  const s = userData.stats || {};
  const listeningStats = {
    hoursListened: s.totalHoursListened || 0,
    booksFinished: s.booksCompleted || 0,
    currentStreak: s.currentStreak || 0,
    longestStreak: Math.max(s.longestStreak || 0, s.currentStreak || 0),
    favoriteGenre: s.favoriteGenre || 'Not set',
    thisYearBooks: s.booksCompleted || 0,
  };

  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setActiveTab(TABS[next].id);
    document.getElementById(`profile-tab-${TABS[next].id}`)?.focus();
  };

  return (
    <div className="page pb-16">
      {/* Header */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Avatar src={userData.avatar} name={userData.name} size="xl" />
              {userData.isPremium && (
                <span className="absolute -bottom-1 -right-1"><PremiumBadge size="sm" showText={false} /></span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="t-h1 text-ink">{displayName}</h1>
                {userData.isPremium && <PremiumBadge size="md" />}
              </div>
              <p className="mt-2 text-[0.9375rem] text-ink-2 tabular">
                {userData.library.length} books · {friends.length} friends · {joinedClubs.length} clubs
              </p>
            </div>
          </div>

          <div className="flex items-end gap-6">
            <div>
              <p className="font-serif text-4xl font-medium leading-none text-ink tabular">{userData.credits}</p>
              <p className="mt-1.5 t-meta">Credits available</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-surface"
              aria-label="Profile settings"
            >
              <Settings className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-16 z-30 -mx-4 bg-paper px-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12">
        <div role="tablist" aria-label="Profile sections" className="flex gap-6 overflow-x-auto border-b border-line scrollbar-hide">
          {TABS.map((tab, i) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="profile-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`relative h-12 shrink-0 text-[0.9375rem] font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                {tab.label}
                {selected && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-hl" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <div id="profile-panel" role="tabpanel" aria-labelledby={`profile-tab-${activeTab}`} className="pt-10">
        {activeTab === 'overview' && (
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
            <div className="min-w-0 space-y-14">
              {/* Book clubs */}
              <section aria-labelledby="profile-clubs">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="profile-clubs" className="t-h2 text-ink">My book clubs</h2>
                  <Link to="/clubs" className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4">
                    All clubs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                </div>

                {joinedClubs.length === 0 ? (
                  <EmptyState
                    className="mt-5"
                    title="No clubs yet"
                    description="Clubs read the same book and meet to talk about it."
                    action="Explore clubs"
                    actionTo="/clubs"
                  />
                ) : (
                  <>
                    <ul className="mt-5 divide-y divide-line border-y border-line">
                      {joinedClubs.map((club) => {
                        const book = bookById[club.currentBook];
                        return (
                          <li key={club.id}>
                            <Link to={`/club/${club.id}`} className="group flex items-center gap-4 py-4">
                              <div className="w-11 shrink-0"><Cover src={book?.cover} title={book?.title} shadow={false} /></div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-ink group-hover:underline underline-offset-4">{club.name}</p>
                                <p className="text-[0.8125rem] text-ink-2 line-clamp-1">
                                  Hosted by {club.host}{book && <> · Reading <span className="t-title-book">{book.title}</span></>}
                                </p>
                              </div>
                              <div className="shrink-0 text-right text-[0.8125rem]">
                                {club.daysRemaining != null && <p className="font-semibold text-ink">{club.daysRemaining} days left</p>}
                                <p className="text-ink-3">{club.memberCount.toLocaleString()} members</p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-3 text-[0.8125rem] text-ink-3">You are in {joinedClubs.length} of {maxClubs} clubs.</p>
                  </>
                )}
              </section>

              {/* Friends */}
              <section aria-labelledby="profile-friends">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="profile-friends" className="t-h2 text-ink">Friends</h2>
                  <Link to="/clubs/friends" className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4">
                    All friends <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                </div>

                {friends.length === 0 ? (
                  <EmptyState
                    className="mt-5"
                    title="No friends added"
                    description="Add friends to see what they listen to and share your progress."
                    action="Find friends"
                    actionTo="/clubs/friends"
                  />
                ) : (
                  <ul className="mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                    {friends.slice(0, 6).map((friend) => (
                      <li key={friend.id} className="border-b border-line">
                        <Link to={`/friend/${friend.id}/library`} className="group flex items-center gap-3 py-3.5">
                          <span className="relative">
                            <Avatar src={friend.avatar} name={friend.name} size="md" />
                            {friend.isPremium && <span className="absolute -bottom-1 -right-1"><PremiumBadge size="sm" showText={false} /></span>}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-ink group-hover:underline underline-offset-4">{friend.name}</span>
                            <span className="block text-[0.8125rem] text-ink-3 tabular">{friend.library.length} books</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Membership */}
            <aside aria-labelledby="profile-membership" className="min-w-0">
              <h2 id="profile-membership" className="t-h2 text-ink">Membership</h2>

              {userData.isPremium ? (
                <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden="true" />
                    <h3 className="t-h3 text-ink">Premium member</h3>
                  </div>
                  <p className="mt-2 text-[0.9375rem] text-ink-2">Unlimited access to premium book clubs and exclusive content.</p>
                  <button type="button" onClick={() => changePlan(false)} className="mt-5 inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-paper">
                    Manage
                  </button>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
                  <h3 className="t-h3 text-ink">Upgrade to Premium</h3>
                  <p className="mt-2 text-[0.9375rem] text-ink-2">Premium clubs, author events and more credits.</p>
                  <ul className="mt-5 space-y-2.5">
                    {['Join up to 3 book clubs, not 2', 'Premium-only clubs', 'Exclusive author events'].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => changePlan(true)} className="mt-6 inline-flex h-12 items-center rounded-full bg-hl px-6 text-[0.9375rem] font-medium text-ink hover:bg-[#D6E43F]">
                    Upgrade now
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'stats' && <ListeningStats stats={listeningStats} />}

        {activeTab === 'badges' && <BadgeDisplay />}

        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-10">
            <PrivacySettings />

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-danger hover:bg-danger-wash"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
