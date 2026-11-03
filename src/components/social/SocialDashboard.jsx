import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, UserPlus, Check, Lock, ArrowRight } from 'lucide-react';
import { Avatar, Waveform, Rating } from '../ui';
import { getUserData, getFriends } from '../../utils/localStorage';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';

/**
 * SocialDashboard (on Account): your social numbers as type, what you did
 * lately, where your friends are in their books, what you have unlocked.
 */

// Friends plus the stats shown on the dashboard, read once from localStorage.
const loadDashboard = () => {
  const user = getUserData();
  const friendIds = getFriends();
  const friends = usersData.filter((u) => friendIds.includes(u.id));
  const ratings = Object.values(user.ratings || {});
  const avgRating = ratings.length > 0 ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0;
  return {
    userData: user,
    friends,
    friendProgress: friends.slice(0, 3).map((friend) => ({
      ...friend,
      // Mock progress for friends without one, fixed for this visit
      progress: friend.currentProgress || Math.floor(Math.random() * 100),
      book: booksData.find((b) => b.id === friend.currentlyReading) || booksData[0],
    })),
    stats: {
      totalFriends: friends.length,
      booksCompleted: user.library?.length || 0,
      hoursListened: user.hoursListened || 0,
      clubsJoined: user.joinedClubs?.length || 0,
      averageRating: avgRating,
      streakDays: user.streakDays || 0,
    },
  };
};

const recentActivity = [
  { type: 'completed', book: 'The Three-Body Problem', daysAgo: 2, rating: 5 },
  { type: 'joined', club: 'Sci-Fi Sundays', daysAgo: 5 },
  { type: 'friend', friend: 'Sarah Chen', daysAgo: 7 },
];
const activityIcon = { completed: BookOpen, joined: Users, friend: UserPlus };

const SocialDashboard = () => {
  const [{ userData, friends, friendProgress, stats }] = useState(loadDashboard);
  if (!userData) return null;

  const achievements = [
    { title: 'First book club', description: 'Joined your first book club', unlocked: stats.clubsJoined > 0 },
    { title: 'Book lover', description: 'Finished 10 books', unlocked: stats.booksCompleted >= 10 },
    { title: 'Social butterfly', description: 'Made 5 friends', unlocked: stats.totalFriends >= 5 },
    { title: 'High scorer', description: 'Average rating above 4.5', unlocked: stats.averageRating >= 4.5 },
  ];

  const statList = [
    ['friends', stats.totalFriends],
    ['books finished', stats.booksCompleted],
    ['hours listened', stats.hoursListened],
    ['book clubs', stats.clubsJoined],
    ['average rating', stats.averageRating || '0'],
    ['day streak', stats.streakDays],
  ];

  return (
    <div className="space-y-12">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-6">
        {statList.map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="mt-1 text-[0.8125rem] text-ink-3">{label}</dt>
            <dd className="t-h1 text-ink tabular">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="sd-recent">
          <h3 id="sd-recent" className="t-h3 text-ink">Recent activity</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {recentActivity.map((a) => {
              const Icon = activityIcon[a.type];
              return (
                <li key={`${a.type}-${a.daysAgo}`} className="flex items-center gap-3 py-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-sunk text-ink-2">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] text-ink">
                      {a.type === 'completed' && <>Finished <span className="t-title-book">{a.book}</span></>}
                      {a.type === 'joined' && <>Joined {a.club}</>}
                      {a.type === 'friend' && <>Connected with {a.friend}</>}
                    </p>
                    <p className="text-[0.8125rem] text-ink-3 tabular">{a.daysAgo} days ago</p>
                  </div>
                  {a.rating && <Rating value={a.rating} size="sm" showValue={false} />}
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="sd-friends">
          <h3 id="sd-friends" className="t-h3 text-ink">Where your friends are</h3>
          {friendProgress.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-line-strong p-5 text-[0.9375rem] text-ink-2">
              No friends yet. <Link to="/clubs/friends" className="link">Find some</Link>.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {friendProgress.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-3">
                  <Avatar src={f.avatar} name={f.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] font-medium text-ink">{f.name}</p>
                    <p className="t-title-book text-sm text-ink-2 line-clamp-1">{f.book?.title || 'Unknown book'}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Waveform seed={`${f.id}-${f.book?.id}`} bars={28} height={12} progress={f.progress / 100} className="h-3 w-24 text-ink" label={`${f.progress}% listened`} />
                      <span className="text-xs text-ink-3 tabular">{f.progress}%</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {friends.length > 3 && (
            <Link to="/clubs/friends" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">All friends</Link>
          )}
        </section>
      </div>

      <section aria-labelledby="sd-ach">
        <h3 id="sd-ach" className="t-h3 text-ink">Achievements</h3>
        <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
          {achievements.map((a) => (
            <li key={a.title} className="flex items-start gap-3 border-t border-line py-3">
              <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${a.unlocked ? 'bg-ink text-paper' : 'border border-dashed border-line-strong text-ink-3'}`}>
                {a.unlocked ? <Check className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" /> : <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
              </span>
              <div>
                <p className={`font-medium ${a.unlocked ? 'text-ink' : 'text-ink-2'}`}>{a.title}<span className="sr-only">{a.unlocked ? ', unlocked' : ', locked'}</span></p>
                <p className="text-[0.8125rem] text-ink-3">{a.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Social shortcuts" className="flex flex-wrap gap-3">
        {[
          ['/clubs/friends', 'Find friends'],
          ['/clubs', 'Join clubs'],
          ['/browse?sort=trending', 'Discover'],
          ['/profile', 'Profile'],
        ].map(([to, label]) => (
          <Link key={to} to={to} className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">
            {label} <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SocialDashboard;
