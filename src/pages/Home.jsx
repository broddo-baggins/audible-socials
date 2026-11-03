import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, CalendarDays } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import BookCarousel from '../components/books/BookCarousel';
import { HeroSkeleton, CarouselSkeleton } from '../components/ui/Skeleton';
import { Rating, Avatar, Cover, Waveform } from '../components/ui';
import booksData from '../data/books.json';
import usersData from '../data/users.json';
import clubsData from '../data/clubs.json';

/**
 * Home: what you are listening to, who you are listening with, then the shelves.
 * Composition (DESIGN.md, "Home"): an asymmetric first row (Now playing on night,
 * friends on paper), a shelf, the clubs block, a two-column "next book" list,
 * then the catalogue shelves.
 */
const formatMeeting = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const byId = useMemo(() => Object.fromEntries(books.map((b) => [b.id, b])), [books]);
  const me = usersData.find((u) => u.id === 'user-me');
  const audiobooks = books.filter((b) => b.contentType === 'audiobook');
  const originals = books.filter((b) => b.contentType === 'original');
  const podcasts = books.filter((b) => b.contentType === 'podcast');

  const nowPlaying = (me && byId[me.currentlyReading]) || audiobooks[0];
  const nowProgress = me && byId[me.currentlyReading] ? me.currentProgress : null;

  // Continue listening: the books you have open, then the catalogue with simulated progress
  const inProgress = (me?.inProgressBooks || []).map((id) => byId[id]).filter(Boolean);
  const continueListening = [...inProgress, ...audiobooks.filter((b) => !inProgress.includes(b)).slice(0, 8 - inProgress.length)]
    .map((book, index) => ({ ...book, progress: book.id === me?.currentlyReading ? me.currentProgress : 15 + index * 8 }));

  const recommendations = audiobooks.slice(8, 18);
  const newReleases = [...audiobooks].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 12);
  const bestSellers = [...audiobooks]
    .sort((a, b) => b.rating * Math.log(b.ratingsCount + 1) - a.rating * Math.log(a.ratingsCount + 1))
    .slice(0, 12);
  const sciFiBooks = audiobooks.filter((b) => b.genre === 'Science Fiction').slice(0, 10);
  const mysteryBooks = audiobooks.filter((b) => b.genre === 'Mystery & Thriller').slice(0, 10);
  const fantasyBooks = audiobooks.filter((b) => b.genre === 'Fantasy').slice(0, 10);

  const friends = usersData
    .filter((u) => (me?.friends || []).includes(u.id))
    .map((u) => ({ ...u, book: byId[u.currentlyReading] }))
    .filter((u) => u.book)
    .slice(0, 4);

  const clubs = clubsData
    .filter((c) => c.memberCount > 1 && byId[c.currentBook] && !Number.isNaN(new Date(c.nextMeeting).getTime()))
    .sort((a, b) => new Date(a.nextMeeting) - new Date(b.nextMeeting)).slice(0, 4);
  const [featuredClub, ...otherClubs] = clubs;

  const completed = (me?.completedBooks || []).map((id) => byId[id]).filter(Boolean);
  const recentlyCompleted = (completed.length ? completed : audiobooks.slice(0, 3)).slice(0, 3);
  const nextReads = (me?.recommendedBooks || []).map((id) => byId[id]).filter(Boolean).slice(0, 3);

  if (loading) {
    return (
      <div className="page space-y-14 py-8">
        <HeroSkeleton />
        <CarouselSkeleton />
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* The project's disclaimer, stated once and plainly */}
      <div className="border-b border-line bg-surface-sunk">
        <p className="page py-2.5 text-[0.8125rem] text-ink-2">
          <span className="font-semibold text-ink">Educational mock project.</span>{' '}
          A study of how social features shorten the &ldquo;time to next book&rdquo; in audiobook apps, with AI features added. Not affiliated with or endorsed by Audible or Amazon.
        </p>
      </div>

      <div className="page space-y-16 pt-6 md:space-y-20 md:pt-10">
        {/* First row: now playing + friends listening */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10">
          <HeroBanner book={nowPlaying} progress={nowProgress} />

          <aside aria-labelledby="friends-now" className="flex flex-col">
            <div className="flex items-baseline justify-between">
              <h2 id="friends-now" className="t-h2 text-ink">Friends listening now</h2>
              <Link to="/social" className="text-sm font-medium text-ink hover:underline underline-offset-4">All activity</Link>
            </div>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {friends.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-3.5">
                  <Avatar src={f.avatar} name={f.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] text-ink">
                      <span className="font-semibold">{f.name.split(' ')[0]}</span>
                      <span className="text-ink-2"> is on </span>
                      <Link to={`/book/${f.book.id}`} className="t-title-book hover:underline underline-offset-4">{f.book.title}</Link>
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Waveform seed={`${f.id}-${f.book.id}`} bars={28} height={12} progress={(f.currentProgress || 0) / 100} className="h-3 w-24 text-ink" />
                      <span className="text-xs text-ink-3 tabular">{f.currentProgress}%</span>
                    </div>
                  </div>
                  <Link
                    to={`/friend/${f.id}/library`}
                    className="hidden shrink-0 rounded-full border border-line-strong px-3 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-surface sm:inline-flex"
                    aria-label={`See ${f.name}'s library`}
                  >
                    Library
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/clubs/friends"
              className="mt-4 inline-flex items-center gap-2 self-start text-sm font-medium text-ink hover:underline underline-offset-4"
            >
              <Users className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Find friends to listen with
            </Link>
          </aside>
        </div>

        <BookCarousel title="Continue listening" books={continueListening} showProgress cardSize="md" seeAllLink="/library" />

        {/* Clubs: one featured club large, the next three as rows */}
        {featuredClub && (
          <section aria-labelledby="clubs-week" className="rounded-2xl border border-line bg-surface p-5 md:p-8 lg:p-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="clubs-week" className="t-h2 text-ink">Book clubs meeting soon</h2>
                <p className="mt-1 text-[0.9375rem] text-ink-2">Read the same book, then talk about it live.</p>
              </div>
              <Link to="/clubs" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4 sm:inline-flex">
                All clubs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
              <Link to={`/club/${featuredClub.id}`} className="group grid grid-cols-[7rem_minmax(0,1fr)] gap-5 rounded-lg md:grid-cols-[9rem_minmax(0,1fr)]">
                <Cover src={byId[featuredClub.currentBook]?.cover} title={byId[featuredClub.currentBook]?.title} />
                <div className="min-w-0">
                  <p className="text-[0.8125rem] text-ink-3">Hosted by {featuredClub.host}</p>
                  <h3 className="mt-1 font-serif text-2xl font-medium leading-tight text-ink group-hover:underline underline-offset-4 decoration-1 md:text-[1.75rem]">{featuredClub.name}</h3>
                  <p className="mt-3 text-[0.9375rem] text-ink-2">
                    Now reading <span className="t-title-book text-ink">{byId[featuredClub.currentBook]?.title}</span>
                  </p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-ink-2">
                      <dt><Users className="h-4 w-4" strokeWidth={1.75} aria-label="Members" /></dt>
                      <dd className="tabular">{featuredClub.memberCount.toLocaleString()} members</dd>
                    </div>
                    {formatMeeting(featuredClub.nextMeeting) && (
                      <div className="flex items-center gap-1.5 text-ink-2">
                        <dt><CalendarDays className="h-4 w-4" strokeWidth={1.75} aria-label="Next meeting" /></dt>
                        <dd className="tabular">{formatMeeting(featuredClub.nextMeeting)}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-4 text-sm text-ink-2 line-clamp-3 max-w-[52ch]">{featuredClub.description}</p>
                </div>
              </Link>

              <ul className="divide-y divide-line border-y border-line self-start">
                {otherClubs.map((club) => {
                  const book = byId[club.currentBook];
                  return (
                    <li key={club.id}>
                      <Link to={`/club/${club.id}`} className="group flex items-center gap-4 py-4">
                        <div className="w-11 shrink-0"><Cover src={book?.cover} title={book?.title} shadow={false} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-ink group-hover:underline underline-offset-4">{club.name}</p>
                          <p className="text-[0.8125rem] text-ink-2 line-clamp-1">
                            {book ? <>Reading <span className="t-title-book">{book.title}</span></> : club.host}
                          </p>
                        </div>
                        <span className="shrink-0 text-right text-[0.8125rem] text-ink-3 tabular">
                          {club.memberCount.toLocaleString()}<br className="sm:hidden" /> <span className="hidden sm:inline">members</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Link to="/clubs" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4 sm:hidden">
              All clubs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </section>
        )}

        <BookCarousel title="Recommended for you" description="Because you finish thrillers in a week." books={recommendations} cardSize="md" />

        {/* Your next book: two lists side by side */}
        <section aria-labelledby="next-book">
          <h2 id="next-book" className="t-h2 text-ink">Your next book</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">The fastest way to the next good listen is the last one you finished.</p>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-ink-2">Recently finished</h3>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {recentlyCompleted.map((book) => (
                  <li key={book.id} className="flex gap-4 py-4">
                    <Link to={`/book/${book.id}`} className="w-12 shrink-0" aria-label={book.title}><Cover src={book.cover} title={book.title} shadow={false} /></Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/book/${book.id}`} className="t-title-book text-ink hover:underline underline-offset-4 line-clamp-1">{book.title}</Link>
                      <p className="text-[0.8125rem] text-ink-2">{book.author} · {book.duration}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Rating value={book.rating} size="sm" showValue={false} />
                        <span className="text-[0.8125rem] text-ink-3 tabular">You rated {book.rating}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-2">Picked from what you finished</h3>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {nextReads.map((book) => (
                  <li key={book.id} className="flex items-center gap-4 py-4">
                    <Link to={`/book/${book.id}`} className="w-12 shrink-0" aria-label={book.title}><Cover src={book.cover} title={book.title} shadow={false} /></Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/book/${book.id}`} className="t-title-book text-ink hover:underline underline-offset-4 line-clamp-1">{book.title}</Link>
                      <p className="text-[0.8125rem] text-ink-2">{book.genre} · {book.duration}</p>
                      <Rating value={book.rating} size="sm" showCount count={book.ratingsCount} showValue className="mt-1.5" />
                    </div>
                    <Link to={`/book/${book.id}`} className="shrink-0 rounded-full bg-ink px-4 py-2 text-[0.8125rem] font-medium text-paper hover:bg-gray-800">
                      Get book
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/discover" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">Find your next read</Link>
            <Link to="/browse?sort=trending" className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">Browse trending</Link>
          </div>
        </section>

        <BookCarousel title="New releases" books={newReleases} seeAllLink="/browse?sort=newest" />
        <BookCarousel title="Best sellers" books={bestSellers} seeAllLink="/browse?sort=popular" />
        <BookCarousel title="Listenable Originals" description="Made for the ear, only here." books={originals} seeAllLink="/originals" />
        <BookCarousel title="Popular podcasts" books={podcasts} seeAllLink="/podcasts" />
        <BookCarousel title="Science fiction" books={sciFiBooks} seeAllLink="/browse?genre=science-fiction" />
        <BookCarousel title="Mystery and thriller" books={mysteryBooks} seeAllLink="/browse?genre=mystery" />
        <BookCarousel title="Fantasy" books={fantasyBooks} seeAllLink="/browse?genre=fantasy" />
      </div>
    </div>
  );
};

export default Home;
