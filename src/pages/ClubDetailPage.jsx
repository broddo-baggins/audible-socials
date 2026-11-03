import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Users } from 'lucide-react';
import clubsData from '../data/clubs.json';
import booksData from '../data/books.json';
import usersData from '../data/users.json';
import { getUserData, joinClub, leaveClub, getJoinedClubs, getFriends, getPrivateClubs } from '../utils/localStorage';
import { getClubFriends } from '../utils/friendManagement';
import { PageHeader, Cover, Waveform, Rating, Avatar, Badge, Button, ErrorState } from '../components/ui';
import EventRSVP from '../components/events/EventRSVP';
import ClubTimeline from '../components/clubs/ClubTimeline';
import MeetingsSummary from '../components/clubs/MeetingsSummary';
import DiscountDisplay from '../components/clubs/DiscountDisplay';
import PrivateClubDiscussions from '../components/clubs/PrivateClubDiscussions';
import PrivateClubMeetups from '../components/clubs/PrivateClubMeetups';
import PrivateClubVoting from '../components/clubs/PrivateClubVoting';

/**
 * ClubDetailPage: one club. The club's mark is its waveform (seeded by its id),
 * drawn as far as the month has gone; its picture is the book it is reading.
 * A bad id gets a quiet not-found state with a way back to all clubs.
 */

const findClub = (id) => {
  const club = clubsData.find((c) => c.id === id);
  if (club) return club;
  if (id && id.startsWith('private-')) return getPrivateClubs().find((c) => c.id === id) || null;
  return null;
};

const hostTypeLabel = { celebrity: 'Celebrity host', author: 'Author host', themed: 'Themed club', user: 'Hosted by a member' };

const tabClass = (selected) =>
  `relative -mb-px inline-flex h-11 shrink-0 items-center text-[0.9375rem] font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`;

export default function ClubDetailPage() {
  const { clubId } = useParams();
  // A new id is a new page: remount so every piece of state starts fresh.
  return <ClubDetail key={clubId} clubId={clubId} />;
}

function ClubDetail({ clubId }) {
  const club = useMemo(() => findClub(clubId), [clubId]);
  const [userData, setUserData] = useState(() => getUserData());
  const [isMember, setIsMember] = useState(() => getJoinedClubs().includes(clubId));
  const [activeTab, setActiveTab] = useState('overview');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [notice, setNotice] = useState(null);

  const currentBook = useMemo(() => (club ? booksData.find((b) => b.id === club.currentBook) : null), [club]);
  const previousBooks = useMemo(
    () => (club?.previousBooks || []).map((id) => booksData.find((b) => b.id === id)).filter(Boolean),
    [club],
  );

  // People you know here: friends in the club, then friends of friends
  const { directFriends, friendsOfFriends } = useMemo(() => {
    if (!club) return { directFriends: [], friendsOfFriends: [] };
    const friendIds = getFriends();
    const inClub = usersData.filter((u) => friendIds.includes(u.id) && u.joinedClubs && u.joinedClubs.includes(clubId));
    const cf = getClubFriends(clubId, usersData);
    const seen = new Set(inClub.map((u) => u.id));
    const direct = [...inClub, ...cf.directFriends.filter((u) => !seen.has(u.id))];
    direct.forEach((u) => seen.add(u.id));
    const fof = (cf.friendsOfFriends || []).filter((u) => u.id !== 'user-me' && !seen.has(u.id));
    return { directFriends: direct, friendsOfFriends: fof };
  }, [club, clubId]);

  if (!club) {
    return (
      <div className="page pb-16">
        <ErrorState
          className="pt-16"
          title="We could not find that club"
          description="It may have closed, or the link is mistyped. Every public club is listed on the clubs page."
          backTo="/clubs"
          backLabel="See all clubs"
        />
      </div>
    );
  }

  const maxClubs = userData?.isPremium ? 3 : 2;
  const joinedCount = (userData?.joinedClubs || []).length;
  const userLibrary = userData?.library || [];
  const ownsCurrentBook = userLibrary.includes(club.currentBook);
  const premiumLocked = club.isPremium && !userData?.isPremium;
  const atLimit = !isMember && joinedCount >= maxClubs;
  const canJoin = !isMember && !premiumLocked && ownsCurrentBook && !atLimit;
  const credits = userData?.credits || 0;

  const handleJoinClub = () => {
    if (!userLibrary.includes(club.currentBook)) {
      setNotice({ tone: 'error', text: `You need ${currentBook?.title ? `"${currentBook.title}"` : "this month's book"} to join this club. Get the book first to take part in discussions.` });
      return;
    }
    const result = joinClub(clubId);
    if (result.success) {
      setIsMember(true);
      setUserData(getUserData());
      setNotice({ tone: 'success', text: `You joined ${club.name}.` });
    } else {
      setNotice({ tone: 'error', text: result.error });
    }
  };

  const handleLeaveClub = () => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      leaveClub(clubId);
      setIsMember(false);
      setUserData(getUserData());
      setNotice({ tone: 'info', text: `You left ${club.name}.` });
    }
  };

  const handlePurchaseBook = () => {
    // Mock purchase: add the book to the library and spend one credit
    const currentUser = getUserData();
    if (!currentUser.library.includes(club.currentBook)) {
      currentUser.library.push(club.currentBook);
      if (currentUser.credits > 0) currentUser.credits -= 1;
      localStorage.setItem('userData', JSON.stringify(currentUser));
      setPurchaseSuccess(true);
      setUserData(currentUser);
      setTimeout(() => {
        setShowPurchaseModal(false);
        setPurchaseSuccess(false);
      }, 2000);
    }
  };

  // How far into this reading period the club is, for the waveform
  const periodDays = club.timeframe === 'weekly' ? 7 : club.timeframe === 'biweekly' ? 14 : 30;
  const daysLeft = Number.isFinite(club.daysRemaining) ? club.daysRemaining : null;
  const periodProgress = daysLeft != null ? Math.max(0, Math.min(1, 1 - daysLeft / periodDays)) : null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline and milestones' },
    ...(club.isPrivate ? [
      { id: 'discussions', label: 'Discussions' },
      { id: 'meetups', label: 'Meetups' },
      { id: 'voting', label: 'Voting' },
    ] : []),
  ];

  const actions = (
    <>
      {isMember ? (
        <>
          {currentBook && (
            <Link to={`/book/${currentBook.id}`} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">
              Go to the book
            </Link>
          )}
          <Button variant="outline" onClick={handleLeaveClub} leftIcon={<X className="h-4 w-4" strokeWidth={1.75} />}>Leave club</Button>
        </>
      ) : (
        <>
          {premiumLocked && (
            <Link to="/profile" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">
              Upgrade to Premium
            </Link>
          )}
          {!ownsCurrentBook && currentBook && (
            <Button variant="highlight" onClick={() => setShowPurchaseModal(true)}>Get book and join</Button>
          )}
          {canJoin && <Button variant="highlight" onClick={handleJoinClub}>Join club</Button>}
          {currentBook && !ownsCurrentBook && (
            <Link to={`/book/${currentBook.id}`} className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">
              Book details
            </Link>
          )}
        </>
      )}
    </>
  );

  const stats = [
    { label: club.memberCount === 1 ? 'member' : 'members', value: (club.memberCount || 0).toLocaleString() },
    daysLeft != null && { label: daysLeft === 1 ? 'day left on this book' : 'days left on this book', value: daysLeft },
    { label: 'meetings a month', value: club.meetingsPerMonth ?? 0 },
    { label: 'books read together', value: previousBooks.length + (currentBook ? 1 : 0) },
  ].filter(Boolean);

  return (
    <div className="page pb-20">
      <nav aria-label="Breadcrumb" className="pt-4 md:pt-6">
        <Link to="/clubs" className="-ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-sm font-medium text-ink-2 hover:text-ink">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Book clubs
        </Link>
      </nav>

      <PageHeader
        className="!pt-2 md:!pt-4"
        kicker={club.isPrivate ? 'Private club' : club.isPremium ? 'Premium club' : hostTypeLabel[club.hostType] || null}
        title={club.name}
        description={
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Hosted by {club.host === userData?.id ? 'you' : usersData.find((u) => u.id === club.host || `user-${u.id}` === club.host)?.name || club.host}</span>
            {isMember && <Badge variant="success" icon={<Check className="h-3 w-3" strokeWidth={2} />}>Member</Badge>}
          </span>
        }
        actions={actions}
      >
        <Waveform
          seed={`club-${club.id}`}
          bars={160}
          height={40}
          progress={periodProgress}
          className="h-9 w-full text-ink md:h-10"
          playedClassName="text-ink"
          label={periodProgress != null ? `${Math.round(periodProgress * 100)}% of the way through this month's book` : `${club.name} waveform`}
        />
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-[0.8125rem] text-ink-3">{s.label}</dt>
              <dd className="t-h1 tabular text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
        {!isMember && (premiumLocked || atLimit) && (
          <p className="mt-6 max-w-[62ch] text-[0.9375rem] text-ink-2">
            {premiumLocked
              ? 'This club is for Premium members. Upgrade for its events and members-only content.'
              : `You are in ${maxClubs} clubs, the most your plan allows. Leave one to join this club.`}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className={`mt-6 inline-flex max-w-full items-start gap-2 rounded-lg border px-4 py-3 text-[0.9375rem] ${
              notice.tone === 'error' ? 'border-danger/30 bg-danger-wash text-danger' : notice.tone === 'success' ? 'border-success/30 bg-success-wash text-success' : 'border-line bg-surface text-ink-2'
            }`}
          >
            <span className="min-w-0">{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} className="-my-1 -mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5" aria-label="Dismiss message">
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </p>
        )}
      </PageHeader>

      <div role="tablist" aria-label="Club sections" className="flex gap-6 overflow-x-auto border-b border-line scrollbar-hide md:gap-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`club-tab-${t.id}`}
            aria-selected={activeTab === t.id}
            aria-controls={`club-panel-${t.id}`}
            onClick={() => setActiveTab(t.id)}
            className={tabClass(activeTab === t.id)}
          >
            {t.label}
            {activeTab === t.id && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`club-panel-${activeTab}`} aria-labelledby={`club-tab-${activeTab}`} className="pt-10 md:pt-12">
        {activeTab === 'overview' && (
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
            <div className="min-w-0 space-y-16">
              {currentBook && (
                <section aria-labelledby="now-reading">
                  <h2 id="now-reading" className="t-h2 text-ink">This month&rsquo;s book</h2>
                  <div className="mt-5 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-7">
                    <Link to={`/book/${currentBook.id}`} className="rounded-sm" aria-label={`${currentBook.title} details`}>
                      <Cover src={currentBook.cover} title={currentBook.title} author={currentBook.author} loading="eager" />
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/book/${currentBook.id}`} className="t-title-book text-xl text-ink hover:underline underline-offset-4 decoration-1 md:text-2xl">
                        {currentBook.title}
                      </Link>
                      <p className="mt-1 text-[0.9375rem] text-ink-2">
                        {currentBook.author}{currentBook.narrator ? <>, read by {currentBook.narrator}</> : null}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <Rating value={currentBook.rating} size="sm" showCount count={currentBook.ratingsCount} />
                        <span className="text-[0.8125rem] text-ink-3 tabular">{currentBook.duration}</span>
                      </div>
                      {currentBook.description && <p className="mt-4 hidden max-w-[60ch] text-[0.9375rem] text-ink-2 sm:block">{currentBook.description}</p>}
                    </div>
                  </div>
                  {currentBook.description && <p className="mt-4 text-[0.9375rem] text-ink-2 sm:hidden">{currentBook.description}</p>}

                  {!isMember && !ownsCurrentBook && (
                    <div className="mt-6 rounded-lg border border-line bg-surface-sunk p-5">
                      <h3 className="font-semibold text-ink">You need this book to join</h3>
                      <p className="mt-1 max-w-[62ch] text-[0.9375rem] text-ink-2">
                        Each month has a different book. Own this month&rsquo;s pick to join the club, come to the live Q&amp;A sessions and take part in the discussions.
                        {club.discounts?.monthlyBook?.maxSavings ? ` Members save up to $${club.discounts.monthlyBook.maxSavings} on it.` : ''}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPurchaseModal(true)}
                        className="mt-3 inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2"
                      >
                        Get the book with 1 credit
                      </button>
                    </div>
                  )}
                </section>
              )}

              {club.description && (
                <section aria-labelledby="about-club">
                  <h2 id="about-club" className="t-h2 text-ink">About the club</h2>
                  <p className="mt-4 max-w-[65ch] text-base text-ink-2">{club.description}</p>
                </section>
              )}

              <section aria-labelledby="meetings-title">
                <MeetingsSummary club={club} showDetailed showNext={false} showList={false} headingId="meetings-title" />
                {club.events && club.events.length > 0 && (
                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {club.events.map((event, i) => (
                      <li key={event.id}>
                        <EventRSVP event={event} clubId={clubId} isNext={i === 0} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {club.discounts && (
                <section aria-label="Member savings">
                  <DiscountDisplay club={club} ownsBook={ownsCurrentBook} showOwnership={ownsCurrentBook} />
                </section>
              )}

              {club.perks && club.perks.length > 0 && (
                <section aria-labelledby="perks-title">
                  <h2 id="perks-title" className="t-h2 text-ink">What members get</h2>
                  <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                    {club.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" strokeWidth={2} aria-hidden="true" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {previousBooks.length > 0 && (
                <section aria-labelledby="previous-title">
                  <h2 id="previous-title" className="t-h2 text-ink">Read before</h2>
                  <ul className="mt-5 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                    {previousBooks.map((book) => (
                      <li key={book.id}>
                        <Link to={`/book/${book.id}`} className="group block rounded-sm">
                          <Cover src={book.cover} title={book.title} author={book.author} className="transition-transform duration-200 group-hover:-translate-y-1" />
                          <p className="mt-2 t-title-book text-sm text-ink line-clamp-2 group-hover:underline underline-offset-4">{book.title}</p>
                          <p className="text-[0.8125rem] text-ink-3 line-clamp-1">{book.author}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="min-w-0 space-y-12">
              <section aria-labelledby="details-title">
                <h2 id="details-title" className="t-h3 text-ink">Club details</h2>
                <dl className="mt-3 divide-y divide-line border-y border-line text-[0.9375rem]">
                  {[
                    ['Host', hostTypeLabel[club.hostType] || club.hostType],
                    ['Reading pace', club.timeframe ? club.timeframe.charAt(0).toUpperCase() + club.timeframe.slice(1) : null],
                    ['Each book runs', club.duration],
                    ['Books read', previousBooks.length + (currentBook ? 1 : 0)],
                  ].filter(([, v]) => v != null && v !== '').map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-ink-2">{k}</dt>
                      <dd className="font-medium text-ink tabular">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="people-title">
                <h2 id="people-title" className="t-h3 text-ink">People you know here</h2>
                {directFriends.length === 0 && friendsOfFriends.length === 0 ? (
                  <div className="mt-3 rounded-lg border border-dashed border-line-strong p-5">
                    <p className="text-[0.9375rem] text-ink-2">None of your friends are in this club yet.</p>
                    <Link to="/clubs/friends" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
                      <Users className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Find friends
                    </Link>
                  </div>
                ) : (
                  <>
                    {directFriends.length > 0 && (
                      <>
                        <p className="mt-3 text-[0.8125rem] text-ink-3 tabular">Your friends ({directFriends.length})</p>
                        <ul className="mt-1 divide-y divide-line">
                          {directFriends.map((friend) => (
                            <li key={friend.id} className="flex items-center gap-3 py-2.5">
                              <Avatar src={friend.avatar} name={friend.name} size="sm" />
                              <Link to={`/friend/${friend.id}/library`} className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-ink hover:underline underline-offset-4">{friend.name}</Link>
                              {friend.isPremium && <Badge size="sm" variant="outline">Premium</Badge>}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {friendsOfFriends.length > 0 && (
                      <>
                        <p className="mt-5 text-[0.8125rem] text-ink-3 tabular">Friends of friends ({friendsOfFriends.length})</p>
                        <ul className="mt-1 divide-y divide-line">
                          {friendsOfFriends.slice(0, 5).map((user) => (
                            <li key={user.id} className="flex items-center gap-3 py-2.5">
                              <Avatar src={user.avatar} name={user.name} size="sm" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[0.9375rem] font-medium text-ink">{user.name}</p>
                                <p className="truncate text-[0.8125rem] text-ink-3">Friend of {user.mutualFriendList?.[0] || 'a friend'}</p>
                              </div>
                              {user.isPremium && <Badge size="sm" variant="outline">Premium</Badge>}
                            </li>
                          ))}
                        </ul>
                        {friendsOfFriends.length > 5 && (
                          <p className="mt-2 text-[0.8125rem] text-ink-3 tabular">And {friendsOfFriends.length - 5} more friends of friends</p>
                        )}
                      </>
                    )}
                  </>
                )}
              </section>

              {isMember && (
                <section aria-labelledby="progress-title">
                  <h2 id="progress-title" className="t-h3 text-ink">Your progress</h2>
                  <p className="mt-1 text-sm text-ink-2">Finish books and come to events to earn badges and rewards.</p>
                  <dl className="mt-4 grid grid-cols-2 gap-6">
                    <div className="flex flex-col-reverse">
                      <dt className="mt-1 text-[0.8125rem] text-ink-3">books finished</dt>
                      <dd className="font-serif text-3xl font-medium text-ink tabular">0 / 1</dd>
                    </div>
                    <div className="flex flex-col-reverse">
                      <dt className="mt-1 text-[0.8125rem] text-ink-3">events attended</dt>
                      <dd className="font-serif text-3xl font-medium text-ink tabular">0 / {club.events?.length || 0}</dd>
                    </div>
                  </dl>
                </section>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'timeline' && <ClubTimeline clubId={clubId} />}
        {activeTab === 'discussions' && club.isPrivate && <PrivateClubDiscussions club={club} currentUser={userData} />}
        {activeTab === 'meetups' && club.isPrivate && <PrivateClubMeetups club={club} currentUser={userData} />}
        {activeTab === 'voting' && club.isPrivate && <PrivateClubVoting club={club} currentUser={userData} />}
      </div>

      {showPurchaseModal && currentBook && (
        <PurchaseDialog
          club={club}
          book={currentBook}
          credits={credits}
          success={purchaseSuccess}
          onClose={() => !purchaseSuccess && setShowPurchaseModal(false)}
          onConfirm={handlePurchaseBook}
        />
      )}
    </div>
  );
}

function PurchaseDialog({ club, book, credits, success, onClose, onConfirm }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, []);

  const enough = credits >= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="purchase-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-surface shadow-lg sm:rounded-2xl">
        {!success ? (
          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="purchase-title" className="t-h2 text-ink">Get the book and join</h2>
                <p className="mt-1 text-[0.9375rem] text-ink-2">Owning this month&rsquo;s book lets you join {club.name}.</p>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink" aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-5">
              <Cover src={book.cover} title={book.title} author={book.author} />
              <div className="min-w-0">
                <p className="t-title-book text-xl text-ink">{book.title}</p>
                <p className="mt-1 text-[0.9375rem] text-ink-2">{book.author}</p>
                <Rating value={book.rating} size="sm" showCount count={book.ratingsCount} className="mt-2" />
                <p className="mt-1 text-[0.8125rem] text-ink-3 tabular">{book.duration}</p>
              </div>
            </div>

            {club.perks && club.perks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-ink">Comes with the club</h3>
                <ul className="mt-2 space-y-1.5">
                  {club.perks.slice(0, 3).map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-ink-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={2} aria-hidden="true" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-6 divide-y divide-line border-y border-line text-[0.9375rem]">
              <div className="flex justify-between py-3"><dt className="text-ink-2">Book</dt><dd className="text-ink tabular">1 credit</dd></div>
              <div className="flex justify-between py-3"><dt className="text-ink-2">Club membership</dt><dd className="font-medium text-success">Free</dd></div>
              <div className="flex items-baseline justify-between py-3"><dt className="font-semibold text-ink">Total</dt><dd className="font-serif text-2xl font-medium text-ink tabular">1 credit</dd></div>
            </dl>
            <p className="mt-2 text-[0.8125rem] text-ink-3 tabular">You have {credits} credit{credits !== 1 ? 's' : ''}.</p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onConfirm} disabled={!enough}>{enough ? 'Get book and join' : 'Not enough credits'}</Button>
            </div>
            {!enough && (
              <p className="mt-3 text-sm text-danger">
                You need at least 1 credit for this book. <Link to="/account" className="underline underline-offset-2">Get more credits</Link>
              </p>
            )}
          </div>
        ) : (
          <div className="p-7 sm:p-10" role="status">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success-wash text-success">
              <Check className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </span>
            <h2 id="purchase-title" className="mt-5 t-h2 text-ink">Added to your library</h2>
            <p className="mt-2 text-base text-ink-2"><span className="t-title-book text-ink">{book.title}</span> is yours. You can now join {club.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
