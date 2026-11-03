import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Heart, Share2, Check } from 'lucide-react';
import booksData from '../data/books.json';
import clubsData from '../data/clubs.json';
import usersData from '../data/users.json';
import { getUserData, addToLibrary, spendCredit, rateBook, setCurrentlyReading, getFriends } from '../utils/localStorage';
import { fetchGoogleImagesCover } from '../utils/googleImages';
import FriendRatingsOnBook from '../components/social/FriendRatingsOnBook';
import { Avatar, Badge, Button, Cover, Rating, Skeleton, Waveform } from '../components/ui';

/**
 * BookDetailPage: the credits-and-clubs version of a book page (not routed).
 * Same composition as BookDetail: cover and waveform left, the flap right,
 * then the summary, friends, clubs and your own rating.
 */
export default function BookDetailPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [relatedClubs, setRelatedClubs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [inLibrary, setInLibrary] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [friendsReading, setFriendsReading] = useState([]);
  const [wished, setWished] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const foundBook = booksData.find((b) => b.id === bookId);
    setBook(foundBook);

    if (foundBook) {
      // Load cover
      fetchGoogleImagesCover(foundBook.id, foundBook.coverQuery, foundBook.genre)
        .then((cover) => setCoverUrl(cover));

      // Find related clubs
      const clubs = clubsData.filter((club) => foundBook.clubs?.includes(club.id));
      setRelatedClubs(clubs);

      // Get user data
      const user = getUserData();
      setUserData(user);
      setInLibrary(user.library.includes(bookId));

      // Find friends reading this book
      const friendIds = getFriends();
      const friends = usersData.filter((u) => friendIds.includes(u.id) && u.library.includes(bookId));
      setFriendsReading(friends);
    }
  }, [bookId]);

  const handleAddToLibrary = () => {
    const result = spendCredit();
    if (result.success) {
      addToLibrary(bookId);
      setInLibrary(true);
      setUserData(getUserData());
      setNotice(`Added with 1 credit. ${result.remaining} left.`);
      return true;
    }
    setNotice('You need a credit to add this book to your library.');
    return false;
  };

  const handleStartListening = () => {
    if (!inLibrary && !handleAddToLibrary()) return;
    setCurrentlyReading(bookId);
    // In a real app, this would navigate to the player
    setNotice('Starting the audiobook.');
  };

  const handleRateBook = (rating) => {
    rateBook(bookId, rating);
    setUserData(getUserData());
    setShowRating(false);
  };

  if (book === undefined) {
    return (
      <div className="page py-16">
        <h1 className="t-h1 text-ink">We can&rsquo;t find that book</h1>
        <Link to="/browse" className="link mt-4 inline-block">Browse the catalogue</Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page grid gap-10 py-12 md:grid-cols-[13rem_minmax(0,1fr)]" aria-hidden="true">
        <Skeleton variant="bookCover" className="w-44 md:w-full" />
        <div className="space-y-4"><Skeleton variant="title" width="3/4" /><Skeleton width="1/2" /><Skeleton count={3} /></div>
      </div>
    );
  }

  const userRating = userData?.ratings?.[bookId];
  const isCurrentlyReading = userData?.currentlyReading === bookId;
  const clubDiscount = relatedClubs.length > 0 && userData?.joinedClubs?.some((id) => relatedClubs.map((c) => c.id).includes(id));
  const released = new Date(book.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const iconButton = 'inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-surface';

  return (
    <div className="page pb-16">
      <div className="grid gap-8 pt-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 md:pt-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
        <div className="w-44 sm:w-52 md:w-auto md:sticky md:top-24 md:self-start">
          <Cover src={book.cover || coverUrl} title={book.title} author={book.author} loading="eager" />
          <Waveform seed={book.id} bars={44} height={28} className="mt-5 h-7 w-full text-ink-3" />
          {isCurrentlyReading && <Badge variant="highlight" className="mt-4">Currently listening</Badge>}
        </div>

        <div className="min-w-0">
          <Link to="/browse" className="text-[0.8125rem] text-ink-3 hover:text-ink hover:underline underline-offset-4">{book.genre}</Link>
          <h1 className="mt-2 t-title-book text-ink text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.08]">{book.title}</h1>
          <p className="mt-3 text-lg text-ink-2">By <span className="font-medium text-ink">{book.author}</span></p>
          <p className="mt-0.5 text-[0.9375rem] text-ink-3">Read by {book.narrator}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={book.rating} size="lg" />
            <span className="text-[0.9375rem] text-ink-3 tabular">{book.ratingsCount.toLocaleString()} ratings</span>
            <span className="text-[0.9375rem] text-ink-3 tabular">· {book.duration}</span>
          </div>

          {/* Price and credits */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-surface-sunk px-5 py-4">
            <div>
              <p className="font-semibold text-ink">
                {clubDiscount && <span className="mr-2 font-normal text-ink-3 line-through tabular">${book.price}</span>}
                1 credit{clubDiscount && ', 2 for 1 with your club'}
              </p>
              <p className="text-sm text-ink-2 tabular">You have {userData?.credits} {userData?.credits === 1 ? 'credit' : 'credits'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {inLibrary ? (
              <>
                <Button variant="highlight" size="lg" onClick={handleStartListening} leftIcon={<Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />}>
                  {isCurrentlyReading ? 'Continue listening' : 'Start listening'}
                </Button>
                <button type="button" className={iconButton} aria-label="Share this book"><Share2 className="h-5 w-5" strokeWidth={1.75} /></button>
              </>
            ) : (
              <>
                <Button variant="highlight" size="lg" onClick={handleAddToLibrary} disabled={userData?.credits === 0} leftIcon={<Plus className="h-4 w-4" strokeWidth={2} />}>
                  Add for 1 credit
                </Button>
                <button type="button" onClick={() => setWished((v) => !v)} aria-pressed={wished} className={iconButton} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
                  <Heart className={`h-5 w-5 ${wished ? 'fill-ink' : ''}`} strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>
          <p className="mt-3 min-h-5 text-sm text-ink-2" role="status" aria-live="polite">{notice}</p>

          {/* Club benefit */}
          {clubDiscount && (
            <div className="mt-4 rounded-lg border border-line bg-hl-wash px-5 py-4">
              <p className="text-sm font-semibold text-ink">Book club member benefit</p>
              <p className="mt-0.5 text-sm text-ink-2">A 30 minute preview instead of 5 minutes.</p>
            </div>
          )}

          <section aria-labelledby="summary-title" className="mt-12">
            <h2 id="summary-title" className="t-h2 text-ink">Publisher&rsquo;s summary</h2>
            <p className="mt-4 max-w-[68ch] text-[1.0625rem] leading-relaxed text-ink-2">{book.description}</p>
          </section>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-line py-5 sm:grid-cols-3">
            <div><dt className="text-[0.8125rem] text-ink-3">Released</dt><dd className="mt-0.5 font-medium text-ink">{released}</dd></div>
            <div><dt className="text-[0.8125rem] text-ink-3">Length</dt><dd className="mt-0.5 font-medium text-ink tabular">{book.duration}</dd></div>
            <div><dt className="text-[0.8125rem] text-ink-3">Genre</dt><dd className="mt-0.5 font-medium text-ink">{book.genre}</dd></div>
          </dl>

          {/* Your rating */}
          {inLibrary && (
            <section aria-labelledby="your-rating-title" className="mt-12">
              <h2 id="your-rating-title" className="t-h2 text-ink">Your rating</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {userRating && !showRating ? (
                  <>
                    <Rating value={userRating} size="xl" />
                    <button type="button" onClick={() => setShowRating(true)} className="h-10 text-[0.9375rem] font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2">
                      Change rating
                    </button>
                  </>
                ) : showRating ? (
                  <Rating value={userRating || 0} size="xl" interactive onChange={handleRateBook} showValue={false} />
                ) : (
                  <Button variant="secondary" onClick={() => setShowRating(true)}>Rate this book</Button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-12">
          <FriendRatingsOnBook bookId={bookId} />

          {friendsReading.length > 0 && (
            <section aria-labelledby="friends-reading-title">
              <h2 id="friends-reading-title" className="t-h2 text-ink">Friends with this book</h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {friendsReading.map((friend) => (
                  <li key={friend.id} className="flex items-center gap-3 py-3.5">
                    <Avatar src={friend.avatar} name={friend.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.9375rem] font-semibold text-ink">
                        {friend.name}
                        {friend.isPremium && <span className="ml-2 text-xs font-medium text-ink-3">Premium</span>}
                      </p>
                    </div>
                    {friend.ratings[bookId] && <Rating value={friend.ratings[bookId]} size="sm" />}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {relatedClubs.length > 0 && (
          <section aria-labelledby="related-clubs-title" className="self-start rounded-2xl border border-line bg-surface p-5 md:p-7">
            <h2 id="related-clubs-title" className="t-h2 text-ink">Clubs reading this</h2>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {relatedClubs.map((club) => (
                <li key={club.id}>
                  <Link to={`/club/${club.id}`} className="group flex items-start justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-ink group-hover:underline underline-offset-4">
                        {club.name}
                        {club.isPremium && <Badge variant="outline" size="sm">Premium</Badge>}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] text-ink-2">Hosted by {club.host}</p>
                    </div>
                    <div className="shrink-0 text-right text-[0.8125rem] tabular">
                      <p className="font-medium text-ink">{club.daysRemaining} days left</p>
                      <p className="text-ink-3">{club.memberCount.toLocaleString()} members</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {inLibrary && (
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-success">
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> In your library
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
