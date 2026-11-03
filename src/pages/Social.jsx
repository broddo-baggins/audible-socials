import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Check, Users, CalendarDays } from 'lucide-react';
import SocialNudges from '../components/social/SocialNudges';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import { PageHeader, Avatar, Cover, Waveform, Badge, EmptyState } from '../components/ui';
import { getUserData, getFriends, getJoinedClubs } from '../utils/localStorage';
import { getFriendsOfFriends, sendFriendRequest } from '../utils/friendManagement';
import usersData from '../data/users.json';
import clubsData from '../data/clubs.json';
import booksData from '../data/books.json';

/**
 * Social: the people side of Listenable. Your numbers, set as type; a feed of
 * what friends are doing; who is listening right now; clubs worth joining;
 * what you have earned. No banner, no tiles.
 */

const bookById = (id) => booksData.find((b) => b.id === id);

const loadState = () => {
  const user = getUserData();
  const friendIds = getFriends();
  const friends = usersData.filter((u) => friendIds.includes(u.id));
  const joinedClubIds = getJoinedClubs();
  const featuredClubs = clubsData
    .filter((club) => !joinedClubIds.includes(club.id))
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3);
  return {
    userData: user,
    friends,
    friendsOfFriends: getFriendsOfFriends('user-me', usersData).slice(0, 4),
    featuredClubs,
    stats: {
      totalFriends: friends.length,
      clubsJoined: joinedClubIds.length,
      booksShared: user.library?.length || 0,
    },
  };
};

const Social = () => {
  const [{ userData, friends, friendsOfFriends, featuredClubs, stats }] = useState(loadState);
  const [requested, setRequested] = useState([]);

  const listeningNow = friends
    .map((f) => ({ ...f, book: f.currentlyReading ? bookById(f.currentlyReading) : null }))
    .filter((f) => f.book)
    .slice(0, 3);

  const handleAddFriend = (user) => {
    const result = sendFriendRequest(user.id, 'Hi, we have friends in common. I would love to connect and share recommendations.', null, {});
    if (result.success || result.error === 'Request already exists') setRequested((prev) => [...prev, user.id]);
  };

  const [leadClub, ...moreClubs] = featuredClubs;
  const leadBook = leadClub ? bookById(leadClub.currentBook) : null;

  return (
    <div className="page pb-20">
      <PageHeader
        title="Social"
        description="What your friends are listening to, the clubs worth joining and what you have earned."
        actions={
          <>
            <Link to="/clubs/friends" className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">
              <UserPlus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Find friends
            </Link>
            <Link to="/clubs" className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">
              Browse clubs
            </Link>
          </>
        }
      >
        <dl className="grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6">
          {[
            [stats.totalFriends === 1 ? 'friend' : 'friends', stats.totalFriends, '/clubs/friends'],
            [stats.clubsJoined === 1 ? 'book club' : 'book clubs', stats.clubsJoined, '/clubs'],
            ['books shared', stats.booksShared, '/library'],
          ].map(([label, value, to]) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="mt-1 text-[0.8125rem] text-ink-3">{label}</dt>
              <dd className="t-h1 text-ink tabular"><Link to={to} className="hover:underline underline-offset-[6px] decoration-1">{value}</Link></dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <div className="space-y-16 md:space-y-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
          {/* Friend activity */}
          <section aria-labelledby="activity-title" className="min-w-0">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="activity-title" className="t-h2 text-ink">Friend activity</h2>
              <Link to="/clubs/activity" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4">
                All activity <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-4">
              <SocialNudges limit={6} />
            </div>
          </section>

          <aside className="min-w-0 space-y-12">
            {friends.length === 0 ? (
              <EmptyState
                title="Find people to listen with"
                description="Add friends to see what they are listening to and swap recommendations."
                action="Find friends"
                actionTo="/clubs/friends"
              />
            ) : (
              listeningNow.length > 0 && (
                <section aria-labelledby="now-title">
                  <h2 id="now-title" className="t-h3 text-ink">Listening right now</h2>
                  <ul className="mt-3 divide-y divide-line border-y border-line">
                    {listeningNow.map((friend) => (
                      <li key={friend.id} className="flex items-center gap-3 py-3.5">
                        <Avatar src={friend.avatar} name={friend.name} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.9375rem] text-ink">
                            <span className="font-semibold">{friend.name}</span>
                            {friend.isPremium && <Badge size="sm" variant="outline" className="ml-2 align-middle">Premium</Badge>}
                          </p>
                          <Link to={`/book/${friend.book.id}`} className="t-title-book block text-sm text-ink-2 line-clamp-1 hover:underline underline-offset-4">{friend.book.title}</Link>
                          {friend.currentProgress > 0 && (
                            <div className="mt-1.5 flex items-center gap-2">
                              <Waveform seed={`${friend.id}-${friend.book.id}`} bars={28} height={12} progress={friend.currentProgress / 100} className="h-3 w-24 text-ink" label={`${friend.currentProgress}% listened`} />
                              <span className="text-xs text-ink-3 tabular">{friend.currentProgress < 100 ? `${100 - friend.currentProgress}% to go` : 'Finished'}</span>
                            </div>
                          )}
                        </div>
                        <Link to={`/book/${friend.book.id}`} className="w-10 shrink-0 rounded-sm" aria-label={`${friend.book.title} details`}>
                          <Cover src={friend.book.cover} title={friend.book.title} shadow={false} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/clubs/friends" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
                    All your friends
                  </Link>
                </section>
              )
            )}

            {friendsOfFriends.length > 0 && (
              <section aria-labelledby="fof-social">
                <h2 id="fof-social" className="t-h3 text-ink">Friends of friends</h2>
                <p className="mt-1 text-sm text-ink-2">People you may know through your friends.</p>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {friendsOfFriends.map((user) => {
                    const sent = requested.includes(user.id);
                    return (
                      <li key={user.id} className="flex items-center gap-3 py-3">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.9375rem] font-medium text-ink">{user.name}</p>
                          <p className="text-[0.8125rem] text-ink-3 tabular">{user.mutualFriends} mutual friend{user.mutualFriends !== 1 ? 's' : ''}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddFriend(user)}
                          disabled={sent}
                          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink hover:bg-surface disabled:border-transparent disabled:text-success"
                        >
                          {sent ? <><Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Requested</> : 'Add friend'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </aside>
        </div>

        {/* Featured clubs: one large, the next two as rows */}
        {leadClub && (
          <section aria-labelledby="clubs-social" className="rounded-2xl border border-line bg-surface p-5 md:p-8 lg:p-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="clubs-social" className="t-h2 text-ink">Clubs to join</h2>
                <p className="mt-1 text-[0.9375rem] text-ink-2">Thousands of listeners, author events and member perks.</p>
              </div>
              <Link to="/clubs" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4 sm:inline-flex">
                All clubs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
              <Link to={`/club/${leadClub.id}`} className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-lg sm:gap-5 md:grid-cols-[9rem_minmax(0,1fr)]">
                <Cover src={leadBook?.cover} title={leadBook?.title || leadClub.name} author={leadBook?.author} />
                <div className="min-w-0">
                  <p className="text-[0.8125rem] text-ink-3">Hosted by {leadClub.host}{leadClub.isPremium && ' · Premium'}</p>
                  <h3 className="mt-1 font-serif text-2xl font-medium leading-tight text-ink group-hover:underline underline-offset-4 decoration-1 md:text-[1.75rem]">{leadClub.name}</h3>
                  {leadBook && <p className="mt-3 text-[0.9375rem] text-ink-2">Now reading <span className="t-title-book text-ink">{leadBook.title}</span></p>}
                  <Waveform seed={`club-${leadClub.id}`} bars={56} height={16} className="mt-4 h-4 w-full max-w-xs text-ink-3" />
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2 tabular">
                    <div className="flex items-center gap-1.5">
                      <dt><Users className="h-4 w-4" strokeWidth={1.75} aria-label="Members" /></dt>
                      <dd>{leadClub.memberCount.toLocaleString()} members</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt><CalendarDays className="h-4 w-4" strokeWidth={1.75} aria-label="Time left" /></dt>
                      <dd>{leadClub.daysRemaining} days left</dd>
                    </div>
                  </dl>
                  {leadClub.perks?.[0] && <p className="mt-3 text-sm text-ink-2">Perk: {leadClub.perks[0]}</p>}
                </div>
              </Link>

              <ul className="self-start divide-y divide-line border-y border-line">
                {moreClubs.map((club) => {
                  const book = bookById(club.currentBook);
                  return (
                    <li key={club.id}>
                      <Link to={`/club/${club.id}`} className="group flex items-center gap-4 py-4">
                        <div className="w-11 shrink-0"><Cover src={book?.cover} title={book?.title || club.name} shadow={false} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-ink group-hover:underline underline-offset-4">{club.name}</p>
                          <p className="text-[0.8125rem] text-ink-2 line-clamp-1">
                            {book ? <>Reading <span className="t-title-book">{book.title}</span></> : `Hosted by ${club.host}`}
                          </p>
                          {club.perks?.[0] && <p className="text-[0.8125rem] text-ink-3 line-clamp-1">{club.perks[0]}</p>}
                        </div>
                        <span className="shrink-0 text-right text-[0.8125rem] text-ink-3 tabular">
                          {club.memberCount.toLocaleString()}<br />{club.daysRemaining} days left
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Link to="/clubs" className="mt-6 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4 sm:hidden">
              All clubs <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </section>
        )}

        {/* Achievements */}
        <section aria-labelledby="achievements-title">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="achievements-title" className="t-h2 text-ink">Your achievements</h2>
            <Link to="/account" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4">
              All badges <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5">
            <BadgeDisplay earnedBadges={userData?.badges || []} showProgress />
          </div>
        </section>

        {/* Why go social */}
        <section aria-labelledby="why-social" className="grid gap-6 border-t border-line pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-12">
          <div>
            <h2 id="why-social" className="t-h2 text-ink">Why listen with others</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-2">The fastest way to your next book is someone who just finished theirs.</p>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {[
              ['Discover together', 'See what friends listen to and get picks based on how they rate.'],
              ['Join the conversation', 'Clubs with celebrity hosts, live author events and other listeners to talk with.'],
              ['Earn rewards', 'Badges, 2-for-1 credit deals and members-only content.'],
            ].map(([t, d]) => (
              <div key={t} className="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-semibold text-ink">{t}</dt>
                <dd className="text-[0.9375rem] text-ink-2">{d}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
};

export default Social;
