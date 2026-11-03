import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getFriends } from '../../utils/localStorage';
import { Avatar, Rating } from '../ui';
import usersData from '../../data/users.json';

/**
 * FriendRatingsOnBook: how the people you follow rated this book. The friends'
 * average as a big serif number, then one ruled row per friend.
 */
export default function FriendRatingsOnBook({ bookId }) {
  // Derived from stored friends and static user data on each render
  const friendIds = getFriends();
  const friendRatings = usersData
    .filter((u) => friendIds.includes(u.id))
    .filter((friend) => friend.ratings?.[bookId] && friend.privacySettings?.shareRatings)
    .map((friend) => ({ friend, rating: friend.ratings[bookId] }))
    .sort((a, b) => b.rating - a.rating);

  if (friendRatings.length === 0) {
    return null;
  }

  const avgRating = (friendRatings.reduce((sum, r) => sum + r.rating, 0) / friendRatings.length).toFixed(1);

  return (
    <section aria-labelledby={`friend-ratings-${bookId}`}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 id={`friend-ratings-${bookId}`} className="t-h2 text-ink">What your friends think</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            {friendRatings.length} {friendRatings.length > 1 ? 'friends' : 'friend'} rated this book
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-serif text-[2.5rem] font-medium leading-none text-ink tabular">{avgRating}</p>
          <p className="mt-1 text-[0.8125rem] text-ink-3">Friends&rsquo; average</p>
        </div>
      </div>

      <ul className="mt-5 divide-y divide-line border-y border-line">
        {friendRatings.map(({ friend, rating }) => (
          <li key={friend.id}>
            <Link to={`/friend/${friend.id}/library`} className="group flex items-center gap-3 py-3.5">
              <Avatar src={friend.avatar} name={friend.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-semibold text-ink group-hover:underline underline-offset-4">
                  {friend.name}
                  {friend.isPremium && <span className="ml-2 align-middle text-xs font-medium text-ink-3">Premium</span>}
                </p>
                <p className="text-[0.8125rem] text-ink-3 tabular">{friend.library.length} books in their library</p>
              </div>
              <Rating value={rating} size="sm" showValue />
            </Link>
          </li>
        ))}
      </ul>

      {friendRatings.length > 3 && (
        <Link to="/clubs/friends" className="mt-4 inline-flex text-sm font-medium text-ink hover:underline underline-offset-4">
          See all friend ratings
        </Link>
      )}
    </section>
  );
}

FriendRatingsOnBook.propTypes = {
  bookId: PropTypes.string.isRequired,
};
