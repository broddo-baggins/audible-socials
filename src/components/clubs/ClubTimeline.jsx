import { useState } from 'react';
import PropTypes from 'prop-types';
import { Users, BookOpen, Calendar, Award, Trophy, Flag, Star } from 'lucide-react';
import clubMilestonesData from '../../data/clubMilestones.json';
import usersData from '../../data/users.json';
import { Avatar, EmptyState } from '../ui';

/**
 * ClubTimeline: a club's history. The numbers first, then the goals it is
 * working towards, then everything that happened, newest first, on one hairline.
 */

const typeIcon = {
  club_founded: Flag,
  member_milestone: Users,
  event: Calendar,
  book_completion: BookOpen,
  member_achievement: Award,
  anniversary: Trophy,
};

const filters = [
  { id: 'all', label: 'All' },
  { id: 'event', label: 'Events' },
  { id: 'book_completion', label: 'Books' },
  { id: 'member_achievement', label: 'Achievements' },
  { id: 'member_milestone', label: 'Members' },
];

const formatAgo = (timestamp) => {
  const diffDays = Math.floor(Math.abs(Date.now() - new Date(timestamp)) / 86400000);
  if (Number.isNaN(diffDays)) return '';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  const y = Math.floor(diffDays / 365);
  return `${y} year${y === 1 ? '' : 's'} ago`;
};

const participantNames = (ids) => {
  if (!ids || ids.length === 0) return null;
  const names = ids.map((id) => usersData.find((u) => u.id === id)?.name || 'Unknown');
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} others`;
};

export default function ClubTimeline({ clubId }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const clubData = clubMilestonesData.find((c) => c.clubId === clubId);
  const milestones = clubData?.milestones || [];
  const clubStats = clubData?.stats || null;
  const upcomingMilestones = clubData?.upcomingMilestones || [];

  const sortedMilestones = milestones
    .filter((m) => activeFilter === 'all' || m.type === activeFilter)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const activeMembers = (clubStats?.mostActiveMembers || []).slice(0, 3).map((id) => usersData.find((u) => u.id === id)).filter(Boolean);

  return (
    <div className="space-y-16">
      {clubStats && (
        <section aria-labelledby="club-stats">
          <h2 id="club-stats" className="t-h2 text-ink">The club in numbers</h2>
          <dl className="mt-5 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
            {[
              ['books read', clubStats.totalBooks],
              ['events held', clubStats.totalEvents],
              ['discussions', clubStats.totalDiscussions],
              ['average completion', `${clubStats.averageCompletion}%`],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[0.8125rem] text-ink-3">{label}</dt>
                <dd className="t-h1 text-ink tabular">{typeof value === 'number' ? value.toLocaleString() : value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {upcomingMilestones.length > 0 && (
        <section aria-labelledby="club-goals">
          <h2 id="club-goals" className="t-h2 text-ink">Working towards</h2>
          <ul className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {upcomingMilestones.map((m) => {
              const progress = m.target ? Math.min(100, (m.currentProgress / m.target) * 100) : 0;
              return (
                <li key={m.title}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-semibold text-ink">{m.title}</h3>
                    <span className="shrink-0 text-[0.8125rem] text-ink-3 tabular">
                      {m.currentProgress.toLocaleString()} of {m.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label={m.title}>
                    <div className="h-full rounded-full bg-ink" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-1.5 flex justify-between text-[0.8125rem] text-ink-3 tabular">
                    <span>{Math.round(progress)}% there</span>
                    {m.estimatedDate && <span>Expected {new Date(m.estimatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="club-history">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="club-history" className="t-h2 text-ink">Timeline</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the timeline">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                aria-pressed={activeFilter === f.id}
                className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                  activeFilter === f.id ? 'bg-ink text-paper' : 'border border-line-strong text-ink hover:bg-surface'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {sortedMilestones.length === 0 ? (
          <EmptyState
            className="mt-6"
            title={milestones.length === 0 ? 'No history yet' : 'Nothing of this kind yet'}
            description={milestones.length === 0 ? 'Milestones show up here as the club reads, meets and grows.' : 'Try another filter to see the rest of the club’s history.'}
            {...(milestones.length > 0 ? { action: 'Show everything', onAction: () => setActiveFilter('all') } : {})}
          />
        ) : (
          <ol className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-[1.1875rem] before:top-2 before:w-px before:bg-line">
            {sortedMilestones.map((m) => {
              const Icon = typeIcon[m.type] || Star;
              const meta = m.metadata || {};
              const facts = [
                meta.attendeeCount && `${meta.attendeeCount.toLocaleString()} attendees`,
                meta.completionRate && `${meta.completionRate}% finished`,
                meta.badgeEarned && 'Badge earned',
                meta.daysEarly && `${meta.daysEarly} days early`,
                meta.memberCount && `${meta.memberCount.toLocaleString()} members`,
              ].filter(Boolean);
              return (
                <li key={m.id} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
                  <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2">
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-1.5">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="font-semibold text-ink">{m.title}</h3>
                      <span className="shrink-0 text-[0.8125rem] text-ink-3 tabular">{formatAgo(m.timestamp)}</span>
                    </div>
                    {m.description && <p className="mt-1 max-w-[62ch] text-[0.9375rem] text-ink-2">{m.description}</p>}
                    {participantNames(m.participants) && (
                      <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-ink-3">
                        <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        {participantNames(m.participants)}
                      </p>
                    )}
                    {facts.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {facts.map((f) => (
                          <li key={f} className="rounded-sm bg-surface-sunk px-2 py-0.5 text-xs font-medium text-ink-2 tabular">{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {activeMembers.length > 0 && (
        <section aria-labelledby="active-members">
          <h2 id="active-members" className="t-h2 text-ink">Most active members</h2>
          <ol className="mt-5 divide-y divide-line border-y border-line">
            {activeMembers.map((user, index) => (
              <li key={user.id} className="flex items-center gap-4 py-3.5">
                <span className="w-6 font-serif text-xl font-medium text-ink-3 tabular">{index + 1}</span>
                <Avatar src={user.avatar} name={user.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{user.name}</p>
                  <p className="text-[0.8125rem] text-ink-3 tabular">{user.stats?.booksCompleted || 0} books finished</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

ClubTimeline.propTypes = {
  clubId: PropTypes.string.isRequired,
};
