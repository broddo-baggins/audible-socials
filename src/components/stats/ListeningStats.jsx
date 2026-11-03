import { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../ui';

// The week's listening and the genre split this component has always drawn.
const WEEK_HOURS = [3.2, 4.5, 2.8, 5.1, 4.2, 6.3, 5.8];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GENRES = [
  { genre: 'Science Fiction', count: 23, percentage: 35 },
  { genre: 'Fantasy', count: 18, percentage: 28 },
  { genre: 'Mystery', count: 12, percentage: 18 },
  { genre: 'Self Development', count: 8, percentage: 12 },
  { genre: 'Other', count: 4, percentage: 7 },
];
const RANGES = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];
const YEAR_GOAL = 50;

/**
 * ListeningStats: four numbers in Literata, then the charts (ink bars on a
 * line baseline, today or your favourite in highlighter, every value printed),
 * then the year's goal.
 */
const ListeningStats = ({ stats }) => {
  const {
    hoursListened = 0,
    booksFinished = 0,
    currentStreak = 0,
    longestStreak = 0,
    favoriteGenre = 'Not set',
    averageRating = 0,
    thisMonthHours = 0,
    thisYearBooks = 0,
  } = stats || {};

  const [range, setRange] = useState('week');

  const statItems = [
    { label: 'Hours listened', value: hoursListened.toLocaleString(), sub: `${thisMonthHours} h this month` },
    { label: 'Books finished', value: booksFinished.toLocaleString(), sub: `${thisYearBooks} this year` },
    { label: 'Current streak', value: currentStreak, unit: currentStreak === 1 ? 'day' : 'days', sub: `Longest ${longestStreak} days` },
    { label: 'Average rating', value: averageRating.toFixed(1), sub: 'Your ratings' },
  ];

  const todayIndex = (new Date().getDay() + 6) % 7; // Monday first
  const maxHours = Math.max(...WEEK_HOURS);
  const weekTotal = WEEK_HOURS.reduce((a, b) => a + b, 0);

  const year = new Date().getFullYear();
  const goalPct = Math.round((thisYearBooks / YEAR_GOAL) * 100);
  const onTrack = thisYearBooks >= YEAR_GOAL / 12 * (new Date().getMonth() + 1);

  const isFavorite = (genre) => favoriteGenre && (favoriteGenre === genre || favoriteGenre.startsWith(genre));

  const onRangeKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : RANGES.length - 1)) % RANGES.length;
    setRange(RANGES[next].id);
    document.getElementById(`ls-range-${RANGES[next].id}`)?.focus();
  };

  return (
    <div className="space-y-12">
      {/* The numbers */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {statItems.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="order-2 mt-1 text-sm font-medium text-ink-2">{s.label}</dt>
            <dd className="order-1 t-h1 text-ink tabular">
              {s.value}{s.unit && <span className="ml-1.5 font-sans text-base font-normal text-ink-2">{s.unit}</span>}
            </dd>
            <dd className="order-3 mt-0.5 t-meta">{s.sub}</dd>
          </div>
        ))}
      </dl>

      {/* Listening activity */}
      <section aria-labelledby="ls-activity">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 id="ls-activity" className="t-h2 text-ink">Listening activity</h3>
            <p className="mt-1 text-[0.9375rem] text-ink-2 tabular">
              {range === 'week' && <>{weekTotal.toFixed(1)} hours this week</>}
              {range === 'month' && <>{thisMonthHours} hours this month</>}
              {range === 'year' && <>{thisYearBooks} books finished this year</>}
            </p>
          </div>
          <div role="tablist" aria-label="Time range" className="flex gap-5 border-b border-line">
            {RANGES.map((r, i) => {
              const selected = range === r.id;
              return (
                <button
                  key={r.id}
                  id={`ls-range-${r.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="ls-range-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setRange(r.id)}
                  onKeyDown={(e) => onRangeKey(e, i)}
                  className={`relative h-11 text-sm font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                >
                  {r.label}
                  {selected && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-hl" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        <div id="ls-range-panel" role="tabpanel" aria-labelledby={`ls-range-${range}`} className="mt-6">
          {range === 'week' ? (
            <figure>
              <div className="flex h-52 items-end gap-2 border-b border-line-strong sm:gap-4" role="img" aria-label={`Hours listened each day this week: ${WEEK_HOURS.map((h, i) => `${DAYS[i]} ${h}`).join(', ')}`}>
                {WEEK_HOURS.map((hours, index) => {
                  const isToday = index === todayIndex;
                  return (
                    <div key={DAYS[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" aria-hidden="true">
                      <span className={`text-[0.8125rem] tabular ${isToday ? 'font-semibold text-ink' : 'text-ink-2'}`}>{hours}</span>
                      <div
                        className={`w-full max-w-12 rounded-t-[3px] ${isToday ? 'bg-hl ring-1 ring-inset ring-ink' : 'bg-ink'}`}
                        style={{ height: `${(hours / maxHours) * 82}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-2 sm:gap-4" aria-hidden="true">
                {DAYS.map((d, i) => (
                  <span key={d} className={`flex-1 text-center text-[0.8125rem] ${i === todayIndex ? 'font-semibold text-ink' : 'text-ink-3'}`}>
                    {i === todayIndex ? 'Today' : d}
                  </span>
                ))}
              </div>
              <figcaption className="mt-3 t-meta">Hours a day. Today is marked in highlighter.</figcaption>
            </figure>
          ) : (
            <div className="rounded-lg border border-dashed border-line-strong px-5 py-6">
              <p className="font-serif text-3xl font-medium text-ink tabular">
                {range === 'month' ? <>{thisMonthHours} <span className="font-sans text-base font-normal text-ink-2">hours</span></> : <>{thisYearBooks} <span className="font-sans text-base font-normal text-ink-2">books</span></>}
              </p>
              <p className="mt-1 text-sm text-ink-2">
                {range === 'month' ? 'Listened this month.' : 'Finished this year.'} Day by day detail is kept for the last seven days.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Genre breakdown */}
      <section aria-labelledby="ls-genres">
        <h3 id="ls-genres" className="t-h2 text-ink">Top genres</h3>
        <p className="mt-1 text-[0.9375rem] text-ink-2">
          Favourite genre: <span className="font-semibold text-ink">{favoriteGenre}</span>
        </p>
        <ul className="mt-6 space-y-4">
          {GENRES.map((item) => {
            const fav = isFavorite(item.genre);
            return (
              <li key={item.genre} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_auto] sm:gap-5">
                <span className={`truncate text-sm ${fav ? 'font-semibold text-ink' : 'text-ink-2'}`}>{item.genre}</span>
                <span className="relative h-3 border-l border-line-strong" aria-hidden="true">
                  <span
                    className={`absolute inset-y-0 left-0 rounded-r-[3px] ${fav ? 'bg-hl ring-1 ring-inset ring-ink' : 'bg-ink'}`}
                    style={{ width: `${(item.percentage / GENRES[0].percentage) * 100}%` }}
                  />
                </span>
                <span className="text-right text-[0.8125rem] text-ink-2 tabular">{item.count} books · {item.percentage}%</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Reading goal */}
      <section aria-labelledby="ls-goal" className="rounded-lg border border-line bg-surface p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="ls-goal" className="t-h3 text-ink">{year} reading goal</h3>
          <Badge variant={onTrack ? 'success' : 'default'}>{onTrack ? 'On track' : 'Behind'}</Badge>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="text-sm text-ink-2 tabular">
            <span className="font-serif text-3xl font-medium text-ink">{thisYearBooks}</span> of {YEAR_GOAL} books
          </p>
          <span className="text-sm font-semibold text-ink tabular">{goalPct}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Books toward this year's goal" aria-valuemin={0} aria-valuemax={YEAR_GOAL} aria-valuenow={thisYearBooks}>
          <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(goalPct, 100)}%` }} />
        </div>
        <p className="mt-3 t-meta">
          You are {onTrack ? 'ahead of' : 'behind'} schedule. Keep it up.
        </p>
      </section>
    </div>
  );
};

ListeningStats.propTypes = {
  stats: PropTypes.shape({
    hoursListened: PropTypes.number,
    booksFinished: PropTypes.number,
    currentStreak: PropTypes.number,
    longestStreak: PropTypes.number,
    favoriteGenre: PropTypes.string,
    averageRating: PropTypes.number,
    thisMonthHours: PropTypes.number,
    thisYearBooks: PropTypes.number,
  }),
};

export default ListeningStats;
