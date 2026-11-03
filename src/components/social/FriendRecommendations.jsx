import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { Avatar, Rating, Skeleton } from '../ui';

/**
 * FriendRecommendations: listeners with the same taste who are on this book now,
 * each with a short note. A ruled list, no card. Values derived from the
 * listener and book ids, so they hold still between renders.
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
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Load mock users and books
        const usersResponse = await fetch('/src/data/mockUsers.json');
        const users = await usersResponse.json();

        const booksResponse = await fetch('/src/data/books.json');
        const books = await booksResponse.json();

        // Find the current book
        const currentBook = books.find((b) => b.id === bookId);

        if (!currentBook) {
          setRecommendations([]);
          setLoading(false);
          return;
        }

        // Simulate friend recommendations based on genre preferences
        const friendRecs = users
          .filter((user) => user.favoriteGenres.includes(currentBook.genre))
          .filter((user) => user.currentlyReading.includes(bookId))
          .slice(0, limit)
          .map((user) => ({
            ...user,
            rating: (4.0 + seeded(`${user.id}-${bookId}-r`) * 1).toFixed(1),
            comment: generateComment(user, currentBook),
            daysAgo: Math.floor(seeded(`${user.id}-${bookId}-d`) * 14) + 1,
            likes: Math.floor(seeded(`${user.id}-${bookId}-l`) * 20) + 5,
          }));

        setRecommendations(friendRecs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [bookId, limit]);

  if (loading) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <Skeleton variant="title" width="1/2" />
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton variant="avatar" className="h-10 w-10" />
            <div className="flex-1 space-y-2"><Skeleton width="1/3" /><Skeleton width="3/4" /></div>
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`recs-${bookId}`}>
      <h2 id={`recs-${bookId}`} className="t-h2 text-ink">Listeners who love this</h2>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        <span className="tabular">{recommendations.length}</span> people with your taste are listening now.
      </p>

      <ul className="mt-5 divide-y divide-line border-y border-line">
        {recommendations.map((friend) => (
          <li key={friend.id} className="flex gap-3 py-4">
            <Avatar src={friend.avatar} name={friend.name} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-[0.9375rem]">
                  <span className="font-semibold text-ink">{friend.name}</span>
                  <span className="ml-2 text-[0.8125rem] text-ink-3">@{friend.username}</span>
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
                  aria-label={`Helpful, ${friend.likes + (liked[friend.id] ? 1 : 0)} votes`}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 hover:bg-surface-sunk hover:text-ink ${liked[friend.id] ? 'text-ink' : ''}`}
                >
                  <ThumbsUp className={`h-3.5 w-3.5 ${liked[friend.id] ? 'fill-ink' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                  <span className="tabular">{friend.likes + (liked[friend.id] ? 1 : 0)}</span>
                </button>
                <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 hover:bg-surface-sunk hover:text-ink">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  Reply
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {recommendations.length >= limit && (
        <button type="button" className="mt-4 h-9 text-sm font-medium text-ink hover:underline underline-offset-4">
          View all {recommendations.length + 5} reviews
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
