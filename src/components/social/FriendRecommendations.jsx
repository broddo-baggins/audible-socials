import { useMemo, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Rating } from '../ui';
import users from '../../data/users.json';
import books from '../../data/books.json';
import { getFriends } from '../../utils/localStorage';

/**
 * FriendRecommendations: the user's friends who have this book, each with a
 * short note. A ruled list, no card. Values derived from the friend and book
 * ids, so they hold still between renders.
 */
const seeded = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
};

const generateComment = (user, book) => {
  const genre = book.genre.toLowerCase();
  const comments = [
    `A ${genre} story I could not stop listening to.`,
    'The narrator really brings this one to life.',
    `One of the best ${genre} books I have listened to this year.`,
    'Fantastic world-building and characters you care about.',
    'It kept me hooked from start to finish.',
    `Made for fans of ${genre}. You will not be disappointed.`,
    'The turns in the plot are very well done.',
    'I keep recommending this to everyone.',
  ];
  return comments[Math.floor(seeded(`${user.id}-${book.id}-c`) * comments.length)];
};

const FriendRecommendations = ({ bookId, limit = 5 }) => {
  const [showAll, setShowAll] = useState(false);
  const [liked, setLiked] = useState({});

  const allRecommendations = useMemo(() => {
    const currentBook = books.find((b) => b.id === bookId);
    if (!currentBook) return [];
    const friendIds = getFriends();

    // The user's friends who own or are listening to this book
    return users
      .filter((user) => friendIds.includes(user.id))
      .filter((user) => user.library?.includes(bookId) || user.currentlyReading === bookId)
      .map((user) => ({
        ...user,
        rating: Number(user.ratings?.[bookId] ?? 4.0 + seeded(`${user.id}-${bookId}-r`)).toFixed(1),
        comment: generateComment(user, currentBook),
        daysAgo: Math.floor(seeded(`${user.id}-${bookId}-d`) * 14) + 1,
        likes: Math.floor(seeded(`${user.id}-${bookId}-l`) * 20) + 5,
      }));
  }, [bookId]);
  const recommendations = showAll ? allRecommendations : allRecommendations.slice(0, limit);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`recs-${bookId}`}>
      <h2 id={`recs-${bookId}`} className="t-h2 text-ink">Friends who love this</h2>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        <span className="tabular">{allRecommendations.length}</span> of your friends {allRecommendations.length === 1 ? 'has' : 'have'} this book.
      </p>

      <ul className="mt-5 divide-y divide-line border-y border-line">
        {recommendations.map((friend) => {
          const likes = friend.likes + (liked[friend.id] ? 1 : 0);
          return (
            <li key={friend.id} className="flex gap-3 py-4">
              <Avatar src={friend.avatar} name={friend.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-[0.9375rem]">
                    <Link
                      to={`/friend/${friend.id}/library`}
                      className="font-semibold text-ink hover:underline underline-offset-4"
                    >
                      {friend.name}
                    </Link>
                    <span className="ml-2 text-[0.8125rem] text-ink-3">Your friend</span>
                  </p>
                  <Rating value={parseFloat(friend.rating)} size="sm" showValue />
                </div>
                <p className="mt-1 text-[0.9375rem] text-ink-2">{friend.comment}</p>
                <div className="mt-1 flex items-center gap-1 text-[0.8125rem] text-ink-3">
                  <span className="mr-2 tabular">{friend.daysAgo}d ago</span>
                  <button
                    type="button"
                    onClick={() => setLiked((p) => ({ ...p, [friend.id]: !p[friend.id] }))}
                    aria-pressed={Boolean(liked[friend.id])}
                    // The visible count is part of the name, so voice users can say what they see
                    aria-label={`${likes} likes, like ${friend.name}'s review`}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 hover:bg-surface-sunk hover:text-ink ${liked[friend.id] ? 'text-ink' : ''}`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${liked[friend.id] ? 'fill-ink' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                    <span className="tabular">{likes}</span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {!showAll && allRecommendations.length > limit && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 h-9 text-sm font-medium text-ink hover:underline underline-offset-4"
        >
          View all {allRecommendations.length} friend reviews
        </button>
      )}
    </section>
  );
};

FriendRecommendations.propTypes = {
  bookId: PropTypes.string.isRequired,
  limit: PropTypes.number,
};

export default FriendRecommendations;
