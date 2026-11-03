import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Heart, Share2, ChevronDown } from 'lucide-react';
import { Button, Rating, Badge, Cover, Waveform, ErrorState } from '../components/ui';
import BookCarousel from '../components/books/BookCarousel';
import FriendRecommendations from '../components/social/FriendRecommendations';
import BookClubTeaser from '../components/social/BookClubTeaser';
import FriendRatingsOnBook from '../components/social/FriendRatingsOnBook';
import { usePlayer } from '../contexts/usePlayer';
import { getUserData, addToLibrary, spendCredit } from '../utils/localStorage';
import booksData from '../data/books.json';

/**
 * BookDetail: one book, set like the inside flap of a jacket. The cover on the
 * left with the book's own waveform under it; on the right the serif title,
 * who wrote and who reads it, the reading, the facts and one key action.
 * Below: the summary, the chapters, what friends and clubs think, then shelves.
 */
const slug = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const safeUser = () => {
  try { return getUserData(); } catch { return null; }
};

const KIND = {
  original: { badge: 'original', label: 'Listenable Original', about: 'About this original' },
  podcast: { badge: 'podcast', label: 'Podcast series', about: 'About this podcast' },
  audiobook: { badge: null, label: null, about: 'About this audiobook' },
};

const BookDetail = () => {
  const { bookId } = useParams();
  const { loadBook, play } = usePlayer();

  const book = useMemo(() => booksData.find((b) => b.id === bookId) || null, [bookId]);
  const similarBooks = useMemo(
    () => (book ? booksData.filter((b) => b.genre === book.genre && b.id !== book.id && b.author !== book.author).slice(0, 12) : []),
    [book],
  );
  const authorBooks = useMemo(
    () => (book ? booksData.filter((b) => b.author === book.author && b.id !== book.id).slice(0, 12) : []),
    [book],
  );

  const [user, setUser] = useState(safeUser);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [wished, setWished] = useState(() => Boolean(user?.wishlist?.includes(bookId)));
  const [notice, setNotice] = useState('');

  // Reset the per-book state when the route moves to another book
  const [shownId, setShownId] = useState(bookId);
  if (shownId !== bookId) {
    setShownId(bookId);
    setExpandedDescription(false);
    setShowAllChapters(false);
    setWished(Boolean(user?.wishlist?.includes(bookId)));
    setNotice('');
  }

  const inLibrary = Boolean(user?.library?.includes(bookId));

  const handleStartListening = () => {
    if (book) {
      loadBook(book);
      play();
    }
  };

  const handleAddToLibrary = () => {
    if (inLibrary) return;
    addToLibrary(bookId);
    setUser(safeUser());
    setNotice('Added to your library.');
  };

  const handleBuyWithCredit = () => {
    if (inLibrary) return;
    const result = spendCredit();
    if (result.success) {
      addToLibrary(bookId);
      setUser(safeUser());
      setNotice(`Bought with 1 credit. ${result.remaining} left.`);
    } else {
      setNotice('You have no credits left. You can still buy it for the list price.');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: book.title, text: `${book.title} by ${book.author}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setNotice('Link copied.');
      }
    } catch {
      /* the person closed the share sheet */
    }
  };

  if (!book) {
    return (
      <div className="page pb-16">
        <ErrorState
          className="pt-12 md:pt-20"
          title="We can't find that book"
          description="The link may be out of date, or the title has left the catalogue. Search for it by name, or browse what is here."
          backTo="/browse"
          backLabel="Browse the catalogue"
        />
        <Link to="/search" className="link text-[0.9375rem]">Search by title or author</Link>
      </div>
    );
  }

  const kind = KIND[book.contentType] || KIND.audiobook;
  const released = formatDate(book.releaseDate);
  const chapters = book.chapters || [];
  const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 5);
  const longDescription = (book.description || '').length > 320;

  const facts = [
    { term: 'Length', value: book.duration },
    book.episodeCount ? { term: 'Episodes', value: `${book.episodeCount}${book.frequency ? `, ${book.frequency.toLowerCase()}` : ''}` } : null,
    released ? { term: 'Released', value: released } : null,
    book.language ? { term: 'Language', value: book.language } : null,
    book.publisher ? { term: 'Publisher', value: book.publisher } : null,
  ].filter(Boolean);

  return (
    <div className="page pb-16">
      {/* Where this book sits in the catalogue */}
      <nav aria-label="Breadcrumb" className="pt-6 md:pt-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-3">
          <li><Link to="/browse" className="hover:text-ink hover:underline underline-offset-4">Browse</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/browse?genre=${slug(book.genre)}`} className="hover:text-ink hover:underline underline-offset-4">{book.genre}</Link></li>
        </ol>
      </nav>

      {/* The flap: cover and waveform, then the facts */}
      <div className="mt-6 grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
        <div className="w-44 sm:w-52 md:w-auto md:sticky md:top-24 md:self-start">
          <Cover src={book.cover} title={book.title} author={book.author} loading="eager" />
          <div className="mt-5">
            <Waveform seed={book.id} bars={44} height={28} className="h-7 w-full text-ink-3" label={`Waveform of ${book.title}`} />
            <div className="mt-1.5 flex justify-between text-xs text-ink-3 tabular">
              <span>0:00</span>
              <span>{book.duration}</span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          {kind.badge && <Badge variant={kind.badge} className="mb-4">{kind.label}</Badge>}
          <h1 className="t-title-book text-ink text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">{book.title}</h1>
          <p className="mt-3 text-lg text-ink-2">
            By <Link to={`/search?q=${encodeURIComponent(book.author)}`} className="font-medium text-ink hover:underline underline-offset-4">{book.author}</Link>
          </p>
          {book.narrator && <p className="mt-0.5 text-[0.9375rem] text-ink-3">Read by {book.narrator}</p>}
          {book.series && (
            <p className="mt-1 text-[0.9375rem] text-ink-3">{book.series}{book.seriesNumber ? `, book ${book.seriesNumber}` : ''}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={book.rating} size="lg" showValue />
            <span className="text-[0.9375rem] text-ink-3 tabular">{book.ratingsCount.toLocaleString()} ratings</span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-line py-5 sm:grid-cols-3 xl:grid-cols-5">
            {facts.map((f) => (
              <div key={f.term} className="min-w-0">
                <dt className="text-[0.8125rem] text-ink-3">{f.term}</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-medium text-ink tabular">{f.value}</dd>
              </div>
            ))}
            <div className="min-w-0">
              <dt className="text-[0.8125rem] text-ink-3">Genre</dt>
              <dd className="mt-0.5 text-[0.9375rem] font-medium">
                <Link to={`/browse?genre=${slug(book.genre)}`} className="text-ink hover:underline underline-offset-4">{book.genre}</Link>
              </dd>
            </div>
          </dl>

          {/* Actions: one highlighter, the rest quiet */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="highlight" size="lg" onClick={handleStartListening} leftIcon={<Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />}>
              Start listening
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleAddToLibrary}
              aria-pressed={inLibrary}
              leftIcon={inLibrary ? <Check className="h-4 w-4" strokeWidth={2} /> : <Plus className="h-4 w-4" strokeWidth={2} />}
            >
              {inLibrary ? 'In your library' : 'Add to library'}
            </Button>
            <button
              type="button"
              onClick={() => setWished((v) => !v)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-surface"
            >
              <Heart className={`h-5 w-5 ${wished ? 'fill-ink' : ''}`} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this book"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-surface"
            >
              <Share2 className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <p className="mt-3 min-h-5 text-sm text-ink-2" role="status" aria-live="polite">{notice}</p>

          {/* Price */}
          {!inLibrary && (
            <div className="mt-4 flex flex-col gap-4 rounded-lg bg-surface-sunk px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">1 credit or <span className="tabular">${book.price}</span></p>
                <p className="text-sm text-ink-2">
                  Members get this {book.contentType === 'podcast' ? 'series' : 'book'} for 1 credit.
                  {user && typeof user.credits === 'number' && <> You have <span className="tabular">{user.credits}</span> {user.credits === 1 ? 'credit' : 'credits'}.</>}
                </p>
              </div>
              <Button variant="primary" onClick={handleBuyWithCredit} disabled={user?.credits === 0}>Buy with credit</Button>
            </div>
          )}

          {/* Summary */}
          <section aria-labelledby="about-title" className="mt-12">
            <h2 id="about-title" className="t-h2 text-ink">{kind.about}</h2>
            <p id="book-description" className={`mt-4 max-w-[68ch] text-[1.0625rem] leading-relaxed text-ink-2 ${longDescription && !expandedDescription ? 'line-clamp-4' : ''}`}>
              {book.description}
            </p>
            {longDescription && (
              <button
                type="button"
                onClick={() => setExpandedDescription((v) => !v)}
                aria-expanded={expandedDescription}
                aria-controls="book-description"
                className="mt-2 h-9 text-[0.9375rem] font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
              >
                {expandedDescription ? 'Show less' : 'Read more'}
              </button>
            )}
          </section>

          {/* Chapters */}
          {chapters.length > 0 && (
            <section aria-labelledby="chapters-title" className="mt-12">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="chapters-title" className="t-h2 text-ink">{book.contentType === 'podcast' ? 'Episodes' : 'Chapters'}</h2>
                <span className="text-[0.8125rem] text-ink-3 tabular">{chapters.length} in this preview</span>
              </div>
              <ol id="chapter-list" className="mt-4 divide-y divide-line border-y border-line">
                {visibleChapters.map((chapter, i) => (
                  <li key={chapter.id} className="flex min-h-13 items-center gap-4 py-3">
                    <span className="w-6 shrink-0 text-right text-sm text-ink-3 tabular">{i + 1}</span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] text-ink">{chapter.title}</span>
                    <span className="shrink-0 text-sm text-ink-3 tabular">{chapter.duration}</span>
                  </li>
                ))}
              </ol>
              {chapters.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllChapters((v) => !v)}
                  aria-expanded={showAllChapters}
                  aria-controls="chapter-list"
                  className="mt-3 inline-flex h-10 items-center gap-1.5 text-[0.9375rem] font-medium text-ink hover:underline underline-offset-4"
                >
                  {showAllChapters ? 'Show fewer' : `Show all ${chapters.length}`}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAllChapters ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                </button>
              )}
            </section>
          )}

          {/* The reading, in numbers */}
          <section aria-labelledby="ratings-title" className="mt-12">
            <h2 id="ratings-title" className="t-h2 text-ink">Ratings</h2>
            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
              <p className="font-serif text-[3.5rem] font-medium leading-none text-ink tabular">{book.rating.toFixed(1)}</p>
              <div className="pb-1">
                <Rating value={book.rating} size="lg" showValue={false} />
                <p className="mt-1 text-[0.9375rem] text-ink-3 tabular">from {book.ratingsCount.toLocaleString()} listeners</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* What people you know think, and where it is being read */}
      <div className="mt-16 grid gap-12 border-t border-line pt-12 md:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-12">
          <FriendRatingsOnBook bookId={bookId} />
          <FriendRecommendations bookId={bookId} />
        </div>
        <BookClubTeaser bookId={bookId} />
      </div>

      <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
        {authorBooks.length > 0 && (
          <BookCarousel title={`More from ${book.author}`} books={authorBooks} cardSize="md" seeAllLink={`/search?q=${encodeURIComponent(book.author)}`} />
        )}
        {similarBooks.length > 0 && (
          <BookCarousel title="More like this" description={`Other ${book.genre.toLowerCase()} people listen to.`} books={similarBooks} cardSize="md" seeAllLink={`/browse?genre=${slug(book.genre)}`} />
        )}
      </div>
    </div>
  );
};

export default BookDetail;
