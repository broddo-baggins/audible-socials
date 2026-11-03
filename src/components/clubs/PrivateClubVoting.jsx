import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import booksData from '../../data/books.json';
import { getClubVotes, castClubVote, getUserData } from '../../utils/localStorage';
import { Cover, EmptyState } from '../ui';

/**
 * PrivateClubVoting: members vote on the next book. Each candidate is a row
 * with its vote count drawn as an ink bar; your own vote is the filled button.
 */

const loadVotes = (club) => {
  const stored = getClubVotes(club.id);
  return Object.keys(stored).length > 0 ? stored : club.bookVotes || {};
};

export default function PrivateClubVoting({ club, currentUser, onVoteCast }) {
  const [bookVotes, setBookVotes] = useState(() => loadVotes(club));
  const [loading, setLoading] = useState(false);
  const members = club.members || [];
  const meId = currentUser?.id;

  const votingBooks = useMemo(() => Object.keys(bookVotes).map((bookId) => {
    const book = booksData.find((b) => b.id === bookId);
    return book ? { ...book, votes: bookVotes[bookId].length, hasMyVote: bookVotes[bookId].includes(meId) } : null;
  }).filter(Boolean), [bookVotes, meId]);

  const handleVote = async (bookId) => {
    setLoading(true);
    const userData = getUserData();
    const result = castClubVote(club.id, bookId, userData.id);
    if (result.success) {
      setBookVotes(result.votes);
      onVoteCast?.(result.votes);
    }
    setLoading(false);
  };

  const winner = (() => {
    if (votingBooks.length === 0) return null;
    const top = votingBooks.reduce((p, c) => (p.votes > c.votes ? p : c));
    return top.votes >= Math.ceil(members.length / 2) ? top : null;
  })();

  const current = club.currentBook ? booksData.find((b) => b.id === club.currentBook) : null;
  const maxVotes = Math.max(1, members.length);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <section aria-labelledby="vote-title" className="min-w-0">
        <h2 id="vote-title" className="t-h2 text-ink">Vote on the next book</h2>
        <p className="mt-1 text-[0.9375rem] text-ink-2">Pick what your club reads after this one.</p>

        {winner && (
          <div className="mt-5 rounded-lg border border-success/30 bg-success-wash p-5" role="status">
            <p className="font-semibold text-success">A book has won</p>
            <p className="mt-1 text-[0.9375rem] text-ink">
              Your club reads <span className="t-title-book">{winner.title}</span> by {winner.author} next, with {winner.votes} of {members.length} votes.
            </p>
          </div>
        )}

        {votingBooks.length > 0 ? (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {votingBooks.map((book) => (
              <li key={book.id} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 py-4">
                <Cover src={book.cover} title={book.title} shadow={false} />
                <div className="min-w-0">
                  <p className="t-title-book text-ink line-clamp-1">{book.title}</p>
                  <p className="text-[0.8125rem] text-ink-3">by {book.author}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-line" aria-hidden="true">
                      <div className={`h-full rounded-full ${winner?.id === book.id ? 'bg-hl' : 'bg-ink'}`} style={{ width: `${(book.votes / maxVotes) * 100}%` }} />
                    </div>
                    <span className="text-[0.8125rem] text-ink-2 tabular">{book.votes} of {members.length} votes</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleVote(book.id)}
                  disabled={loading}
                  aria-pressed={book.hasMyVote}
                  className={`inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[0.9375rem] font-medium transition-colors disabled:opacity-60 ${
                    book.hasMyVote ? 'bg-ink text-paper hover:bg-gray-800' : 'border border-line-strong text-ink hover:bg-surface'
                  }`}
                >
                  {book.hasMyVote && <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
                  {book.hasMyVote ? 'Voted' : 'Vote'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState className="mt-6" title="No books up for a vote" description="Start a discussion to suggest books for the club to vote on." />
        )}
      </section>

      <aside className="space-y-10">
        {current && (
          <section aria-labelledby="vote-current">
            <h3 id="vote-current" className="text-sm font-semibold text-ink-2">Reading now</h3>
            <div className="mt-2 flex items-center gap-3">
              <span className="w-10 shrink-0"><Cover src={current.cover} title={current.title} shadow={false} /></span>
              <p className="t-title-book text-ink">{current.title}</p>
            </div>
          </section>
        )}
        <section aria-labelledby="vote-rules">
          <h3 id="vote-rules" className="t-h3 text-ink">How voting works</h3>
          <ul className="mt-3 space-y-2 text-[0.9375rem] text-ink-2">
            <li>You can vote for more than one book.</li>
            <li>Change your vote any time before the deadline.</li>
            <li>A book wins with a majority, half the members plus one.</li>
            <li>The host can open a vote at any time.</li>
            <li>Voting runs until a book wins or the deadline passes.</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}

PrivateClubVoting.propTypes = {
  club: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  onVoteCast: PropTypes.func,
};
