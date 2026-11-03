import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Send, X, Gauge } from 'lucide-react';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import clubsData from '../../data/clubs.json';
import { getUserData, getFriends, removeFriend } from '../../utils/localStorage';
import { sendFriendRequest, getSuggestedFriends, getFriendsOfFriends, isUserBlocked } from '../../utils/friendManagement';
import FriendRequestManager from '../friends/FriendRequestManager';
import { Avatar, Badge, Cover, Waveform, Rating, Input, Button, EmptyState } from '../ui';

/**
 * FriendsTab: your friends as a list (who they are, what they are on and how
 * far), finding new ones, requests and friends of friends at the side, and a
 * profile sheet per friend.
 */

const hm = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

const loadFriendsList = () => {
  const friendIds = getFriends();
  return usersData.filter((u) => friendIds.includes(u.id));
};

const getContextualMessage = (user, currentUser) => {
  const sharedClubs = user.joinedClubs?.filter((clubId) => currentUser.joinedClubs?.includes(clubId)) || [];
  if (sharedClubs.length > 0) {
    const club = clubsData.find((c) => c.id === sharedClubs[0]);
    return {
      message: `Hi, we are both in ${club?.name}. I would love to connect and share thoughts on the books.`,
      context: 'book_club',
      sharedClub: sharedClubs[0],
    };
  }
  const sharedBooks = user.library?.filter((bookId) => currentUser.library?.includes(bookId)) || [];
  if (sharedBooks.length >= 3) {
    return {
      message: `Hi, we have ${sharedBooks.length} books in common. Our taste is close, so let's share recommendations.`,
      context: 'similar_taste',
    };
  }
  const theirGenre = user.stats?.favoriteGenre;
  if (theirGenre && theirGenre === currentUser.stats?.favoriteGenre) {
    return { message: `Hi, I see we both love ${theirGenre}. Let's connect and swap favourite listens.`, context: 'similar_taste' };
  }
  return { message: 'Hi, your reading list looks great. I would love to connect and share recommendations.', context: null };
};

// Show top 6 friends of friends
const loadFriendsOfFriends = () => getFriendsOfFriends('user-me', usersData).slice(0, 6);

export default function FriendsTab() {
  const [friends, setFriends] = useState(loadFriendsList);
  const [friendsOfFriends, setFriendsOfFriends] = useState(loadFriendsOfFriends);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadFriends = () => {
    setFriends(loadFriendsList());
    setFriendsOfFriends(loadFriendsOfFriends());
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const suggested = getSuggestedFriends('user-me', usersData);
    setSearchResults(query.trim() ? suggested.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())) : suggested.slice(0, 10));
  };

  const handleSendRequest = (friendId, userName) => {
    const currentUser = getUserData();
    const targetUser = usersData.find((u) => u.id === friendId);
    if (!targetUser) return;
    const { message, context, ...extraData } = getContextualMessage(targetUser, currentUser);
    const result = sendFriendRequest(friendId, message, context, extraData);
    if (result.success) {
      setNotice({ tone: 'success', text: `Friend request sent to ${userName}.` });
      handleSearch(searchQuery);
    } else {
      setNotice({ tone: 'error', text: result.error });
    }
  };

  const handleRemoveFriend = (friendId, friendName) => {
    if (window.confirm(`Remove ${friendName} from your friends? This cannot be undone.`)) {
      const result = removeFriend(friendId);
      if (result.success) {
        loadFriends();
        setSelectedFriend(null);
        setNotice({ tone: 'info', text: `You removed ${friendName} from your friends.` });
      } else {
        setNotice({ tone: 'error', text: 'The friend could not be removed. Please try again.' });
      }
    }
  };

  return (
    <div className="grid gap-14 pt-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
      <div className="min-w-0 space-y-16">
        {notice && (
          <p
            role="status"
            className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-[0.9375rem] ${
              notice.tone === 'error' ? 'border-danger/30 bg-danger-wash text-danger' : notice.tone === 'success' ? 'border-success/30 bg-success-wash text-success' : 'border-line bg-surface text-ink-2'
            }`}
          >
            <span>{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} className="-my-1 -mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5" aria-label="Dismiss message">
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </p>
        )}

        {/* Your friends */}
        <section aria-labelledby="friends-title">
          <h2 id="friends-title" className="t-h2 text-ink">Your friends <span className="text-ink-3 tabular">{friends.length}</span></h2>

          {friends.length === 0 ? (
            <EmptyState className="mt-5" title="No friends yet" description="Search for people below and send them a request." />
          ) : (
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {friends.map((friend) => {
                const book = friend.currentlyReading ? booksData.find((b) => b.id === friend.currentlyReading) : null;
                const rating = book && friend.ratings?.[friend.currentlyReading];
                const progress = friend.currentProgress;
                return (
                  <li key={friend.id} className="py-5">
                    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-6">
                      <Avatar src={friend.avatar} name={friend.name} size="lg" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-ink">{friend.name}</h3>
                          {friend.isPremium && <Badge size="sm" variant="outline">Premium</Badge>}
                        </div>
                        <p className="mt-0.5 text-[0.8125rem] text-ink-3 tabular">
                          {friend.library.length} books · {friend.joinedClubs.length} clubs · {Object.keys(friend.ratings || {}).length} ratings
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link to={`/friend/${friend.id}/library`} className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper hover:bg-gray-800">Library</Link>
                          <button type="button" onClick={() => setSelectedFriend(friend)} className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-ink hover:bg-surface">Profile</button>
                          <button type="button" onClick={() => handleRemoveFriend(friend.id, friend.name)} className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-danger hover:bg-danger-wash">Remove</button>
                        </div>
                      </div>

                      <div className="col-span-2 min-w-0 md:col-span-1">
                        {book ? (
                          <div className="flex gap-3">
                            <Link to={`/book/${book.id}`} className="w-11 shrink-0 rounded-sm" aria-label={`${book.title} details`}>
                              <Cover src={book.cover} title={book.title} shadow={false} />
                            </Link>
                            <div className="min-w-0 flex-1">
                              <p className="text-[0.8125rem] text-ink-3">Listening to</p>
                              <Link to={`/book/${book.id}`} className="t-title-book text-[0.9375rem] text-ink line-clamp-1 hover:underline underline-offset-4">{book.title}</Link>
                              {progress > 0 ? (
                                <div className="mt-1.5 flex items-center gap-2">
                                  <Waveform seed={`${friend.id}-${book.id}`} bars={32} height={14} progress={progress / 100} className="h-3.5 w-28 text-ink" label={`${progress}% listened`} />
                                  <span className="text-[0.8125rem] text-ink-3 tabular">{progress < 100 ? `${progress}%` : 'Finished'}</span>
                                </div>
                              ) : (
                                <p className="mt-1 text-[0.8125rem] text-ink-3">Progress not shared</p>
                              )}
                              {rating ? <Rating value={rating} size="sm" className="mt-1.5" /> : null}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[0.8125rem] text-ink-3 md:pt-1">Not listening to anything right now</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Find friends */}
        <section aria-labelledby="find-title">
          <h2 id="find-title" className="t-h2 text-ink">Find friends</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">See friends&rsquo; libraries and ratings, which clubs they are in, and get picks from them.</p>
          <Input
            containerClassName="mt-5 max-w-lg"
            label="Search by name"
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if (!searchQuery && searchResults.length === 0) handleSearch(''); }}
            placeholder="For example, Maya"
            leftIcon={<Search className="h-4 w-4" strokeWidth={1.75} />}
            fullWidth
          />
          {searchResults.length > 0 ? (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {searchResults.map((user) => (
                <li key={user.id} className="flex items-center gap-3 py-3">
                  <Avatar src={user.avatar} name={user.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium text-ink">
                      <span className="truncate">{user.name}</span>
                      {user.isPremium && <Badge size="sm" variant="outline">Premium</Badge>}
                    </p>
                    <p className="text-[0.8125rem] text-ink-3 tabular">{user.library.length} books</p>
                  </div>
                  {!isUserBlocked(user.id) ? (
                    <Button size="sm" variant="secondary" onClick={() => handleSendRequest(user.id, user.name)} leftIcon={<Send className="h-3.5 w-3.5" strokeWidth={1.75} />}>
                      Send request
                    </Button>
                  ) : (
                    <span className="text-[0.8125rem] font-medium text-danger">Blocked</span>
                  )}
                </li>
              ))}
            </ul>
          ) : searchQuery.trim() ? (
            <p className="mt-4 text-[0.9375rem] text-ink-2">Nobody new matches &ldquo;{searchQuery}&rdquo;.</p>
          ) : null}
        </section>
      </div>

      <aside className="min-w-0 space-y-14">
        <FriendRequestManager onUpdate={loadFriends} />

        {friendsOfFriends.length > 0 && (
          <section aria-labelledby="fof-title">
            <h2 id="fof-title" className="t-h3 text-ink">Friends of friends</h2>
            <p className="mt-1 text-sm text-ink-2">People you may know through your friends.</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {friendsOfFriends.map((user) => (
                <li key={user.id} className="flex items-center gap-3 py-3">
                  <Avatar src={user.avatar} name={user.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{user.name}</p>
                    <p className="text-[0.8125rem] text-ink-3 line-clamp-1 tabular">
                      {user.mutualFriends > 0
                        ? `${user.mutualFriends} mutual${user.mutualFriendList?.length ? `: ${user.mutualFriendList.join(', ')}` : ''}`
                        : `${user.library.length} books · ${user.joinedClubs.length} clubs`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendRequest(user.id, user.name)}
                    disabled={isUserBlocked(user.id)}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-surface disabled:opacity-45"
                    aria-label={`Add ${user.name} as a friend`}
                  >
                    <UserPlus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <Link to="/social" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
              More people on Social
            </Link>
          </section>
        )}
      </aside>

      {selectedFriend && (
        <FriendProfileDialog friend={selectedFriend} onClose={() => setSelectedFriend(null)} onRemove={() => handleRemoveFriend(selectedFriend.id, selectedFriend.name)} />
      )}
    </div>
  );
}

function FriendProfileDialog({ friend, onClose, onRemove }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, []);

  // Mock "days ago" for the completed list, stable per book
  const daysAgo = (bookId) => (Number.parseInt(bookId, 10) || bookId.length) % 30 + 1;

  const current = friend.currentlyReading && friend.privacySettings?.shareProgress ? booksData.find((b) => b.id === friend.currentlyReading) : null;
  const progress = friend.currentProgress || 0;
  const total = current?.durationMinutes || 600;
  const position = Math.round((progress / 100) * total);
  const remaining = total - position;
  const [finishes] = useState(() => new Date(Date.now() + remaining * 60000));
  const clubs = clubsData.filter((club) => friend.joinedClubs.includes(club.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="friend-dialog-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-surface shadow-lg sm:rounded-2xl">
        <div className="p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <Avatar src={friend.avatar} name={friend.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 id="friend-dialog-title" className="t-h2 text-ink">{friend.name}</h2>
              {friend.isPremium && <p className="mt-0.5 text-sm text-ink-2">Premium member</p>}
            </div>
            <button ref={closeRef} type="button" onClick={onClose} className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink" aria-label="Close">
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-line py-5">
            {[['books', friend.library.length], ['clubs', friend.joinedClubs.length], ['credits', friend.credits]].map(([l, v]) => (
              <div key={l} className="flex flex-col-reverse">
                <dt className="mt-1 text-[0.8125rem] text-ink-3">{l}</dt>
                <dd className="font-serif text-3xl font-medium text-ink tabular">{v ?? 0}</dd>
              </div>
            ))}
          </dl>

          {current && (
            <section className="mt-6" aria-labelledby="fd-current">
              <h3 id="fd-current" className="text-sm font-semibold text-ink-2">Listening now</h3>
              <div className="mt-3 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4">
                <Cover src={current.cover} title={current.title} shadow={false} />
                <div className="min-w-0">
                  <p className="t-title-book text-lg text-ink">{current.title}</p>
                  <p className="text-[0.8125rem] text-ink-3">by {current.author}</p>
                  <Waveform seed={`${friend.id}-${current.id}`} bars={56} height={20} progress={progress / 100} className="mt-3 h-5 w-full text-ink" label={`${progress}% listened`} />
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[0.8125rem] sm:grid-cols-4">
                    <div><dt className="text-ink-3">Progress</dt><dd className="font-medium text-ink tabular">{progress}%</dd></div>
                    <div><dt className="text-ink-3">Position</dt><dd className="font-medium text-ink tabular">{hm(position)}</dd></div>
                    <div><dt className="text-ink-3">Left</dt><dd className="font-medium text-ink tabular">{hm(remaining)}</dd></div>
                    <div><dt className="text-ink-3">Finishes</dt><dd className="font-medium text-ink tabular">{finishes.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</dd></div>
                  </dl>
                  <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-ink-3 tabular">
                    <Gauge className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> {friend.listeningSpeed || 1.0}x speed
                  </p>
                </div>
              </div>
            </section>
          )}

          {clubs.length > 0 && (
            <section className="mt-6" aria-labelledby="fd-clubs">
              <h3 id="fd-clubs" className="text-sm font-semibold text-ink-2">Book clubs</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {clubs.map((club) => (
                  <li key={club.id}>
                    <Link to={`/club/${club.id}`} className="flex items-baseline justify-between gap-4 py-3 hover:underline underline-offset-4">
                      <span className="font-medium text-ink">{club.name}</span>
                      <span className="shrink-0 text-[0.8125rem] text-ink-3">{club.host}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {friend.privacySettings?.shareHistory && Object.keys(friend.ratings || {}).length > 0 && (
            <section className="mt-6" aria-labelledby="fd-done">
              <h3 id="fd-done" className="text-sm font-semibold text-ink-2">Recently finished</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {Object.keys(friend.ratings).slice(0, 3).map((bookId) => {
                  const book = booksData.find((b) => b.id === bookId);
                  if (!book) return null;
                  const time = friend.completionTimes?.[bookId] || Math.floor((book.durationMinutes || 600) / (friend.listeningSpeed || 1.0));
                  return (
                    <li key={bookId}>
                      <Link to={`/book/${bookId}`} className="group flex items-center gap-3 py-3">
                        <span className="w-9 shrink-0"><Cover src={book.cover} title={book.title} shadow={false} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block t-title-book text-ink line-clamp-1 group-hover:underline underline-offset-4">{book.title}</span>
                          <span className="block text-[0.8125rem] text-ink-3 tabular">{book.author} · finished {daysAgo(bookId)} days ago in {hm(time)}</span>
                        </span>
                        <Rating value={friend.ratings[bookId]} size="sm" showValue />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={onRemove} className="!text-danger hover:!bg-danger-wash">Remove friend</Button>
            <div className="flex gap-3">
              <Link to={`/friend/${friend.id}/library`} className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-paper sm:flex-none">
                Library
              </Link>
              <Button variant="primary" onClick={onClose} className="flex-1 sm:flex-none">Close</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
