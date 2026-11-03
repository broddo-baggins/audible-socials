import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { EmptyState } from '../ui';

/**
 * AnalyticsDashboard: your reading history as numbers in Literata and the
 * genres you return to as ink bars, the top one in highlighter.
 */
const StatItem = ({ label, value }) => (
  <div className="flex flex-col">
    <dt className="order-2 mt-1 t-meta">{label}</dt>
    <dd className="order-1 t-h1 text-ink tabular">{value}</dd>
  </div>
);

StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const AnalyticsDashboard = ({ userData: _userData, readingHistory = [] }) => {
  const stats = useMemo(() => {
    const totalBooks = readingHistory.length;
    const totalHours = readingHistory.reduce((sum, book) => sum + (book.hoursListened || 0), 0);
    const averageRating = totalBooks > 0
      ? readingHistory.reduce((sum, book) => sum + (book.rating || 0), 0) / totalBooks
      : 0;

    const genreCount = {};
    readingHistory.forEach(book => {
      book.genres?.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalBooks,
      totalHours: Math.round(totalHours),
      averageRating: averageRating.toFixed(1),
      topGenres,
      booksThisMonth: readingHistory.filter(book => {
        const bookDate = new Date(book.completedDate);
        const now = new Date();
        return bookDate.getMonth() === now.getMonth() && bookDate.getFullYear() === now.getFullYear();
      }).length
    };
  }, [readingHistory]);

  const maxGenre = stats.topGenres[0]?.[1] || 1;

  return (
    <section aria-labelledby="analytics-title" className="space-y-10">
      <h2 id="analytics-title" className="t-h2 text-ink">Your reading analytics</h2>

      {stats.totalBooks === 0 ? (
        <EmptyState
          title="Nothing to count yet"
          description="Finish your first book and your hours, ratings and genres will show here."
          action="Open your library"
          actionTo="/library"
        />
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
            <StatItem label="Books completed" value={stats.totalBooks} />
            <StatItem label="Hours listened" value={stats.totalHours} />
            <StatItem label="Average rating" value={stats.averageRating} />
            <StatItem label="Finished this month" value={stats.booksThisMonth} />
            <StatItem label="Hours per book, on average" value={stats.totalBooks > 0 ? Math.round(stats.totalHours / stats.totalBooks) : 0} />
            <StatItem label="Genres in your top list" value={stats.topGenres.length} />
          </dl>

          {stats.topGenres.length > 0 && (
            <div>
              <h3 className="t-h3 text-ink">Favourite genres</h3>
              <ul className="mt-4 space-y-3">
                {stats.topGenres.map(([genre, count], i) => (
                  <li key={genre} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-4">
                    <span className={`truncate text-sm ${i === 0 ? 'font-semibold text-ink' : 'text-ink-2'}`}>{genre}</span>
                    <span className="relative h-3 border-l border-line-strong" aria-hidden="true">
                      <span
                        className={`absolute inset-y-0 left-0 rounded-r-[3px] ${i === 0 ? 'bg-hl ring-1 ring-inset ring-ink' : 'bg-ink'}`}
                        style={{ width: `${(count / maxGenre) * 100}%` }}
                      />
                    </span>
                    <span className="text-right text-[0.8125rem] text-ink-2 tabular">{count} {count === 1 ? 'book' : 'books'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
};

AnalyticsDashboard.propTypes = {
  userData: PropTypes.object,
  readingHistory: PropTypes.array
};

export default AnalyticsDashboard;
