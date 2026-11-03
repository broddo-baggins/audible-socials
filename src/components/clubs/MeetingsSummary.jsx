import PropTypes from 'prop-types';

/**
 * MeetingsSummary: how often a club meets and when it meets next.
 * Detailed: a section title, the two numbers that matter, the next meeting and
 * (optionally) the meetings after it. Compact: two lines for a club row.
 */

const longDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const shortDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const relativeDays = (date) => {
  const days = Math.ceil((date - new Date()) / 86400000);
  if (Number.isNaN(days)) return null;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  if (days === -1) return 'Yesterday';
  return `${Math.abs(days)} days ago`;
};

export default function MeetingsSummary({ club, showDetailed = false, showNext = true, showList = true, headingId }) {
  if (!club) return null;

  const upcomingEvents = club.events || [];
  const nextEvent = upcomingEvents[0];
  const nextEventDate = nextEvent ? new Date(nextEvent.date) : null;
  const nextValid = nextEventDate && !Number.isNaN(nextEventDate.getTime());
  const when = nextValid ? relativeDays(nextEventDate) : null;

  if (showDetailed) {
    return (
      <div>
        <h2 id={headingId} className="t-h2 text-ink">Meetings</h2>
        <dl className="mt-5 flex flex-wrap gap-x-12 gap-y-5">
          <div className="flex flex-col-reverse">
            <dt className="mt-1 text-[0.8125rem] text-ink-3">meetings a month</dt>
            <dd className="font-serif text-4xl font-medium leading-none text-ink tabular">{club.meetingsPerMonth ?? 0}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="mt-1 text-[0.8125rem] text-ink-3">{upcomingEvents.length === 1 ? 'scheduled event' : 'scheduled events'}</dt>
            <dd className="font-serif text-4xl font-medium leading-none text-ink tabular">{upcomingEvents.length}</dd>
          </div>
          {!showNext && nextValid && (
            <div className="flex flex-col-reverse">
              <dt className="mt-1 text-[0.8125rem] text-ink-3">{nextEventDate < new Date() ? 'last meeting' : 'next meeting'}, {shortDate(nextEventDate)}</dt>
              <dd className="font-serif text-4xl font-medium leading-none text-ink tabular">{when}</dd>
            </div>
          )}
        </dl>

        {showNext && nextEvent && (
          <div className="mt-6 rounded-lg border border-line bg-surface p-5">
            <p className="text-[0.8125rem] font-medium text-ink-3">Next meeting{when ? `, ${when.toLowerCase()}` : ''}</p>
            <h3 className="mt-1 t-h3 text-ink">{nextEvent.title}</h3>
            {nextValid && <p className="mt-1 text-sm text-ink-2 tabular">{longDate(nextEventDate)}</p>}
            {nextEvent.description && <p className="mt-3 max-w-[62ch] text-[0.9375rem] text-ink-2">{nextEvent.description}</p>}
            {nextEvent.rsvpCount ? <p className="mt-3 text-[0.8125rem] text-ink-3 tabular">{nextEvent.rsvpCount.toLocaleString()} attending</p> : null}
          </div>
        )}

        {showList && upcomingEvents.length > 1 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-ink-2">After that</h3>
            <ol className="mt-2 divide-y divide-line border-y border-line">
              {upcomingEvents.slice(1, 4).map((event) => (
                <li key={event.id} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="min-w-0 truncate text-[0.9375rem] font-medium text-ink">{event.title}</span>
                  <span className="shrink-0 text-[0.8125rem] text-ink-3 tabular">{shortDate(new Date(event.date))}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  // Compact version for club rows and cards
  return (
    <div className="text-[0.8125rem] text-ink-2">
      <p>
        <span className="font-medium text-ink tabular">{club.meetingsPerMonth ?? 0} meetings a month</span>
        {upcomingEvents.length > 0 && <span className="tabular">, {upcomingEvents.length} upcoming</span>}
      </p>
      {nextEvent && nextValid && (
        <p className="mt-0.5 line-clamp-1">
          Next: {nextEvent.title}, <span className="tabular">{shortDate(nextEventDate)}</span>
        </p>
      )}
    </div>
  );
}

MeetingsSummary.propTypes = {
  club: PropTypes.object,
  showDetailed: PropTypes.bool,
  showNext: PropTypes.bool,
  showList: PropTypes.bool,
  headingId: PropTypes.string,
};
