import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import clubsData from '../../data/clubs.json';
import { getFriends } from '../../utils/localStorage';
import { Avatar, Cover, Rating, EmptyState } from '../ui';

/**
 * ActivityTab: a friends-only feed. One line per thing that happened, the
 * person on the left, the book on the right, newest first. Refreshes every minute.
 */

const generateActivities = () => {
  const friendIds = getFriends();
  const friends = usersData.filter((u) => friendIds.includes(u.id));
  const list = [];

  friends.forEach((friend) => {
    if (friend.currentlyReading) {
      const book = booksData.find((b) => b.id === friend.currentlyReading);
      if (book) {
        list.push({ id: `reading-${friend.id}`, type: 'reading', user: friend, book, timestamp: Date.now() - Math.random() * 86400000 * 3 });
      }
    }

    Object.entries(friend.ratings || {}).slice(0, 2).forEach(([bookId, rating]) => {
      const book = booksData.find((b) => b.id === bookId);
      if (book) {
        list.push({ id: `rating-${friend.id}-${bookId}`, type: 'rating', user: friend, book, rating, timestamp: Date.now() - Math.random() * 86400000 * 7 });
      }
    });

    (friend.joinedClubs || []).slice(0, 1).forEach((clubId) => {
      const club = clubsData.find((c) => c.id === clubId);
      if (club) {
        const clubBook = booksData.find((b) => b.id === club.currentBook);
        list.push({ id: `club-${friend.id}-${clubId}`, type: 'club_join', user: friend, club, book: clubBook, timestamp: Date.now() - Math.random() * 86400000 * 14 });
      }
    });
  });

  list.sort((a, b) => b.timestamp - a.timestamp);
  return list.slice(0, 25);
};

const timeAgo = (timestamp) => {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
};

const firstName = (name = '') => name.split(' ')[0];

function ActivityRow({ activity }) {
  const { user, book, club } = activity;
  const target = activity.type === 'club_join' ? `/club/${club.id}` : `/book/${book.id}`;

  return (
    <li className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-4 py-5">
      <Avatar src={user.avatar} name={user.name} size="md" />
      <div className="min-w-0">
        <p className="text-[0.9375rem] text-ink-2">
          <span className="font-semibold text-ink">{user.name}</span>
          {activity.type === 'reading' && <> is listening to </>}
          {activity.type === 'rating' && <> rated </>}
          {activity.type === 'club_join' && <> joined </>}
          {activity.type === 'club_join' ? (
            <Link to={target} className="font-semibold text-ink hover:underline underline-offset-4">{club.name}</Link>
          ) : (
            <Link to={target} className="t-title-book text-ink hover:underline underline-offset-4">{book.title}</Link>
          )}
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-ink-3">
          {activity.type === 'club_join'
            ? <>Hosted by {club.host}{book ? <>, reading <span className="t-title-book">{book.title}</span></> : null}</>
            : <>by {book.author}</>}
          <span aria-hidden="true"> · </span>
          <span className="tabular">{timeAgo(activity.timestamp)}</span>
        </p>
        {activity.type === 'rating' && (
          <Rating value={activity.rating} size="sm" className="mt-2" />
        )}
        {activity.type === 'reading' && user.currentProgress > 0 && (
          <p className="mt-1.5 text-[0.8125rem] text-ink-3 tabular">{firstName(user.name)} is {user.currentProgress}% through</p>
        )}
      </div>
      {book ? (
        <Link to={`/book/${book.id}`} className="w-12 shrink-0 rounded-sm sm:w-14" aria-label={`${book.title} details`}>
          <Cover src={book.cover} title={book.title} shadow={false} />
        </Link>
      ) : <span />}
    </li>
  );
}

export default function ActivityTab() {
  const [activities, setActivities] = useState(generateActivities);

  useEffect(() => {
    const interval = setInterval(() => setActivities(generateActivities()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) {
    return (
      <div className="pt-6">
        <EmptyState
          title="No friend activity yet"
          description="Add friends to see what they listen to, how they rate it and which clubs they join."
          action="Find friends"
          actionTo="/clubs/friends"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-12 pt-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <section aria-labelledby="feed-title" className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="feed-title" className="t-h2 text-ink">From your friends</h2>
          <p className="text-[0.8125rem] text-ink-3 tabular">{activities.length} updates, refreshed every minute</p>
        </div>
        <ul className="mt-4 divide-y divide-line border-y border-line" aria-live="polite">
          {activities.map((a) => <ActivityRow key={a.id} activity={a} />)}
        </ul>
      </section>
      <aside className="lg:pt-14">
        <div className="rounded-lg border border-line bg-surface p-5">
          <h2 className="t-h3 text-ink">Friends only</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            This feed shows what your friends listen to, the audiobooks they rate and the clubs they join. Nothing here is public.
          </p>
          <Link to="/clubs/friends" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
            Manage friends
          </Link>
        </div>
      </aside>
    </div>
  );
}
