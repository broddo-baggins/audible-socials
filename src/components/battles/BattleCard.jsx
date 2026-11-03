import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Clock, Target, Zap, Swords, BookOpen, Check } from 'lucide-react';
import { joinBattle, getUserData } from '../../utils/localStorage';
import { Badge } from '../ui';

const TYPE_META = {
  speed_reading: { label: 'Speed reading', icon: Zap },
  book_voting: { label: 'Book voting', icon: Swords },
  streak_challenge: { label: 'Streak challenge', icon: Target },
  review_battle: { label: 'Review battle', icon: Trophy },
  recommendation_duel: { label: 'Recommendation duel', icon: BookOpen },
};

const STATUS_VARIANT = { active: 'success', upcoming: 'highlight', completed: 'outline' };

/**
 * BattleCard: one battle. The full version is a wide row (what it is and
 * its rules on the left, who leads and what to do on the right) meant to
 * sit in a divide-y list; `compact` is a small bordered card.
 */
export default function BattleCard({ battle, compact = false }) {
  const [isJoining, setIsJoining] = useState(false);
  const userData = getUserData();
  const isParticipant = battle.participants?.includes(userData?.id);
  const isActive = battle.status === 'active';
  const isUpcoming = battle.status === 'upcoming';

  const type = TYPE_META[battle.type] || { label: 'Battle', icon: Swords };
  const TypeIcon = type.icon;
  const statusLabel = battle.status.charAt(0).toUpperCase() + battle.status.slice(1);

  const handleJoinBattle = async () => {
    setIsJoining(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      joinBattle(battle.id);
      // Update local state would happen here
    } catch (error) {
      console.error('Failed to join battle:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = () => {
    const endDate = new Date(battle.endDate);
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const joinLabel = isJoining ? 'Joining' : isParticipant ? 'Joined' : isActive ? 'Join battle' : isUpcoming ? 'Starts soon' : 'Closed';
  const joinClass = isParticipant
    ? 'border border-line-strong bg-surface text-ink'
    : isActive
      ? 'bg-ink text-paper hover:bg-gray-800'
      : 'bg-surface-sunk text-ink-2';

  if (compact) {
    return (
      <div className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink">
              <TypeIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-ink">{battle.name}</h4>
              <p className="text-[0.8125rem] text-ink-3 tabular">{battle.participants?.length || 0} participants</p>
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[battle.status] || 'default'} size="sm">{statusLabel}</Badge>
        </div>
        <p className="mb-3 line-clamp-2 text-[0.8125rem] text-ink-2">{battle.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[0.8125rem] text-ink-3 tabular">{getTimeRemaining()}</span>
          <button
            type="button"
            onClick={handleJoinBattle}
            disabled={isParticipant || !isActive || isJoining}
            aria-busy={isJoining || undefined}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[0.8125rem] font-medium transition-colors disabled:cursor-not-allowed ${joinClass}`}
          >
            {isParticipant && <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
            {isParticipant ? 'Joined' : isActive ? 'Join' : 'Upcoming'}
          </button>
        </div>
      </div>
    );
  }

  const rules = battle.rules ? [
    battle.rules.timeLimit && ['Time limit', battle.rules.timeLimit],
    battle.rules.minProgress && ['Minimum progress', `${battle.rules.minProgress}%`],
    battle.rules.minDailyMinutes && ['Daily goal', `${battle.rules.minDailyMinutes} minutes`],
    battle.rules.scoring && ['Scoring', battle.rules.scoring.replace(/_/g, ' ')],
  ].filter(Boolean) : [];

  return (
    <article className="grid gap-8 py-8 md:py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14" aria-labelledby={`battle-${battle.id}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem] text-ink-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink">
            <TypeIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {type.label}
          </span>
          <span className="text-ink-3 tabular">Battle {battle.id.split('_')[1]}</span>
          <Badge variant={STATUS_VARIANT[battle.status] || 'default'} size="sm">{statusLabel}</Badge>
        </div>

        <h3 id={`battle-${battle.id}`} className="mt-3 t-h2 text-ink">
          <Link to={`/battle/${battle.id}`} className="hover:underline decoration-1 underline-offset-4">{battle.name}</Link>
        </h3>
        <p className="mt-2 max-w-[60ch] text-[0.9375rem] text-ink-2">{battle.description}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-line py-4">
          <div>
            <dt className="flex items-center gap-1.5 t-meta"><Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />Participants</dt>
            <dd className="mt-1 font-serif text-2xl font-medium text-ink tabular">{battle.participants?.length || 0}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 t-meta"><Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />Time left</dt>
            <dd className="mt-1 font-serif text-2xl font-medium text-ink tabular">{getTimeRemaining()}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 t-meta"><Trophy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />Prize</dt>
            <dd className="mt-1 text-[0.9375rem] font-semibold leading-snug text-ink">{battle.prizes?.winner || 'Credits'}</dd>
          </div>
        </dl>

        {rules.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-ink-2">Rules</h4>
            <dl className="mt-2 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
              {rules.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 sm:justify-start">
                  <dt className="text-ink-3">{label}</dt>
                  <dd className="font-medium text-ink first-letter:uppercase tabular">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8125rem] text-ink-3">
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />Starts {formatDate(battle.startDate)}</span>
          <span>Ends {formatDate(battle.endDate)}</span>
        </p>
      </div>

      <div className="flex min-w-0 flex-col">
        {battle.leaderboard && battle.leaderboard.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-ink-2">Current leaders</h4>
            <ol className="mt-2 divide-y divide-line border-y border-line">
              {battle.leaderboard.slice(0, 3).map((participant, index) => (
                <li key={participant.userId} className="flex items-center gap-3 py-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular ${index === 0 ? 'bg-hl text-ink' : 'border border-line-strong text-ink'}`}>
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">{participant.username}</span>
                  <span className="text-right">
                    <span className="block font-semibold text-ink tabular">{participant.score}</span>
                    <span className="block text-[0.8125rem] text-ink-3 tabular">
                      {participant.progress ? `${participant.progress}%` :
                       participant.currentStreak ? `${participant.currentStreak}d` :
                       participant.completionTime || ''}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-line-strong px-4 py-5 text-sm text-ink-2">No one on the board yet. The first to join leads.</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleJoinBattle}
            disabled={isParticipant || !isActive || isJoining}
            aria-busy={isJoining || undefined}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium transition-colors disabled:cursor-not-allowed ${joinClass}`}
          >
            {isParticipant && <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
            {joinLabel}
          </button>
          <Link
            to={`/battle/${battle.id}`}
            className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
