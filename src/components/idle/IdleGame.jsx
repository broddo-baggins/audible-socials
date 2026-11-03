import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Rewind, FastForward, AlertCircle, ExternalLink } from 'lucide-react';
import { useIdleGame } from '../../hooks/useIdleGame';
import { usePlayer } from '../../contexts/usePlayer';
import { Cover, Waveform } from '../ui';
import IdleHeader from './IdleHeader';
import CharacterVisuals from './CharacterVisuals';
import ActivityGrid from './ActivityGrid';
import UpgradeShop from './UpgradeShop';
import IdleAchievements, { AchievementIcon } from './IdleAchievements';
import FloatingText from './FloatingText';

const sentence = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/**
 * IdleGame: the game panel. It sits on the night surface because it is a
 * "now playing" companion: the book you hear drives it. One highlighter
 * moment per state: the level bar, the heard waveform and the play button.
 * All state comes from useIdleGame; this file only lays it out.
 */
const IdleGame = ({ isPlaying: externalIsPlaying, currentBook: externalBook }) => {
  // Use global player context if props are not provided or to control playback
  const player = usePlayer();

  // Props take precedence if provided, otherwise the player context.
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : player.isPlaying;
  const currentBook = externalBook !== undefined ? externalBook : player.currentBook;

  const {
    gameState,
    progressPercent,
    floatingTexts,
    newAchievements,
    changeActivity,
    purchaseUpgrade
  } = useIdleGame(isPlaying, currentBook);

  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleActivityChange = (activityId) => {
    if (changeActivity(activityId)) {
      setShowActivityMenu(false);
    }
  };

  const handlePurchase = (upgradeId) => {
    const result = purchaseUpgrade(upgradeId);
    if (result.success) {
      // Purchase successful - could add additional feedback here
    }
  };

  const nightControl = 'inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-on-night-2 transition-colors hover:bg-night hover:text-ink-on-night disabled:opacity-45';

  return (
    <section
      className="on-night relative overflow-hidden rounded-2xl bg-night p-5 text-ink-on-night sm:p-6 md:p-8"
      aria-label="Idle listener game"
    >
      {/* Floating receipts for XP and focus points */}
      <FloatingText items={floatingTexts} />

      {/* Achievement notices */}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        <AnimatePresence>
          {newAchievements.map((achievement) => (
            <Motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-lg border border-[#3A3D45] bg-night py-3 pl-3 pr-5 text-ink-on-night shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hl text-ink">
                <AchievementIcon icon={achievement.icon} />
              </span>
              <div>
                <p className="text-[0.8125rem] text-ink-on-night-2">Achievement unlocked</p>
                <p className="font-semibold">{sentence(achievement.name)}</p>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-8">
        <IdleHeader gameState={gameState} progressPercent={progressPercent} />

        {/* The listener and the one control that matters */}
        <div className="rounded-lg bg-night-raised p-4 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <CharacterVisuals activity={gameState.currentActivity} isPlaying={isPlaying} />
            <button
              type="button"
              onClick={() => player.togglePlay()}
              className={`inline-flex h-14 shrink-0 items-center justify-center gap-2 self-start rounded-full px-6 font-medium transition-colors sm:self-center ${
                isPlaying ? 'border border-[#4A4D55] text-ink-on-night hover:bg-night' : 'bg-hl text-ink hover:bg-[#D6E43F]'
              }`}
            >
              {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} aria-hidden="true" /> : <Play className="h-5 w-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>

          {/* Status: the activity's own waveform, lit while it earns */}
          <div className="mt-6 flex items-center gap-4" role="status">
            <Waveform
              seed={gameState.currentActivity}
              bars={40}
              height={20}
              progress={isPlaying ? 1 : 0}
              className={`h-5 w-32 shrink-0 sm:w-44 ${isPlaying ? 'text-hl' : 'text-ink-on-night-2'}`}
              playedClassName="text-hl"
            />
            <p className="text-[0.9375rem] text-ink-on-night-2">
              {isPlaying ? <><span className="font-semibold text-ink-on-night">Listening.</span> Gaining XP.</> : <><span className="font-semibold text-ink-on-night">Paused.</span> No progress until a book plays.</>}
            </p>
          </div>
        </div>

        {/* Current book */}
        {currentBook ? (
          <div className="flex items-start gap-4">
            <div className={`relative w-14 shrink-0 transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-70'}`}>
              <Cover src={currentBook.cover} title={currentBook.title} author={currentBook.author} shadow={false} />
              {player.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-night/70" aria-hidden="true">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-on-night border-t-transparent" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.8125rem] text-ink-on-night-2">{isPlaying ? 'Playing now' : 'Your book'}</p>
              <p className="t-title-book truncate text-lg">{currentBook.title}</p>
              <p className="truncate text-[0.8125rem] text-ink-on-night-2">{currentBook.author}</p>

              {player.audioError && (
                <p className="mt-2 flex items-start gap-1.5 text-[0.8125rem] text-ink-on-night" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {player.audioError}
                </p>
              )}

              <div className="-ml-2.5 mt-2 flex items-center gap-1">
                <button type="button" onClick={() => player.skipBackward()} disabled={player.isLoading} className={nightControl} aria-label="Skip back">
                  <Rewind className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => player.togglePlay()} disabled={player.isLoading} className={nightControl} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {player.isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ) : (
                    <Play className="h-5 w-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  )}
                </button>
                <button type="button" onClick={() => player.skipForward()} disabled={player.isLoading} className={nightControl} aria-label="Skip forward">
                  <FastForward className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              {player.audioError && (
                <div className="mt-3 border-t border-[#2C2F36] pt-3">
                  <button
                    type="button"
                    onClick={() => player.searchYouTube(currentBook)}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#4A4D55] px-4 text-[0.8125rem] font-medium text-ink-on-night hover:bg-night-raised"
                  >
                    Search YouTube for a preview
                    <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <p className="mt-1.5 text-xs text-ink-on-night-2">Opens a YouTube search in a new tab.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-[#4A4D55] px-4 py-4">
            <p className="text-[0.9375rem] text-ink-on-night-2">No book selected. Pick one in your library to start.</p>
            <Link to="/library" className="inline-flex h-11 items-center rounded-full bg-ink-on-night px-4 text-[0.8125rem] font-medium text-ink hover:bg-white">
              Open library
            </Link>
          </div>
        )}

        {/* Totals */}
        <dl className="grid grid-cols-2 gap-6 border-y border-[#2C2F36] py-5 sm:grid-cols-3">
          <div>
            <dt className="text-[0.8125rem] text-ink-on-night-2">Achievements</dt>
            <dd className="mt-1 font-serif text-3xl font-medium tabular">{gameState.achievements.length}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-on-night-2">Total listening</dt>
            <dd className="mt-1 font-serif text-3xl font-medium tabular">{Math.floor(gameState.totalMinutesListened / 60)}h</dd>
          </div>
          {gameState.purchasedUpgrades.length > 0 && (
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[0.8125rem] text-ink-on-night-2">Active multipliers</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 text-[0.9375rem] font-semibold tabular">
                {gameState.multipliers.xp > 1 && <span>XP ×{gameState.multipliers.xp.toFixed(2)}</span>}
                {gameState.multipliers.fp > 1 && <span>FP ×{gameState.multipliers.fp.toFixed(2)}</span>}
                {gameState.multipliers.xp <= 1 && gameState.multipliers.fp <= 1 && <span className="font-normal text-ink-on-night-2">None yet</span>}
              </dd>
            </div>
          )}
        </dl>

        {/* What to do next */}
        <div className="space-y-2">
          <ActivityGrid
            gameState={gameState}
            onActivityChange={handleActivityChange}
            showMenu={showActivityMenu}
            onToggleMenu={() => setShowActivityMenu(!showActivityMenu)}
          />
          <UpgradeShop
            gameState={gameState}
            onPurchase={handlePurchase}
            showShop={showShop}
            onToggleShop={() => setShowShop(!showShop)}
          />
          <IdleAchievements
            gameState={gameState}
            showAchievements={showAchievements}
            onToggleAchievements={() => setShowAchievements(!showAchievements)}
          />
        </div>
      </div>
    </section>
  );
};

export default IdleGame;
