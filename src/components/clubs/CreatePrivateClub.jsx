import { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import { X, Check, Search } from 'lucide-react';
import { getFriends, getUserData, createPrivateClub } from '../../utils/localStorage';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import { Avatar, Button, Cover, Input } from '../ui';

/**
 * CreatePrivateClub: a three-step sheet (about the club, who to invite, the
 * first book). Every choice is a real button; the step you are on is in ink.
 */

const STEPS = ['About the club', 'Invite friends', 'First book'];

const fieldClass = 'w-full rounded-lg border border-line-strong bg-surface px-3.5 text-base text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none';

export default function CreatePrivateClub({ onClubCreated, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    invitedFriends: [],
    currentBook: null,
    meetingFrequency: 'monthly',
    nextMeeting: null,
  });
  const [friends] = useState(() => {
    const friendIds = getFriends();
    return usersData.filter((u) => friendIds.includes(u.id));
  });
  const [books] = useState(() => booksData.filter((b) => b.contentType === 'audiobook').slice(0, 9));
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ids = { title: useId(), desc: useId(), freq: useId(), next: useId() };
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleFriend = (friendId) => {
    setFormData((prev) => ({
      ...prev,
      invitedFriends: prev.invitedFriends.includes(friendId)
        ? prev.invitedFriends.filter((id) => id !== friendId)
        : [...prev.invitedFriends, friendId],
    }));
  };

  const selectBook = (bookId) => setFormData((prev) => ({ ...prev, currentBook: bookId }));

  const createClub = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = getUserData();
      const clubData = {
        name: formData.name,
        host: userData.id,
        hostType: 'user',
        description: formData.description,
        coverQuery: formData.name,
        currentBook: formData.currentBook,
        previousBooks: [],
        memberCount: formData.invitedFriends.length + 1,
        isPremium: false,
        timeframe: formData.meetingFrequency,
        duration: '1 month',
        daysRemaining: 30,
        meetingsPerMonth: 1,
        nextMeeting: formData.nextMeeting,
        isPrivate: true,
        members: [userData.id, ...formData.invitedFriends],
        invitedMembers: [],
        bookVotes: {},
        selectedBook: formData.currentBook,
        discussions: [],
        events: formData.nextMeeting ? [{
          id: `priv-${Date.now()}`,
          title: `First meetup: ${formData.name}`,
          date: formData.nextMeeting,
          type: 'discussion',
          description: 'Welcome to our new private book club. We will talk about our first book and plan the next ones.',
          rsvpCount: formData.invitedFriends.length + 1,
          maxCapacity: formData.invitedFriends.length + 1,
          isExclusive: true,
          attendees: [userData.id, ...formData.invitedFriends],
        }] : [],
      };

      const result = createPrivateClub(clubData);
      if (result.success) {
        onClubCreated(result.club);
        onClose();
      } else {
        setError(result.error || 'The club could not be created.');
      }
    } catch (err) {
      setError('Something went wrong while creating the club. Please try again.');
      console.error('Club creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return Boolean(formData.name.trim() && formData.description.trim());
      case 2: return formData.invitedFriends.length > 0;
      case 3: return formData.currentBook !== null;
      default: return false;
    }
  };

  const filteredFriends = friends.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="create-club-title" className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-surface shadow-lg sm:max-h-[90vh] sm:rounded-2xl">
        <div className="border-b border-line p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="create-club-title" className="t-h2 text-ink">Start a private club</h2>
              <p className="mt-1 text-[0.9375rem] text-ink-2">A club for you and the friends you invite.</p>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink" aria-label="Close">
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <ol className="mt-5 flex flex-wrap gap-x-6 gap-y-2" aria-label="Steps">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const state = n < step ? 'done' : n === step ? 'current' : 'todo';
              return (
                <li key={label} className="flex items-center gap-2 text-sm" aria-current={state === 'current' ? 'step' : undefined}>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold tabular ${state === 'todo' ? 'border border-line-strong text-ink-3' : 'bg-ink text-paper'}`}>
                    {state === 'done' ? <Check className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" /> : n}
                  </span>
                  <span className={state === 'todo' ? 'text-ink-3' : 'font-medium text-ink'}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {error && (
          <p role="alert" className="mx-5 mt-4 rounded-lg border border-danger/30 bg-danger-wash px-4 py-3 text-sm text-danger sm:mx-7">{error}</p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {step === 1 && (
            <div className="space-y-5">
              <Input label="Club name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="For example, Sci-fi book lovers" fullWidth required />
              <div>
                <label htmlFor={ids.desc} className="mb-1.5 block text-sm font-medium text-ink">What the club is about</label>
                <textarea
                  id={ids.desc}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell your friends what you will read and why"
                  rows={4}
                  required
                  className={`${fieldClass} resize-none py-3`}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={ids.freq} className="mb-1.5 block text-sm font-medium text-ink">How often you meet</label>
                  <select id={ids.freq} value={formData.meetingFrequency} onChange={(e) => handleInputChange('meetingFrequency', e.target.value)} className={`${fieldClass} h-11`}>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every two weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={ids.next} className="mb-1.5 block text-sm font-medium text-ink">First meeting <span className="font-normal text-ink-3">(optional)</span></label>
                  <input id={ids.next} type="datetime-local" value={formData.nextMeeting || ''} onChange={(e) => handleInputChange('nextMeeting', e.target.value)} className={`${fieldClass} h-11`} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[0.9375rem] text-ink-2">Choose the friends to invite. You can invite more later.</p>
              <Input
                containerClassName="mt-4"
                label="Search friends"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name"
                leftIcon={<Search className="h-4 w-4" strokeWidth={1.75} />}
                fullWidth
              />
              {filteredFriends.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-line-strong p-5 text-[0.9375rem] text-ink-2">
                  {friends.length === 0 ? 'Add friends first, then invite them here.' : 'No friend matches that name.'}
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {filteredFriends.map((friend) => {
                    const on = formData.invitedFriends.includes(friend.id);
                    return (
                      <li key={friend.id}>
                        <button
                          type="button"
                          onClick={() => toggleFriend(friend.id)}
                          aria-pressed={on}
                          className={`flex w-full items-center gap-3 px-2 py-3 text-left transition-colors ${on ? 'bg-hl-wash' : 'hover:bg-paper'}`}
                        >
                          <Avatar src={friend.avatar} name={friend.name} size="md" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium text-ink">{friend.name}</span>
                            <span className="block text-[0.8125rem] text-ink-3">{friend.currentlyReading ? 'Listening to something now' : 'Free to start a book'}</span>
                          </span>
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${on ? 'bg-ink text-paper' : 'border border-line-strong'}`} aria-hidden="true">
                            {on && <Check className="h-3.5 w-3.5" strokeWidth={2.25} />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="mt-3 text-sm text-ink-2 tabular" aria-live="polite">
                {formData.invitedFriends.length} friend{formData.invitedFriends.length === 1 ? '' : 's'} invited
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-[0.9375rem] text-ink-2">Pick the book your club starts with.</p>
              <ul className="mt-4 grid grid-cols-3 gap-x-4 gap-y-5">
                {books.map((book) => {
                  const on = formData.currentBook === book.id;
                  return (
                    <li key={book.id}>
                      <button type="button" onClick={() => selectBook(book.id)} aria-pressed={on} className="group block w-full rounded-sm text-left">
                        <span className={`relative block rounded-sm ${on ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : ''}`}>
                          <Cover src={book.cover} title={book.title} author={book.author} />
                          {on && (
                            <span className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-hl text-ink" aria-hidden="true">
                              <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block t-title-book text-sm text-ink line-clamp-2">{book.title}</span>
                        <span className="block text-[0.8125rem] text-ink-3 line-clamp-1">{book.author}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line p-4 sm:px-7">
          <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</Button>
          <div className="flex items-center gap-2">
            {step === 3 && <Button variant="ghost" onClick={onClose}>Cancel</Button>}
            <Button variant="primary" onClick={step === 3 ? createClub : () => setStep(step + 1)} disabled={!canProceed()} loading={loading}>
              {step === 3 ? 'Create club' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

CreatePrivateClub.propTypes = {
  onClubCreated: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
