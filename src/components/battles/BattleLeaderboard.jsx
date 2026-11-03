import { useState } from 'react';
import { BookOpen, Flame, Clock } from 'lucide-react';
import { Avatar } from '../ui';

/**
 * BattleLeaderboard: a ranked divide-y list. Rank 1 sits on the highlighter;
 * the score for the battle type is the big number, points under it.
 */
export default function BattleLeaderboard({ leaderboard, battleType, showFull: showFullInitially = false }) {
  const [showFull, setShowFull] = useState(showFullInitially);
  const formatScore = (participant, battleType) => {
    switch (battleType) {
      case 'speed_reading':
        return `${participant.completionTime || 'In progress'}`;
      case 'streak_challenge':
        return `${participant.currentStreak || 0} day streak`;
      case 'book_voting':
        return `${participant.votes || 0} votes`;
      default:
        return participant.score || 0;
    }
  };

  const displayParticipants = showFull ? leaderboard : leaderboard?.slice(0, 10) || [];

  return (
    <div>
      <p className="text-[0.8125rem] text-ink-3">Rankings update every 5 minutes.</p>

      {displayParticipants.length > 0 && (
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {displayParticipants.map((participant, index) => {
            const rank = index + 1;

            return (
              <li key={participant.userId} className="py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular ${
                      rank === 1 ? 'bg-hl text-ink' : rank <= 3 ? 'border border-line-strong text-ink' : 'text-ink-3'
                    }`}
                    aria-label={`Rank ${rank}`}
                  >
                    {rank}
                  </span>

                  <Avatar name={participant.username} size="md" />

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-semibold text-ink">{participant.username}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 text-[0.8125rem] text-ink-3 tabular">
                      {participant.progress && (
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                          {participant.progress}% complete
                        </span>
                      )}
                      {participant.currentStreak && (
                        <span className="inline-flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                          {participant.currentStreak} day streak
                        </span>
                      )}
                      {participant.totalMinutes && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                          {participant.totalMinutes} min total
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-serif text-xl font-medium text-ink tabular">
                      {formatScore(participant, battleType)}
                    </div>
                    {participant.score && (
                      <div className="text-[0.8125rem] text-ink-3">{participant.score.toLocaleString()} points</div>
                    )}
                  </div>
                </div>

                {participant.progress !== undefined && (
                  <div className="mt-3 pl-11">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={participant.progress} aria-label={`${participant.username} progress`}>
                      <div className="h-full rounded-full bg-ink" style={{ width: `${participant.progress}%` }} />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {!showFull && leaderboard && leaderboard.length > 10 && (
        <button type="button" onClick={() => setShowFull(true)} className="mt-3 inline-flex h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
          See the full leaderboard ({leaderboard.length - 10} more)
        </button>
      )}

      {(!leaderboard || leaderboard.length === 0) && (
        <div className="mt-3 rounded-lg border border-dashed border-line-strong px-5 py-6">
          <h4 className="font-semibold text-ink">No participants yet</h4>
          <p className="mt-1 text-sm text-ink-2">Be the first to join this battle.</p>
        </div>
      )}
    </div>
  );
}
