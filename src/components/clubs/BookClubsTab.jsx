import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Users, CalendarDays } from 'lucide-react';
import clubsData from '../../data/clubs.json';
import booksData from '../../data/books.json';
import usersData from '../../data/users.json';
import { getUserData, getJoinedClubs, getPrivateClubs } from '../../utils/localStorage';
import { Cover, Waveform, Badge, Button, EmptyState } from '../ui';
import MeetingsSummary from './MeetingsSummary';
import CreatePrivateClub from './CreatePrivateClub';

/**
 * BookClubsTab: your clubs first (as large rows with the book you are on),
 * then featured clubs as a list, then how clubs work. A private club can be
 * started from here.
 */

const bookFor = (club) => booksData.find((b) => b.id === club.currentBook);

const loadJoined = () => {
  const ids = getJoinedClubs();
  const privateClubs = getPrivateClubs();
  return [
    ...clubsData.filter((c) => ids.includes(c.id)),
    ...privateClubs.filter((c) => ids.includes(c.id)),
  ];
};

export default function BookClubsTab() {
  const [userData] = useState(() => getUserData());
  const [joinedClubs, setJoinedClubs] = useState(loadJoined);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const joinedIds = joinedClubs.map((c) => c.id);
  const featuredClubs = clubsData
    .filter((club) => !joinedIds.includes(club.id))
    .filter((club) => !club.isPremium || userData?.isPremium)
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 6);

  const handleClubCreated = (newClub) => {
    setJoinedClubs((prev) => (prev.some((c) => c.id === newClub.id) ? prev : [...prev, newClub]));
    setShowCreateModal(false);
  };

  const maxClubs = userData?.isPremium ? 3 : 2;
  const atLimit = joinedClubs.length >= maxClubs;

  return (
    <div className="space-y-16 pt-6 md:space-y-20">
      {/* Your clubs */}
      <section aria-labelledby="your-clubs">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="your-clubs" className="t-h2 text-ink">Your clubs</h2>
            <p className="mt-1 text-[0.9375rem] text-ink-2 tabular">
              {joinedClubs.length} of {maxClubs} clubs{!userData?.isPremium && ', Premium allows 3'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" strokeWidth={1.75} />}>
            Start a private club
          </Button>
        </div>

        {joinedClubs.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="You are not in a club yet"
            description="Pick one below. You read the month's book on your own time and meet the others live."
          />
        ) : (
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {joinedClubs.map((club) => {
              const book = bookFor(club);
              return (
                <li key={club.id}>
                  <Link to={`/club/${club.id}`} className="group grid h-full grid-cols-[5.5rem_minmax(0,1fr)] gap-5 rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <Cover src={book?.cover} title={book?.title || club.name} author={book?.author} />
                    <div className="flex min-w-0 flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        {club.isPrivate && <Badge size="sm" variant="outline">Private</Badge>}
                        {club.isPremium && <Badge size="sm" variant="primary">Premium</Badge>}
                      </div>
                      <h3 className="mt-1 font-serif text-xl font-medium leading-tight text-ink group-hover:underline underline-offset-4 decoration-1">{club.name}</h3>
                      <p className="mt-0.5 text-[0.8125rem] text-ink-3">Hosted by {club.host === userData?.id ? 'you' : usersData.find((u) => u.id === club.host || `user-${u.id}` === club.host)?.name || club.host}</p>
                      {book && (
                        <p className="mt-3 text-[0.9375rem] text-ink-2">
                          Reading <span className="t-title-book text-ink">{book.title}</span>
                        </p>
                      )}
                      <Waveform seed={`club-${club.id}`} bars={48} height={14} className="mt-3 h-3.5 w-full max-w-[16rem] text-ink-3" />
                      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-ink-2 tabular">
                        {Number.isFinite(club.daysRemaining) && <div><dt className="sr-only">Time left</dt><dd>{club.daysRemaining} days left</dd></div>}
                        <div><dt className="sr-only">Members</dt><dd>{(club.memberCount || 0).toLocaleString()} members</dd></div>
                      </dl>
                      <div className="mt-3 border-t border-line pt-3">
                        <MeetingsSummary club={club} />
                      </div>
                      {club.perks?.[0] && <p className="mt-2 text-[0.8125rem] text-ink-3 line-clamp-1">Perk: {club.perks[0]}</p>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Featured clubs */}
      <section aria-labelledby="featured-clubs">
        <h2 id="featured-clubs" className="t-h2 text-ink">Featured clubs</h2>
        <p className="mt-1 text-[0.9375rem] text-ink-2">The biggest clubs you are not in yet.</p>

        {featuredClubs.length === 0 && atLimit ? (
          <EmptyState
            className="mt-6"
            title="You have reached your club limit"
            description={`You are in ${maxClubs} clubs. Leave one to join a new one.`}
            {...(!userData?.isPremium ? { action: 'Upgrade to Premium for 3 clubs', actionTo: '/profile' } : {})}
          />
        ) : featuredClubs.length === 0 ? (
          <EmptyState className="mt-6" title="You are in every featured club" description="New clubs open each month. Check back soon." />
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {featuredClubs.map((club) => {
              const book = bookFor(club);
              return (
                <li key={club.id}>
                  <Link to={`/club/${club.id}`} className="group grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)_13rem] sm:gap-6">
                    <Cover src={book?.cover} title={book?.title || club.name} author={book?.author} shadow={false} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-serif text-lg font-medium text-ink group-hover:underline underline-offset-4 decoration-1 md:text-xl">{club.name}</h3>
                        {club.isPremium && <Badge size="sm" variant="primary">Premium</Badge>}
                      </div>
                      <p className="text-[0.8125rem] text-ink-3">
                        Hosted by {club.host}
                        {book && <> · reading <span className="t-title-book text-ink-2">{book.title}</span></>}
                      </p>
                      <p className="mt-2 max-w-[60ch] text-sm text-ink-2 line-clamp-2">{club.description}</p>
                      {club.perks?.[0] && (
                        <p className="mt-2 flex items-start gap-1.5 text-[0.8125rem] text-ink-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" /> {club.perks[0]}
                        </p>
                      )}
                    </div>
                    <dl className="col-start-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.8125rem] text-ink-2 tabular sm:col-start-auto sm:block sm:space-y-1.5 sm:text-right">
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        <dt><Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-label="Members" /></dt>
                        <dd>{club.memberCount.toLocaleString()} members</dd>
                      </div>
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        <dt><CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} aria-label="Meetings" /></dt>
                        <dd>{club.meetingsPerMonth} a month{club.events?.length ? `, ${club.events.length} upcoming` : ''}</dd>
                      </div>
                      {club.discounts?.monthlyBook && (
                        <div className="col-span-2 sm:col-span-1">
                          <dt className="sr-only">Member saving</dt>
                          <dd className="font-medium text-ink">Save ${club.discounts.monthlyBook.maxSavings} <span className="font-normal text-ink-3">{club.discounts.monthlyBook.description}</span></dd>
                        </div>
                      )}
                    </dl>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* How clubs work */}
      <section aria-labelledby="how-clubs" className="grid gap-8 rounded-2xl border border-line bg-surface p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:p-10">
        <div>
          <h2 id="how-clubs" className="t-h2 text-ink">How clubs work</h2>
          <p className="mt-3 text-[0.9375rem] text-ink-2">
            Clubs are hosted by authors, celebrities and themed communities. You listen to the month&rsquo;s book, come to live events and always know what to read next.
          </p>
          <p className="mt-3 text-sm text-ink-3 tabular">
            You can be in up to {maxClubs} clubs at a time{!userData?.isPremium && ' (3 with Premium)'}.
          </p>
        </div>
        <ul className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            'Books picked by experts and hosts you follow',
            'Live author Q&As and online events',
            '2-for-1 offers on featured books',
            'Badges and streaks for taking part',
            'Your listening shared with friends',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 border-t border-line pt-3 text-[0.9375rem] text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" strokeWidth={2} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {showCreateModal && <CreatePrivateClub onClubCreated={handleClubCreated} onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
