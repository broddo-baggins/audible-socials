import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import IdleGame from '../components/idle/IdleGame';
import { AchievementIcon } from '../components/idle/IdleAchievements';
import { PageHeader, Button } from '../components/ui';
import { getIdleGameState, ACHIEVEMENTS } from '../utils/idleGame';

// Achievement names arrive in capitals and some descriptions shout; set both in plain sentence case.
const sentence = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const plainCopy = (s = '') => s.replace(/!+/g, '.').replace(/\.\./g, '.');

const HOW_IT_WORKS = [
  'Start playing any audiobook from your library.',
  'Your listener gains experience and levels up while it plays.',
  'Levels unlock new activities, like cooking, crafting and gardening.',
  'Listening milestones earn achievements.',
];

/**
 * IdleGamePage: a calm companion for listening. The game panel is on night
 * (it is a "now playing" surface); everything around it is on paper: what
 * you have earned, your numbers and how it works.
 */
const IdleGamePage = () => {
  const [gameState, setGameState] = useState(getIdleGameState());
  const [isPlaying] = useState(false);

  // Development helper: Simulate offline progress
  const simulateOfflineProgress = (minutes) => {
    const now = Date.now();
    const pastTime = now - (minutes * 60 * 1000);

    // Temporarily modify localStorage to simulate being away
    const currentState = getIdleGameState();
    const fakeState = {
      ...currentState,
      lastSaveTime: pastTime
    };
    localStorage.setItem('idleGameState', JSON.stringify(fakeState));

    // Trigger visibility change to simulate coming back
    setTimeout(() => {
      // This will trigger the offline progress calculation
      document.dispatchEvent(new Event('visibilitychange'));
    }, 100);
  };

  useEffect(() => {
    // Refresh game state periodically
    const interval = setInterval(() => {
      setGameState(getIdleGameState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert ACHIEVEMENTS object to array for filtering
  const achievementsArray = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => ({
    ...achievement,
    id
  }));

  const unlockedAchievements = achievementsArray.filter(achievement =>
    gameState.achievements.includes(achievement.id)
  );

  const lockedAchievements = achievementsArray.filter(achievement =>
    !gameState.achievements.includes(achievement.id)
  );

  const activityStats = [
    { label: 'Meditating', value: gameState.activityStats?.meditate },
    { label: 'Cooking', value: gameState.activityStats?.cook },
    { label: 'Crafting', value: gameState.activityStats?.craft },
    { label: 'With the cat', value: gameState.activityStats?.play_with_cat },
  ];

  return (
    <div className="page pb-16">
      <PageHeader
        kicker={
          <Link to="/" className="-ml-1 inline-flex items-center gap-1.5 rounded-full px-1 py-1 normal-case tracking-normal text-sm font-medium text-ink-2 hover:text-ink">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Home
          </Link>
        }
        title="Idle listener"
        description="A small companion that keeps busy while you listen. Every minute of a book earns experience, unlocks activities and saves focus points for upgrades."
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
        {/* Main game area */}
        <div className="min-w-0 space-y-12">
          <IdleGame isPlaying={isPlaying} />

          {/* Start listening */}
          <section aria-labelledby="idle-start" className="grid gap-6 border-t border-line pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 id="idle-start" className="t-h2 text-ink">Listen to earn experience</h2>
              <p className="mt-2 max-w-[56ch] text-[0.9375rem] text-ink-2">
                Play any audiobook to start earning experience and unlocking activities. Nothing grows while the book is paused.
              </p>
              <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
                <li><span className="font-semibold text-ink">1</span> Play audio</li>
                <li><span className="font-semibold text-ink">2</span> Gain XP as you listen</li>
                <li><span className="font-semibold text-ink">3</span> Unlock new activities</li>
              </ol>
            </div>
            <Link
              to="/library"
              className="inline-flex h-11 items-center justify-self-start rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800"
            >
              Browse your library
            </Link>
          </section>

          {/* Development: Offline Progress Simulator */}
          {import.meta.env.DEV && (
            <section aria-labelledby="idle-dev" className="rounded-lg border border-dashed border-line-strong p-5">
              <h2 id="idle-dev" className="t-h3 text-ink">Development tools</h2>
              <p className="mt-1 text-sm text-ink-2">Test how progress builds up while you are away.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => simulateOfflineProgress(5)}>+5 min away</Button>
                <Button size="sm" variant="outline" onClick={() => simulateOfflineProgress(30)}>+30 min away</Button>
                <Button size="sm" variant="outline" onClick={() => simulateOfflineProgress(120)}>+2 h away</Button>
                <Button size="sm" variant="outline" onClick={() => simulateOfflineProgress(1440)}>+24 h away</Button>
              </div>
              <p className="mt-3 text-[0.8125rem] text-ink-3">Switch tabs or minimise the browser, then pick a button.</p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-12">
          {/* Achievements */}
          <section aria-labelledby="idle-achievements">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="idle-achievements" className="t-h2 text-ink">Achievements</h2>
              <span className="t-meta">{unlockedAchievements.length} of {achievementsArray.length}</span>
            </div>

            <ul className="mt-4 max-h-[28rem] divide-y divide-line overflow-y-auto border-y border-line" tabIndex={0} aria-label="Achievements, earned first">
              {unlockedAchievements.map((achievement) => (
                <li key={achievement.id} className="flex items-start gap-3 py-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hl text-ink">
                    <AchievementIcon icon={achievement.icon} unlocked className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink">{sentence(achievement.name)}</h3>
                    <p className="text-sm text-ink-2">{plainCopy(achievement.description)}</p>
                    {achievement.reward && (
                      <p className="mt-1 text-[0.8125rem] text-ink-3 tabular">
                        Reward +{achievement.reward.amount} {achievement.reward.type.toUpperCase()}
                      </p>
                    )}
                  </div>
                </li>
              ))}

              {lockedAchievements.slice(0, 5).map((achievement) => (
                <li key={achievement.id} className="flex items-start gap-3 py-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-ink-3">
                    <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-ink-2">
                      {sentence(achievement.name)}
                      <span className="sr-only">, not earned yet</span>
                    </h3>
                    <p className="text-sm text-ink-3">{plainCopy(achievement.description)}</p>
                  </div>
                </li>
              ))}
            </ul>

            {lockedAchievements.length > 5 && (
              <p className="mt-3 text-[0.8125rem] text-ink-3">{lockedAchievements.length - 5} more to unlock. See them all in the game panel.</p>
            )}
          </section>

          {/* Stats */}
          <section aria-labelledby="idle-stats">
            <h2 id="idle-stats" className="t-h2 text-ink">Your numbers</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="col-span-2">
                <dt className="t-meta">Total listening time</dt>
                <dd className="mt-1 font-serif text-4xl font-medium tabular text-ink">
                  {Math.floor(gameState.totalMinutesListened / 60)}<span className="text-2xl">h</span> {gameState.totalMinutesListened % 60}<span className="text-2xl">m</span>
                </dd>
              </div>
              <div>
                <dt className="t-meta">Activities unlocked</dt>
                <dd className="mt-1 font-serif text-3xl font-medium tabular text-ink">{gameState.unlockedActivities.length}</dd>
              </div>
              <div>
                <dt className="t-meta">Current activity</dt>
                <dd className="mt-1.5 text-lg font-semibold text-ink">{sentence(gameState.currentActivity.replace(/_/g, ' '))}</dd>
              </div>
            </dl>

            <h3 className="mt-8 text-sm font-semibold text-ink-2">Minutes per activity</h3>
            <dl className="mt-3 divide-y divide-line border-y border-line">
              {activityStats.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between py-2.5">
                  <dt className="text-[0.9375rem] text-ink-2">{s.label}</dt>
                  <dd className="text-[0.9375rem] font-semibold tabular text-ink">{Math.floor(s.value || 0)} min</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* How it works */}
          <section aria-labelledby="idle-how">
            <h2 id="idle-how" className="t-h2 text-ink">How it works</h2>
            <ol className="mt-5 space-y-3">
              {HOW_IT_WORKS.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-[0.9375rem] text-ink-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-xs font-semibold text-ink tabular">{i + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-lg bg-hl-wash px-4 py-3 text-sm text-ink">
              <span className="font-semibold">Tip.</span> You earn focus points while you listen. Spend them in the upgrade shop on things that multiply your XP.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default IdleGamePage;
