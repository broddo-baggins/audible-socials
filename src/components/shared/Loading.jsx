import Waveform from '../ui/Waveform';

/** Loading: the waveform at rest with a quiet line. Holds still under reduced motion. */
export default function Loading({ text = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" role="status" aria-live="polite">
      <Waveform seed="loading" bars={24} height={32} className="w-40 text-ink-3 animate-pulse" />
      <p className="text-sm text-ink-3">{text}</p>
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  );
}
