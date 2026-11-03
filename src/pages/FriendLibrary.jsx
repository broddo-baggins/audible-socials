import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock, Star, Users } from 'lucide-react';
import { Avatar, Badge, Cover, EmptyState, Waveform, Skeleton } from '../components/ui';
import usersData from '../data/users.json';
import booksData from '../data/books.json';
import clubsData from '../data/clubs.json';
import shareHistoryData from '../data/shareHistory.json';
import { getFriends } from '../utils/localStorage';

/**
 * FriendLibrary: a friend's shelves, as far as their privacy settings allow.
 * Their name and numbers, what they are on now (their waveform, heard part in ink),
 * what they recommended to you, then the shelf with tabs, then their clubs.
 */
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Finished' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'rated', label: 'Rated', needsRatings: true },
];

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function FriendLibrary() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const friend = useMemo(() => usersData.find((u) => u.id === friendId) || null, [friendId]);
  const isFriend = useMemo(() => {
    try { return getFriends().includes(friendId); } catch { return false; }
  }, [friendId]);

  const friendBooks = useMemo(() => {
    if (!friend) return [];
    return friend.library
      .map((bookId) => {
        const book = booksData.find((b) => b.id === bookId);
        if (!book) return null;
        return {
          ...book,
          userRating: friend.ratings?.[bookId] || null,
          isCompleted: friend.completedBooks?.includes(bookId),
          isInProgress: friend.inProgressBooks?.includes(bookId),
          isCurrentlyReading: friend.currentlyReading === bookId,
          progress: friend.currentlyReading === bookId ? friend.currentProgress : 100,
        };
      })
      .filter(Boolean);
  }, [friend]);

  const shareHistory = useMemo(() => shareHistoryData.find((h) => h.userId === friendId) || null, [friendId]);

  // An unknown person: back to the friends list
  useEffect(() => {
    if (!friend) navigate('/clubs/friends');
  }, [friend, navigate]);

  if (!friend) {
    return (
      <div className="page space-y-6 py-12" aria-hidden="true">
        <Skeleton variant="title" width="1/3" />
        <Skeleton width="1/2" />
      </div>
    );
  }

  const firstName = friend.name.split(' ')[0];

  // Privacy check
  const canViewLibrary = isFriend && friend.privacySettings?.shareLibrary !== false;
  const canViewRatings = isFriend && friend.privacySettings?.shareRatings !== false;
  const canViewProgress = isFriend && friend.privacySettings?.shareProgress !== false;

  const backLink = (
    <Link to="/clubs/friends" className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
      <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Friends
    </Link>
  );

  if (!canViewLibrary) {
    return (
      <div className="page pb-16 pt-6">
        {backLink}
        <div className="mt-6 flex items-center gap-4">
          <Avatar src={friend.avatar} name={friend.name} size="lg" />
          <h1 className="t-h1 text-ink">{friend.name}</h1>
        </div>
        <EmptyState
          className="mt-10 max-w-2xl"
          icon={Lock}
          title="This library is private"
          description={`${friend.name} has chosen to keep their library to themselves.`}
          action="Back to friends"
          actionTo="/clubs/friends"
        />
      </div>
    );
  }

  const counts = {
    all: friendBooks.length,
    completed: friendBooks.filter((b) => b.isCompleted).length,
    'in-progress': friendBooks.filter((b) => b.isInProgress).length,
    rated: friendBooks.filter((b) => b.userRating).length,
  };

  // Filter and sort books
  let displayBooks = [...friendBooks];
  if (filter === 'completed') displayBooks = displayBooks.filter((b) => b.isCompleted);
  else if (filter === 'in-progress') displayBooks = displayBooks.filter((b) => b.isInProgress);
  else if (filter === 'rated') displayBooks = displayBooks.filter((b) => b.userRating !== null);

  if (sortBy === 'rating') displayBooks.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
  else if (sortBy === 'title') displayBooks.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === 'author') displayBooks.sort((a, b) => a.author.localeCompare(b.author));

  const currentBook = friendBooks.find((b) => b.isCurrentlyReading);
  const shares = (shareHistory?.shareHistory || [])
    .slice(0, 3)
    .map((share) => ({ share, book: booksData.find((b) => b.id === share.bookId) }))
    .filter((s) => s.book);
  const clubs = clubsData.filter((club) => friend.joinedClubs?.includes(club.id));

  const stats = [
    { label: 'books', value: friendBooks.length },
    canViewRatings ? { label: 'ratings', value: Object.keys(friend.ratings || {}).length } : null,
    { label: 'clubs', value: friend.joinedClubs?.length || 0 },
    friend.stats?.totalHoursListened != null ? { label: 'hours listened', value: friend.stats.totalHoursListened } : null,
  ].filter(Boolean);

  return (
    <div className="page pb-16">
      <div className="pt-6">{backLink}</div>

      {/* Who this is */}
      <header className="pb-8 pt-4 md:pb-10">
        <div className="flex items-center gap-4 md:gap-5">
          <Avatar src={friend.avatar} name={friend.name} size="xl" />
          <div className="min-w-0">
            <h1 className="t-h1 text-ink">{firstName}&rsquo;s library</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] text-ink-2">
              <span>{friend.name}</span>
              {friend.isPremium && <Badge variant="outline" size="sm">Premium</Badge>}
              {friend.stats?.favoriteGenre && <span>Favourite genre: {friend.stats.favoriteGenre}</span>}
            </p>
          </div>
        </div>
        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1.5 text-[0.8125rem] text-ink-3">{s.label}</dt>
              <dd className="font-serif text-[2.25rem] font-medium leading-none text-ink tabular">{s.value.toLocaleString()}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="space-y-16 md:space-y-20">
        {/* Currently listening */}
        {canViewProgress && currentBook && (
          <section aria-labelledby="current-title" className="rounded-2xl border border-line bg-surface p-5 md:p-8">
            <h2 id="current-title" className="text-sm font-semibold text-ink-2">Listening now</h2>
            <div className="mt-4 grid grid-cols-[6rem_minmax(0,1fr)] gap-5 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-8">
              <Link to={`/book/${currentBook.id}`} className="rounded-sm" aria-label={currentBook.title}>
                <Cover src={currentBook.cover} title={currentBook.title} author={currentBook.author} />
              </Link>
              <div className="flex min-w-0 flex-col">
                <Link to={`/book/${currentBook.id}`} className="t-title-book text-2xl text-ink hover:underline underline-offset-4 decoration-1 md:text-[1.75rem]">
                  {currentBook.title}
                </Link>
                <p className="mt-1 text-[0.9375rem] text-ink-2">By {currentBook.author}</p>
                <div className="mt-5 md:mt-auto">
                  <Waveform
                    seed={currentBook.id}
                    bars={60}
                    height={32}
                    progress={(currentBook.progress || 0) / 100}
                    className="h-8 w-full max-w-xl text-ink"
                    label={`${currentBook.progress}% listened`}
                  />
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-ink-3 tabular">
                    <span className="font-semibold text-ink">{currentBook.progress}% listened</span>
                    {friend.listeningSpeed && <span>At {friend.listeningSpeed}x speed</span>}
                    <span>{currentBook.duration}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* What they recommended */}
        {shares.length > 0 && (
          <section aria-labelledby="shares-title">
            <h2 id="shares-title" className="t-h2 text-ink">{firstName} recommends</h2>
            <ul className="mt-5 grid gap-x-10 border-t border-line md:grid-cols-3">
              {shares.map(({ share, book }) => (
                <li key={share.id} className="border-b border-line py-5 md:border-b-0">
                  <div className="flex gap-4">
                    <Link to={`/book/${book.id}`} className="w-14 shrink-0 rounded-sm" aria-label={book.title}>
                      <Cover src={book.cover} title={book.title} shadow={false} />
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/book/${book.id}`} className="t-title-book text-ink hover:underline underline-offset-4 line-clamp-2">{book.title}</Link>
                      <p className="text-[0.8125rem] text-ink-2">{book.author}</p>
                      <p className="mt-1 text-xs text-ink-3 tabular">Shared {formatDate(share.timestamp)}</p>
                    </div>
                  </div>
                  {share.message && (
                    <blockquote className="mt-3 font-serif text-[0.9375rem] italic leading-relaxed text-ink-2">
                      &ldquo;{share.message}&rdquo;
                    </blockquote>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The shelf */}
        <section aria-labelledby="shelf-title">
          <h2 id="shelf-title" className="sr-only">Books</h2>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line">
            <div role="tablist" aria-label="Show" className="-mb-px flex gap-6 overflow-x-auto scrollbar-hide">
              {FILTERS.filter((f) => !f.needsRatings || canViewRatings).map((f) => {
                const selected = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(f.id)}
                    className={`relative inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap text-[0.9375rem] font-medium ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                  >
                    {f.label}
                    <span className="text-[0.8125rem] text-ink-3 tabular">{counts[f.id]}</span>
                    {selected && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <label htmlFor="friend-sort" className="text-sm text-ink-2">Sort by</label>
              <select
                id="friend-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-full border border-line-strong bg-surface pl-4 pr-8 text-sm font-medium text-ink hover:bg-paper"
              >
                <option value="recent">Recently added</option>
                {canViewRatings && <option value="rating">Their rating</option>}
                <option value="title">Title, A to Z</option>
                <option value="author">Author, A to Z</option>
              </select>
            </div>
          </div>

          {displayBooks.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="Nothing on this shelf"
              description={`${firstName} has no books that match this filter yet.`}
              action="Show all books"
              onAction={() => setFilter('all')}
            />
          ) : (
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 md:gap-x-6 lg:grid-cols-5 xl:grid-cols-6">
              {displayBooks.map((book) => (
                <li key={book.id}>
                  <Link to={`/book/${book.id}`} className="group block rounded-sm" aria-label={`${book.title} by ${book.author}`}>
                    <div className="relative transition-transform duration-200 group-hover:-translate-y-1">
                      <Cover src={book.cover} title={book.title} author={book.author} />
                      {book.isCurrentlyReading && canViewProgress && (
                        <Badge variant="highlight" size="sm" className="absolute left-2 top-2">Listening</Badge>
                      )}
                      {book.isCompleted && !book.isCurrentlyReading && (
                        <Badge variant="primary" size="sm" className="absolute left-2 top-2" icon={<Check className="h-3 w-3" strokeWidth={2.5} />}>Finished</Badge>
                      )}
                    </div>
                  </Link>
                  <h3 className="mt-3 t-title-book text-[0.9375rem] text-ink line-clamp-2">
                    <Link to={`/book/${book.id}`} tabIndex={-1} className="hover:underline underline-offset-4 decoration-1">{book.title}</Link>
                  </h3>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-2 line-clamp-1">{book.author}</p>
                  {canViewRatings && book.userRating && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[0.8125rem] text-ink-3 tabular">
                      <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={1.5} aria-hidden="true" />
                      {firstName} rated {book.userRating}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Their clubs */}
        {clubs.length > 0 && (
          <section aria-labelledby="friend-clubs-title">
            <h2 id="friend-clubs-title" className="t-h2 text-ink">{firstName}&rsquo;s book clubs</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {clubs.map((club) => {
                const book = booksData.find((b) => b.id === club.currentBook);
                return (
                  <li key={club.id}>
                    <Link to={`/club/${club.id}`} className="group flex items-center gap-4 py-4">
                      <div className="w-11 shrink-0"><Cover src={book?.cover} title={book?.title} shadow={false} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink group-hover:underline underline-offset-4">{club.name}</p>
                        <p className="text-[0.8125rem] text-ink-2">Hosted by {club.host}</p>
                      </div>
                      <div className="shrink-0 text-right text-[0.8125rem] text-ink-3 tabular">
                        <p className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />{club.memberCount.toLocaleString()}</p>
                        {club.daysRemaining != null && <p>{club.daysRemaining} days left</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
