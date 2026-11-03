import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TrendingUp, ThumbsUp } from 'lucide-react';
import { Avatar, Cover, Rating, Waveform, EmptyState } from '../ui';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import { getFriends } from '../../utils/localStorage';

/**
 * SocialNudges: a short feed of what friends are doing, one ruled row each:
 * who, what, the book cover at the edge, and one thing to do about it.
 */

const buildNudges = (limit) => {
  const friendIds = getFriends();
  const friends = usersData.filter((u) => friendIds.includes(u.id));
  // With no friends yet, show sample listeners so the feed explains itself
  const users = friends.length > 0 ? friends : usersData.slice(0, 5);
  const books = booksData;
  const out = [];

  users.slice(0, 3).forEach((user, idx) => {
    const book = user.currentlyReading ? books.find((b) => b.id === user.currentlyReading) : books[idx % books.length];
    if (book) {
      out.push({
        type: 'friends_listening', verb: 'is listening to', book, user,
        progress: user.currentProgress || Math.floor(Math.random() * 80) + 10,
        action: 'Listen too', timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
      });
    }
  });

  users.slice(0, 2).forEach((user, idx) => {
    const ids = Object.keys(user.ratings || {});
    if (ids.length > 0) {
      const bookId = ids[idx % ids.length];
      const book = books.find((b) => b.id === bookId);
      const rating = user.ratings[bookId];
      if (book && rating >= 4) {
        out.push({ type: 'friend_rating', verb: 'rated', book, user, rating, action: 'See details', timestamp: `${Math.floor(Math.random() * 48) + 1}h ago` });
      }
    }
  });

  if (users.length > 2) {
    out.push({
      type: 'completed', verb: 'just finished', book: books[Math.floor(Math.random() * Math.min(10, books.length))], user: users[2],
      action: 'Congratulate', timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
    });
  }

  out.push({
    type: 'trending', verb: 'Trending among your friends', book: books.find((b) => b.genre === 'Science Fiction') || books[0],
    stat: `${Math.floor(Math.random() * 10) + 3} friends listening`, action: 'Explore', timestamp: 'This week',
  });

  return out.sort(() => Math.random() - 0.5).slice(0, limit).map((n, i) => ({ ...n, key: `${n.type}-${n.user?.id || 'all'}-${n.book?.id}-${i}` }));
};

const SocialNudges = ({ limit = 3 }) => {
  const [nudges] = useState(() => {
    try {
      return buildNudges(limit);
    } catch (error) {
      console.error('Failed to load social nudges:', error);
      return [];
    }
  });
  const [liked, setLiked] = useState([]);

  if (nudges.length === 0) {
    return <EmptyState title="Nothing from friends yet" description="When friends listen, rate or finish a book, it shows up here." action="Find friends" actionTo="/clubs/friends" />;
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {nudges.map((n) => {
        const isLiked = liked.includes(n.key);
        return (
          <li key={n.key} className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4 py-5">
            {n.user ? (
              <Avatar src={n.user.avatar} name={n.user.name} size="md" />
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunk text-ink-2">
                <TrendingUp className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
              </span>
            )}

            <div className="min-w-0">
              <p className="text-[0.9375rem] text-ink-2">
                {n.user && <span className="font-semibold text-ink">{n.user.name} </span>}
                {n.verb}
                <span className="text-ink-3"> · {n.timestamp}</span>
              </p>
              {n.book && (
                <Link to={`/book/${n.book.id}`} className="t-title-book mt-0.5 block text-lg text-ink line-clamp-1 hover:underline underline-offset-4 decoration-1">
                  {n.book.title}
                </Link>
              )}

              {n.rating && <Rating value={n.rating} size="sm" className="mt-1.5" />}
              {n.progress !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <Waveform seed={`${n.user?.id}-${n.book?.id}`} bars={36} height={14} progress={n.progress / 100} className="h-3.5 w-32 text-ink" label={`${n.progress}% listened`} />
                  <span className="text-[0.8125rem] text-ink-3 tabular">{n.progress}%</span>
                </div>
              )}
              {n.stat && <p className="mt-1 text-[0.8125rem] text-ink-3 tabular">{n.stat}</p>}

              <div className="mt-2 flex items-center gap-4">
                <Link to={n.book ? `/book/${n.book.id}` : '/browse'} className="inline-flex min-h-9 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
                  {n.action}
                </Link>
                {n.type === 'friend_rating' && (
                  <button
                    type="button"
                    onClick={() => setLiked((prev) => (isLiked ? prev.filter((k) => k !== n.key) : [...prev, n.key]))}
                    aria-pressed={isLiked}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 text-sm ${isLiked ? 'font-medium text-ink' : 'text-ink-2 hover:text-ink'}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-hl' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                )}
              </div>
            </div>

            {n.book ? (
              <Link to={`/book/${n.book.id}`} className="w-14 shrink-0 rounded-sm sm:w-16" aria-label={`${n.book.title} details`}>
                <Cover src={n.book.cover} title={n.book.title} author={n.book.author} />
              </Link>
            ) : <span />}
          </li>
        );
      })}
    </ul>
  );
};

SocialNudges.propTypes = {
  limit: PropTypes.number,
};

export default SocialNudges;
