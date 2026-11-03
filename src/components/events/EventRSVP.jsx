import { useState } from 'react';
import PropTypes from 'prop-types';
import { Check, Bell } from 'lucide-react';
import { getUserData, saveUserData } from '../../utils/localStorage';

/**
 * EventRSVP: one club event as a list row. Type and access as quiet tags,
 * the date and turnout as meta, capacity as an ink bar, and one RSVP button.
 */

const typeLabels = {
  celebrity_chat: 'Celebrity chat',
  author_chat: 'Author interview',
  author_qa: 'Author Q&A',
  narrator_qa: 'Narrator Q&A',
  discussion: 'Group discussion',
  workshop: 'Workshop',
  meetup: 'Meetup',
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function EventRSVP({ event, isNext = false }) {
  const [hasRSVP, setHasRSVP] = useState(() => getUserData().rsvpEvents?.includes(event.id) || false);
  const [loading, setLoading] = useState(false);

  const handleRSVP = () => {
    setLoading(true);
    const user = getUserData();
    if (!user.rsvpEvents) user.rsvpEvents = [];

    if (hasRSVP) {
      user.rsvpEvents = user.rsvpEvents.filter((id) => id !== event.id);
      setHasRSVP(false);
    } else {
      user.rsvpEvents.push(event.id);
      setHasRSVP(true);
    }

    saveUserData(user);
    setTimeout(() => setLoading(false), 300);
  };

  const rsvpCount = event.rsvpCount || 0;
  const capacity = event.maxCapacity || 0;
  const capacityPercentage = capacity ? Math.min(100, (rsvpCount / capacity) * 100) : 0;
  const spotsLeft = Math.max(0, capacity - rsvpCount);
  const when = formatDate(event.date);
  const tags = [
    typeLabels[event.type] || event.type,
    event.isExclusive && 'Members only',
    event.qaEnabled && 'Live Q&A',
  ].filter(Boolean);

  return (
    <article className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8" aria-labelledby={`event-${event.id}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-ink-3">
          {isNext && <span className="rounded-sm bg-hl px-1.5 py-0.5 text-[0.6875rem] font-semibold text-ink">Next</span>}
          {tags.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">·</span>}
              {t}
            </span>
          ))}
        </div>
        <h3 id={`event-${event.id}`} className="mt-1.5 text-[1.0625rem] font-semibold text-ink">{event.title}</h3>
        {when && <p className="mt-0.5 text-sm text-ink-2 tabular">{when}</p>}
        {event.description && <p className="mt-2 max-w-[62ch] text-[0.9375rem] text-ink-2">{event.description}</p>}

        {capacity > 0 && (
          <div className="mt-3 max-w-sm">
            <div className="h-1 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={capacity} aria-valuenow={rsvpCount} aria-label="Event capacity">
              <div className="h-full rounded-full bg-ink" style={{ width: `${capacityPercentage}%` }} />
            </div>
            <p className="mt-1.5 text-[0.8125rem] text-ink-3 tabular">
              {rsvpCount.toLocaleString()} going, {spotsLeft.toLocaleString()} spots left
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-1.5 sm:items-end sm:pt-6">
        <button
          type="button"
          onClick={handleRSVP}
          disabled={loading}
          aria-pressed={hasRSVP}
          className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-medium transition-colors disabled:opacity-60 ${
            hasRSVP ? 'border border-line-strong bg-surface text-ink hover:bg-paper' : 'bg-ink text-paper hover:bg-gray-800'
          }`}
        >
          {hasRSVP ? <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
          {hasRSVP ? 'Going, reminder set' : 'RSVP and remind me'}
        </button>
        {hasRSVP && <p className="text-[0.8125rem] text-ink-3">We will remind you 15 minutes before.</p>}
      </div>
    </article>
  );
}

EventRSVP.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    date: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    rsvpCount: PropTypes.number,
    maxCapacity: PropTypes.number,
    isExclusive: PropTypes.bool,
    qaEnabled: PropTypes.bool,
  }).isRequired,
  clubId: PropTypes.string,
  isNext: PropTypes.bool,
};
