import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Star, ChevronRight, RefreshCw, AlertCircle, BookOpen, Wifi, WifiOff } from 'lucide-react';
import { Badge, Cover } from '../ui';
import { getAIRecommendations, getListeningContext } from '../../utils/aiRecommendations';
import { getAIBookRecommendations } from '../../utils/grokAPI';
import { FEATURES } from '../../config/api';
import booksData from '../../data/books.json';

/**
 * AI Recommendations Component
 * 
 * Provides intelligent book recommendations based on:
 * - User's listening history
 * - Reading preferences and genres
 * - Friends' activity and ratings
 * - Current trends in book clubs
 */
/**
 * Load recommendations from Grok (live) or the local engine (offline).
 * Resolves to { recs, error }; never rejects.
 */
const fetchRecommendations = async (live) => {
  try {
    if (!live) {
      // Brief pause so offline mode still shows the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      return { recs: getAIRecommendations(), error: null };
    }

    const { libraryBooks, friends, clubs } = getListeningContext();

    // Extract context
    const recentBooks = libraryBooks.slice(-5).map(b => b.title);
    const favoriteGenres = [...new Set(libraryBooks.map(b => b.genre).filter(Boolean))].slice(0, 3);
    const friendsReading = friends
      .slice(0, 3)
      .map(f => booksData.find(b => b.id === f.currentlyReading)?.title)
      .filter(Boolean);
    const clubNames = clubs.map(c => c.name).filter(Boolean);

    const apiRecs = await getAIBookRecommendations({
      recentBooks: recentBooks.length > 0 ? recentBooks : ['Science Fiction classics', 'Fantasy epics'],
      favoriteGenres: favoriteGenres.length > 0 ? favoriteGenres : ['Science Fiction', 'Fantasy'],
      friendsReading: friendsReading.length > 0 ? friendsReading : ['Popular titles'],
      bookClubs: clubNames.length > 0 ? clubNames : ['General reading club'],
    });

    // Match AI recommendations with actual books from catalog; drop any the
    // catalog doesn't have, since a card links to the book's page.
    const enrichedRecs = (Array.isArray(apiRecs) ? apiRecs : [])
      .filter(rec => typeof rec?.title === 'string' && typeof rec?.author === 'string')
      .map(rec => {
        const titleStart = rec.title.toLowerCase().split(' ').slice(0, 3).join(' ');
        const matchedBook = booksData.find(b =>
          b.title.toLowerCase().includes(titleStart) ||
          b.author.toLowerCase().includes(rec.author.toLowerCase())
        );
        return matchedBook && {
          book: matchedBook,
          reason: rec.reason,
          reason_type: rec.reason_type || 'listening_history',
          match_score: Number(rec.match_score) || 85,
        };
      })
      .filter(Boolean)
      .filter((rec, i, all) => all.findIndex(r => r.book.id === rec.book.id) === i);

    // Offline/mock AI replies are plain text, not a JSON list: use the local engine
    return { recs: enrichedRecs.length > 0 ? enrichedRecs : getAIRecommendations(), error: null };
  } catch (err) {
    console.warn('Failed to load recommendations:', err);
    return {
      recs: getAIRecommendations(),
      error: 'Failed to load recommendations. Using offline suggestions.',
    };
  }
};

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useRealAI, setUseRealAI] = useState(FEATURES.useRealAI);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchRecommendations(useRealAI).then(({ recs, error: loadError }) => {
      if (!active) return;
      setRecommendations(recs);
      setError(loadError);
      setLoading(false);
    });
    return () => { active = false; };
  }, [useRealAI, reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey(k => k + 1);
  };

  const toggleRealAI = () => {
    setLoading(true);
    setUseRealAI(live => !live);
  };

  const reasonIcons = {
    'listening_history': TrendingUp,
    'friends_activity': Users,
    'book_club': Users,
    'quick_listen': Clock,
    'high_rated': Star,
  };

  const iconBtn = 'inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink';

  if (loading) {
    return (
      <div className="space-y-5 p-5" aria-busy="true" aria-label="Loading recommendations">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3" aria-hidden="true">
            <div className="shimmer h-24 w-16 rounded-sm" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="shimmer h-4 w-3/4 rounded-sm" />
              <div className="shimmer h-3 w-1/2 rounded-sm" />
              <div className="shimmer h-3 w-2/3 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-medium text-ink">Your next listen</h3>
            {useRealAI && <Badge variant="outline" size="sm">Grok AI</Badge>}
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleRealAI}
              className={iconBtn}
              aria-pressed={useRealAI}
              aria-label={useRealAI ? 'Switch to offline mode' : 'Switch to live AI'}
              title={useRealAI ? 'Using Grok AI' : 'Offline mode'}
            >
              {useRealAI ? <Wifi className="h-4 w-4" strokeWidth={1.75} /> : <WifiOff className="h-4 w-4" strokeWidth={1.75} />}
            </button>
            <button
              type="button"
              onClick={reload}
              className={iconBtn}
              aria-label="Refresh recommendations"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        {error && (
          <p role="status" className="mt-2 flex items-start gap-2 rounded-md bg-surface-sunk px-3 py-2 text-[0.8125rem] text-ink-2">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>

      {/* Recommendations */}
      <ol className="divide-y divide-line border-y border-line">
        {recommendations.map((rec, index) => {
          const ReasonIcon = reasonIcons[rec.reason_type] || BookOpen;

          return (
            <li key={rec.book.id}>
              {/* A real link: it opens the book's page */}
              <Link
                to={`/book/${rec.book.id}`}
                role="link"
                className="group flex w-full gap-3 py-3.5 text-left"
              >
                {/* Book Cover */}
                <div className="relative w-14 shrink-0">
                  <Cover src={rec.book.cover} title={rec.book.title} author={rec.book.author} shadow={false} />
                  {index === 0 && (
                    <span className="absolute -left-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-hl text-[0.6875rem] font-bold text-ink" aria-label="Top pick">1</span>
                  )}
                </div>

                {/* Book Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="t-title-book text-[0.9375rem] text-ink line-clamp-1 group-hover:underline underline-offset-4">
                    {rec.book.title}
                  </h4>
                  <p className="text-[0.8125rem] text-ink-2">{rec.book.author}</p>

                  {/* AI Reason */}
                  <p className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] leading-snug text-ink-2">
                    <ReasonIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                    <span>{rec.reason}</span>
                  </p>

                  {/* Stats */}
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3 tabular">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-ink text-ink" strokeWidth={1.5} aria-hidden="true" />
                      {rec.book.rating}
                    </span>
                    {rec.book.duration && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                        {rec.book.duration}
                      </span>
                    )}
                    {rec.match_score > 0 && <span className="font-semibold text-ink">{rec.match_score}% match</span>}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 self-center text-ink-3 group-hover:text-ink" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Footer Tip */}
      <p className="text-[0.8125rem] text-ink-3">
        Recommendations get better as you listen to and rate more books.
      </p>
    </div>
  );
};

export default AIRecommendations;

