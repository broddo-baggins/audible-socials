import { useState, useId, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Check, X, Video, Plus } from 'lucide-react';
import { getClubEvents, createClubEvent, rsvpClubEvent, getUserData } from '../../utils/localStorage';
import { Button, Input, EmptyState } from '../ui';

/**
 * PrivateClubMeetups: the club's meetups as dated rows (a calendar block on the
 * left, the details, one RSVP button). The host schedules new ones in a sheet.
 */

const fieldClass = 'w-full rounded-lg border border-line-strong bg-surface px-3.5 py-3 text-base text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none resize-none';

const loadEvents = (club) => {
  const stored = getClubEvents(club.id);
  return stored.length > 0 ? stored : club.events || [];
};

const parts = (s) => {
  const d = new Date(s);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
    date: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    upcoming: d > new Date(),
  };
};

const emptyMeetup = { title: '', date: '', time: '', description: '', isOnline: true, meetingLink: '' };

export default function PrivateClubMeetups({ club, currentUser, onRSVP }) {
  const [events, setEvents] = useState(() => loadEvents(club));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeetup, setNewMeetup] = useState(emptyMeetup);
  const [loading, setLoading] = useState(false);
  const isHost = currentUser?.id === club.host;

  const handleCreateMeetup = async () => {
    if (!newMeetup.title.trim() || !newMeetup.date || !newMeetup.time) return;
    setLoading(true);
    const userData = getUserData();
    const result = createClubEvent(club.id, {
      title: newMeetup.title,
      date: `${newMeetup.date}T${newMeetup.time}:00`,
      type: 'meetup',
      description: newMeetup.description,
      isOnline: newMeetup.isOnline,
      meetingLink: newMeetup.isOnline ? newMeetup.meetingLink : null,
      host: userData.id,
      rsvpCount: 1,
      maxCapacity: (club.members || []).length,
      attendees: [userData.id],
    });
    if (result.success) {
      setEvents((prev) => [...prev, result.event]);
      setNewMeetup(emptyMeetup);
      setShowCreateModal(false);
    }
    setLoading(false);
  };

  const handleRSVP = async (eventId, attending) => {
    setLoading(true);
    const userData = getUserData();
    const result = rsvpClubEvent(club.id, eventId, userData.id, attending);
    if (result.success) {
      setEvents((prev) => prev.map((e) => (e.id === eventId ? result.event : e)));
      onRSVP?.(eventId, attending);
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <section aria-labelledby="meetups-title" className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="meetups-title" className="t-h2 text-ink">Meetups</h2>
            <p className="mt-1 text-[0.9375rem] text-ink-2">Online discussions and meetups in person.</p>
          </div>
          {isHost && <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" strokeWidth={1.75} />}>Schedule a meetup</Button>}
        </div>

        {events.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No meetups scheduled"
            description={isHost ? 'Schedule the first one to bring your club together.' : 'Check back later for meetups.'}
            {...(isHost ? { action: 'Schedule the first meetup', onAction: () => setShowCreateModal(true) } : {})}
          />
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {events.map((event) => {
              const p = parts(event.date);
              const isAttending = event.attendees?.includes(currentUser?.id);
              return (
                <li key={event.id} className={`grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-5 ${p.upcoming ? '' : 'opacity-80'}`}>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg border border-line bg-surface" aria-hidden="true">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-ink-3">{p.month}</span>
                    <span className="font-serif text-xl font-medium leading-none text-ink tabular">{p.day}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{event.title}</h3>
                      {event.isOnline && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-surface-sunk px-1.5 py-0.5 text-xs font-medium text-ink-2">
                          <Video className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" /> Online
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-2 tabular">{p.date}, {p.time} · {event.rsvpCount || 0} attending</p>
                    {event.description && <p className="mt-2 max-w-[62ch] text-[0.9375rem] text-ink-2">{event.description}</p>}

                    {p.upcoming ? (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleRSVP(event.id, !isAttending)}
                          disabled={loading}
                          aria-pressed={!!isAttending}
                          className={`inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[0.9375rem] font-medium transition-colors disabled:opacity-60 ${
                            isAttending ? 'border border-line-strong bg-surface text-ink hover:bg-paper' : 'bg-ink text-paper hover:bg-gray-800'
                          }`}
                        >
                          {isAttending && <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
                          {isAttending ? 'You are going' : 'RSVP'}
                        </button>
                        {event.isOnline && event.meetingLink && (
                          <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
                            <Video className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Join the meeting
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-[0.8125rem] text-ink-3">This meetup has already happened.</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside aria-labelledby="meetup-tips">
        <h3 id="meetup-tips" className="t-h3 text-ink">Tips for a good meetup</h3>
        <ul className="mt-3 space-y-2 text-[0.9375rem] text-ink-2">
          <li>Meet one or two weeks after finishing a book.</li>
          <li>Keep it to 60 to 90 minutes.</li>
          <li>Bring a few questions to start with.</li>
          <li>Warn before talking about the plot.</li>
          <li>Record the session for anyone who misses it.</li>
        </ul>
      </aside>

      {showCreateModal && (
        <ScheduleDialog
          meetup={newMeetup}
          setMeetup={setNewMeetup}
          loading={loading}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMeetup}
        />
      )}
    </div>
  );
}

function ScheduleDialog({ meetup, setMeetup, loading, onClose, onSubmit }) {
  const descId = useId();
  const dateId = useId();
  const timeId = useId();
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const set = (k, v) => setMeetup((p) => ({ ...p, [k]: v }));
  const valid = meetup.title.trim() && meetup.date && meetup.time;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-title"
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="max-h-[92vh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-lg sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="schedule-title" className="t-h2 text-ink">Schedule a meetup</h2>
          <button ref={closeRef} type="button" onClick={onClose} className="-mr-2 -mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <Input label="Title" value={meetup.title} onChange={(e) => set('title', e.target.value)} placeholder="For example, monthly book talk" fullWidth />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={dateId} className="mb-1.5 block text-sm font-medium text-ink">Date</label>
            <input id={dateId} type="date" value={meetup.date} onChange={(e) => set('date', e.target.value)} className={`${fieldClass} h-11 py-0`} />
          </div>
          <div>
            <label htmlFor={timeId} className="mb-1.5 block text-sm font-medium text-ink">Time</label>
            <input id={timeId} type="time" value={meetup.time} onChange={(e) => set('time', e.target.value)} className={`${fieldClass} h-11 py-0`} />
          </div>
        </div>
        <div>
          <label htmlFor={descId} className="mb-1.5 block text-sm font-medium text-ink">Description</label>
          <textarea id={descId} value={meetup.description} onChange={(e) => set('description', e.target.value)} placeholder="What will you talk about?" rows={3} className={fieldClass} />
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink">Where</legend>
          <label className="flex min-h-11 items-center gap-3 text-[0.9375rem] text-ink">
            <input type="radio" name="meetingType" checked={meetup.isOnline} onChange={() => set('isOnline', true)} className="h-4 w-4 accent-[var(--ink)]" />
            Online (Zoom, Google Meet and the like)
          </label>
          <label className="flex min-h-11 items-center gap-3 text-[0.9375rem] text-ink">
            <input type="radio" name="meetingType" checked={!meetup.isOnline} onChange={() => set('isOnline', false)} className="h-4 w-4 accent-[var(--ink)]" />
            In person
          </label>
        </fieldset>
        {meetup.isOnline && (
          <Input label="Meeting link" type="url" value={meetup.meetingLink} onChange={(e) => set('meetingLink', e.target.value)} placeholder="https://zoom.us/..." fullWidth />
        )}
        <div className="flex justify-end gap-3 border-t border-line pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!valid} loading={loading}>Schedule</Button>
        </div>
      </form>
    </div>
  );
}

PrivateClubMeetups.propTypes = {
  club: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  onRSVP: PropTypes.func,
};
