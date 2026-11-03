import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import BookClubsTab from '../components/clubs/BookClubsTab';
import FriendsTab from '../components/clubs/FriendsTab';
import ActivityTab from '../components/clubs/ActivityTab';

/**
 * MyBookClubs: /clubs, /clubs/friends and /clubs/activity. The three tabs are
 * links, so each view has its own address and the back button works.
 */

const TABS = [
  { id: 'clubs', label: 'Clubs', to: '/clubs' },
  { id: 'friends', label: 'Friends', to: '/clubs/friends' },
  { id: 'activity', label: 'Activity', to: '/clubs/activity' },
];

const deriveActiveTab = (pathname) => {
  if (pathname.startsWith('/clubs/friends')) return 'friends';
  if (pathname.startsWith('/clubs/activity')) return 'activity';
  return 'clubs';
};

const descriptions = {
  clubs: 'Read the same book as other listeners, then talk about it live.',
  friends: 'The people you listen with, and the people they listen with.',
  activity: 'What your friends are listening to, rating and joining.',
};

export default function MyBookClubs() {
  const { pathname } = useLocation();
  const activeTab = deriveActiveTab(pathname);

  return (
    <div className="page pb-20">
      <PageHeader title="Book clubs" description={descriptions[activeTab]}>
        <nav aria-label="Book club sections">
          <div role="tablist" className="flex gap-6 border-b border-line md:gap-8">
            {TABS.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <Link
                  key={tab.id}
                  to={tab.to}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="clubs-panel"
                  className={`relative -mb-px inline-flex h-11 items-center text-[0.9375rem] font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                >
                  {tab.label}
                  {selected && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </PageHeader>

      <div id="clubs-panel" role="tabpanel" aria-label={TABS.find((t) => t.id === activeTab)?.label} key={activeTab} className="animate-fade-in pt-2">
        {activeTab === 'clubs' && <BookClubsTab />}
        {activeTab === 'friends' && <FriendsTab />}
        {activeTab === 'activity' && <ActivityTab />}
      </div>
    </div>
  );
}
