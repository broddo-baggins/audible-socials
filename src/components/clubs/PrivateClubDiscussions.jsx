import { useState, useId } from 'react';
import PropTypes from 'prop-types';
import { MessageCircle, EyeOff } from 'lucide-react';
import { addClubDiscussion, addDiscussionReply, getClubDiscussions, getUserData } from '../../utils/localStorage';
import { Avatar, Button, Input, EmptyState } from '../ui';

/**
 * PrivateClubDiscussions: threads about the book. A thread is a ruled block
 * (title, where in the book, the post, replies indented on a hairline).
 * Spoilers are flagged in words, not colour.
 */

const fieldClass = 'w-full rounded-lg border border-line-strong bg-surface px-3.5 py-3 text-base text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none resize-none';

const formatDate = (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const loadDiscussions = (club) => {
  const stored = getClubDiscussions(club.id);
  return stored.length > 0 ? stored : club.discussions || [];
};

function SpoilerFlag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-surface-sunk px-1.5 py-0.5 text-xs font-medium text-ink-2">
      <EyeOff className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" /> Spoilers
    </span>
  );
}

export default function PrivateClubDiscussions({ club }) {
  const [discussions, setDiscussions] = useState(() => loadDiscussions(club));
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', bookSection: '', hasSpoilers: false });
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySpoilers, setReplySpoilers] = useState(false);
  const [loading, setLoading] = useState(false);
  const thoughtsId = useId();
  const replyId = useId();

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;
    setLoading(true);
    const userData = getUserData();
    const result = addClubDiscussion(club.id, {
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: userData.id,
      bookSection: newDiscussion.bookSection || null,
      hasSpoilers: newDiscussion.hasSpoilers,
    });
    if (result.success) {
      setDiscussions((prev) => [result.discussion, ...prev]);
      setNewDiscussion({ title: '', content: '', bookSection: '', hasSpoilers: false });
      setShowNewDiscussion(false);
    }
    setLoading(false);
  };

  const handleReply = async (discussionId) => {
    if (!replyText.trim()) return;
    setLoading(true);
    const userData = getUserData();
    const result = addDiscussionReply(club.id, discussionId, { content: replyText, author: userData.id, hasSpoilers: replySpoilers });
    if (result.success) {
      setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, replies: [...(d.replies || []), result.reply] } : d)));
      setReplyText('');
      setReplySpoilers(false);
      setExpandedDiscussion(null);
    }
    setLoading(false);
  };

  return (
    <section aria-labelledby="disc-title" className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="disc-title" className="t-h2 text-ink">Discussions</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">Talk about the book, share thoughts and plan meetups.</p>
        </div>
        {!showNewDiscussion && (
          <Button onClick={() => setShowNewDiscussion(true)} leftIcon={<MessageCircle className="h-4 w-4" strokeWidth={1.75} />}>Start a discussion</Button>
        )}
      </div>

      {showNewDiscussion && (
        <form
          className="mt-6 space-y-4 rounded-lg border border-line bg-surface p-5"
          onSubmit={(e) => { e.preventDefault(); handleCreateDiscussion(); }}
          aria-label="New discussion"
        >
          <Input label="Title" value={newDiscussion.title} onChange={(e) => setNewDiscussion((p) => ({ ...p, title: e.target.value }))} placeholder="For example, thoughts on chapter 5" fullWidth />
          <Input label="Part of the book (optional)" value={newDiscussion.bookSection} onChange={(e) => setNewDiscussion((p) => ({ ...p, bookSection: e.target.value }))} placeholder="For example, chapter 3, pages 45 to 67" fullWidth />
          <div>
            <label htmlFor={thoughtsId} className="mb-1.5 block text-sm font-medium text-ink">Your thoughts</label>
            <textarea id={thoughtsId} value={newDiscussion.content} onChange={(e) => setNewDiscussion((p) => ({ ...p, content: e.target.value }))} placeholder="What did you make of it?" rows={4} className={fieldClass} />
          </div>
          <label className="flex min-h-11 items-center gap-3 text-[0.9375rem] text-ink">
            <input type="checkbox" checked={newDiscussion.hasSpoilers} onChange={(e) => setNewDiscussion((p) => ({ ...p, hasSpoilers: e.target.checked }))} className="h-4 w-4 accent-[var(--ink)]" />
            Contains spoilers
          </label>
          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <Button variant="ghost" onClick={() => setShowNewDiscussion(false)}>Cancel</Button>
            <Button type="submit" disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim()} loading={loading}>Post</Button>
          </div>
        </form>
      )}

      {discussions.length === 0 ? (
        !showNewDiscussion && (
          <EmptyState className="mt-6" title="No discussions yet" description="Start the conversation with your thoughts on the book." action="Start the first discussion" onAction={() => setShowNewDiscussion(true)} />
        )
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {discussions.map((d) => (
            <li key={d.id} className="py-6">
              <article aria-labelledby={`d-${d.id}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 id={`d-${d.id}`} className="t-h3 text-ink">{d.title}</h3>
                  {d.hasSpoilers && <SpoilerFlag />}
                </div>
                {d.bookSection && <p className="mt-0.5 text-[0.8125rem] font-medium text-ink-2">{d.bookSection}</p>}
                <p className="mt-2 max-w-[65ch] text-[0.9375rem] text-ink">{d.content}</p>
                <p className="mt-2 text-[0.8125rem] text-ink-3 tabular">
                  Club member · {formatDate(d.timestamp)} · {d.replies?.length || 0} {d.replies?.length === 1 ? 'reply' : 'replies'}
                </p>

                {d.replies && d.replies.length > 0 && (
                  <ul className="mt-4 space-y-4 border-l border-line pl-4 sm:pl-6">
                    {d.replies.map((r) => (
                      <li key={r.id} className="flex gap-3">
                        <Avatar name="Club member" size="sm" />
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
                            <span className="font-medium text-ink">Club member</span>
                            <span className="tabular">{formatDate(r.timestamp)}</span>
                            {r.hasSpoilers && <SpoilerFlag />}
                          </p>
                          <p className="mt-0.5 text-[0.9375rem] text-ink-2">{r.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {expandedDiscussion === d.id ? (
                  <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); handleReply(d.id); }} aria-label={`Reply to ${d.title}`}>
                    <label htmlFor={`${replyId}-${d.id}`} className="sr-only">Your reply</label>
                    <textarea id={`${replyId}-${d.id}`} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Share your thoughts" rows={3} className={`${fieldClass} text-[0.9375rem]`} />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="flex min-h-11 items-center gap-3 text-sm text-ink">
                        <input type="checkbox" checked={replySpoilers} onChange={(e) => setReplySpoilers(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
                        Contains spoilers
                      </label>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { setExpandedDiscussion(null); setReplyText(''); setReplySpoilers(false); }}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={!replyText.trim()} loading={loading}>Reply</Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => setExpandedDiscussion(d.id)} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Reply
                  </button>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

PrivateClubDiscussions.propTypes = {
  club: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};
