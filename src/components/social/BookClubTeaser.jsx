import { useState, useEffect } from 'react';
import { Users, CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Cover, Skeleton } from '../ui';

/**
 * BookClubTeaser: clubs reading this book or its genre, as ruled rows with the
 * club's current book. One link out to every club.
 */
const formatMeeting = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const BookClubTeaser = ({ bookId }) => {
  const [clubs, setClubs] = useState([]);
  const [booksById, setBooksById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        // Load book clubs data
        const clubsResponse = await fetch('/src/data/clubs.json');
        const clubsData = await clubsResponse.json();

        // Load books to find the current one
        const booksResponse = await fetch('/src/data/books.json');
        const booksData = await booksResponse.json();
        const currentBook = booksData.find((b) => b.id === bookId);

        if (!currentBook) {
          setClubs([]);
          setLoading(false);
          return;
        }

        // Filter clubs that are reading this book or match the genre
        const relevantClubs = clubsData
          .filter((club) =>
            club.currentBook === bookId ||
            club.genre === currentBook.genre ||
            (currentBook.clubs && currentBook.clubs.includes(club.id)))
          .slice(0, 3);

        setBooksById(Object.fromEntries(booksData.map((b) => [b.id, b])));
        setClubs(relevantClubs);
      } catch (error) {
        console.error('Failed to load book clubs:', error);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [bookId]);

  if (loading) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <Skeleton variant="title" width="1/2" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton variant="bookCover" className="w-12" />
            <div className="flex-1 space-y-2 pt-1"><Skeleton width="1/2" /><Skeleton width="3/4" /></div>
          </div>
        ))}
      </div>
    );
  }

  if (clubs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`clubs-${bookId}`} className="self-start rounded-2xl border border-line bg-surface p-5 md:p-7">
      <h2 id={`clubs-${bookId}`} className="t-h2 text-ink">Clubs reading this</h2>
      <p className="mt-1 text-[0.9375rem] text-ink-2">Listen along, then talk about it live.</p>

      <ul className="mt-5 divide-y divide-line border-t border-line">
        {clubs.map((club) => {
          const current = booksById[club.currentBook];
          const meeting = formatMeeting(club.nextMeeting);
          const readingThis = club.currentBook === bookId;
          return (
            <li key={club.id}>
              <Link to={`/club/${club.id}`} className="group flex gap-4 py-4">
                <div className="w-12 shrink-0">
                  <Cover src={current?.cover} title={current?.title} shadow={false} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink group-hover:underline underline-offset-4">{club.name}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-2 line-clamp-1">
                    {readingThis ? 'Reading this book now' : current ? <>Now reading <span className="t-title-book">{current.title}</span></> : `Hosted by ${club.host}`}
                  </p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-ink-3">
                    <span className="inline-flex items-center gap-1.5 tabular">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {club.memberCount.toLocaleString()} members
                    </span>
                    {meeting && (
                      <span className="inline-flex items-center gap-1.5 tabular">
                        <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        Meets {meeting}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link to="/clubs" className="mt-2 inline-flex h-10 items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4">
        Explore all book clubs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </section>
  );
};

BookClubTeaser.propTypes = {
  bookId: PropTypes.string,
};

export default BookClubTeaser;
