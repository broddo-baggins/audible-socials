import { Play, Pause, X } from 'lucide-react';
import { usePlayer } from '../../contexts/usePlayer';

const MiniPlayer = () => {
  const {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    isMinimized,
    togglePlay,
    maximize,
    closePlayer,
  } = usePlayer();
  
  if (!currentBook || !isMinimized) {
    return null;
  }
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const info = (
    <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
      <img src={currentBook.cover} alt="" className="h-12 w-8 shrink-0 rounded-sm object-cover md:h-14 md:w-[2.4rem]" />
      <div className="min-w-0 flex-1">
        <p className="t-title-book truncate text-[0.9375rem] text-ink-on-night">{currentBook.title}</p>
        <p className="truncate text-[0.8125rem] text-ink-on-night-2">{currentBook.author}</p>
      </div>
    </div>
  );

  const progress = (
    <div className="absolute inset-x-0 top-0 h-[3px] bg-[#3A3D45]" role="progressbar" aria-label="Progress" aria-valuenow={Math.round(progressPercentage)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-hl" style={{ width: `${progressPercentage}%` }} />
    </div>
  );

  const playButton = (
    <button
      type="button"
      onClick={togglePlay}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-hl text-ink hover:bg-[#D6E43F]"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={0} />}
    </button>
  );

  return (
    <>
      {/* Desktop and tablet */}
      <div className="on-night fixed inset-x-0 bottom-0 z-40 hidden border-t border-[#2A2C32] bg-night md:block" aria-label="Mini player" role="region">
        {progress}
        <div className="page flex items-center gap-4 py-3">
          <button type="button" onClick={maximize} className="flex min-w-0 flex-1 items-center rounded-lg text-left" aria-label={`Open player: ${currentBook.title}`}>
            {info}
          </button>
          <div className="flex shrink-0 items-center gap-2">
            {playButton}
            <button
              type="button"
              onClick={closePlayer}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-on-night-2 hover:bg-night-raised hover:text-ink-on-night"
              aria-label="Close player"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Phone: above the bottom nav */}
      <div className="on-night fixed inset-x-2 bottom-[4.25rem] z-40 overflow-hidden rounded-lg bg-night shadow-md md:hidden" role="region" aria-label="Mini player">
        {progress}
        <div className="flex items-center gap-3 p-2.5 pt-3">
          <button type="button" onClick={maximize} className="flex min-w-0 flex-1 items-center rounded-md text-left" aria-label={`Open player: ${currentBook.title}`}>
            {info}
          </button>
          {playButton}
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
