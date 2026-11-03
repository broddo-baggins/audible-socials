import { useState } from 'react';
import { Play, Plus, Heart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUserData, addToLibrary, toggleWishlist } from '../../utils/localStorage';
import { Button, Badge } from '../ui';
import Cover from '../ui/Cover';
import Waveform from '../ui/Waveform';
import { usePlayer } from '../../contexts/usePlayer';

/**
 * HeroBanner: "Now playing". The one dark surface on Home, the colour of a
 * room with the lights off. The book's own waveform shows where you are in it,
 * the heard part in highlighter. One primary action (resume), two quiet ones.
 */
const minutesLeft = (book, progress) => {
  if (!book.durationMinutes || progress == null) return null;
  const left = Math.round(book.durationMinutes * (1 - progress / 100));
  const h = Math.floor(left / 60);
  const m = left % 60;
  return h ? `${h}h ${m}m left` : `${m}m left`;
};

const HeroBanner = ({ book, progress = null, eyebrow = 'Now playing' }) => {
  const { loadBook, play } = usePlayer();
  const [owned, setOwned] = useState(() => Boolean(book && getUserData().library.includes(book.id)));
  const [wishlisted, setWishlisted] = useState(() => Boolean(book && getUserData().wishlist?.includes(book.id)));

  if (!book) return null;

  const handleStartListening = () => {
    loadBook(book);
    play();
  };

  const left = minutesLeft(book, progress);

  return (
    <section className="on-night relative overflow-hidden rounded-2xl bg-night text-ink-on-night" aria-labelledby="hero-title">
      <div className="relative grid gap-6 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 md:p-8 lg:p-10">
        <Link to={`/book/${book.id}`} className="w-32 sm:w-40 lg:w-48 rounded-sm" aria-label={`${book.title} details`}>
          <Cover src={book.cover} title={book.title} author={book.author} loading="eager" />
        </Link>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-3">
            <p className="text-[0.8125rem] font-medium text-ink-on-night-2">{eyebrow}</p>
            {book.contentType && book.contentType !== 'audiobook' && (
              <Badge variant="highlight" size="sm">{book.contentType === 'original' ? 'Original' : 'Podcast'}</Badge>
            )}
          </div>
          <h1 id="hero-title" className="mt-2 font-serif text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            <Link to={`/book/${book.id}`} className="hover:underline underline-offset-[6px] decoration-1">{book.title}</Link>
          </h1>
          <p className="mt-2 text-[0.9375rem] text-ink-on-night-2">
            {book.author}{book.narrator ? <> · read by {book.narrator}</> : null}
          </p>

          <div className="mt-6 md:mt-auto md:pt-8">
            <Waveform
              seed={book.id}
              bars={72}
              height={44}
              progress={progress != null ? progress / 100 : null}
              className="h-10 w-full text-ink-on-night-2 md:h-11"
              playedClassName="text-hl"
              label={progress != null ? `${progress}% listened` : undefined}
            />
            {progress != null && (
              <div className="mt-2 flex justify-between text-[0.8125rem] text-ink-on-night-2 tabular">
                <span>{progress}% listened</span>
                {left && <span>{left}</span>}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="highlight" size="lg" onClick={handleStartListening} leftIcon={<Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />}>
              {progress ? 'Resume' : 'Start listening'}
            </Button>
            <button
              type="button"
              onClick={() => { addToLibrary(book.id); setOwned(true); }}
              disabled={owned}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#4A4D55] px-5 text-[0.9375rem] font-medium text-ink-on-night hover:bg-night-raised disabled:hover:bg-transparent"
            >
              {owned ? <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
              {owned ? 'In your library' : 'Add to library'}
            </button>
            <button
              type="button"
              onClick={() => setWishlisted(toggleWishlist(book.id))}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink-on-night-2 hover:bg-night-raised hover:text-ink-on-night"
            >
              <Heart className={`h-5 w-5 ${wishlisted ? 'fill-hl text-hl' : ''}`} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroBanner.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    narrator: PropTypes.string,
    durationMinutes: PropTypes.number,
    cover: PropTypes.string,
    contentType: PropTypes.string,
  }),
  progress: PropTypes.number,
  eyebrow: PropTypes.string,
};

export default HeroBanner;
