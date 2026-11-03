import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, Users, Star, ChevronRight, RefreshCw, AlertCircle, BookOpen, Wifi, WifiOff } from 'lucide-react';
import { Badge, Cover } from '../ui';
import { getAIRecommendations } from '../../utils/aiRecommendations';
import { getAIBookRecommendations } from '../../utils/grokAPI';
import { FEATURES } from '../../config/api';
import { getFromLocalStorage } from '../../utils/localStorage';
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
const AIRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useRealAI, setUseRealAI] = useState(FEATURES.useRealAI);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useRealAI) {
        // Use real Grok API for recommendations
        const userLibrary = getFromLocalStorage('userLibrary') || [];
        const friends = getFromLocalStorage('friends') || [];
        const bookClubs = getFromLocalStorage('userClubs') || [];

        // Extract context
        const recentBooks = userLibrary.slice(-5).map(b => b.title || 'Unknown');
        const favoriteGenres = [...new Set(userLibrary.map(b => b.genre).filter(Boolean))].slice(0, 3);
        const friendsReading = friends.slice(0, 3).map(f => f.currentBook || 'Unknown').filter(b => b !== 'Unknown');
        const clubNames = bookClubs.map(c => c.name || 'Book Club');

        const apiRecs = await getAIBookRecommendations({
          recentBooks: recentBooks.length > 0 ? recentBooks : ['Science Fiction classics', 'Fantasy epics'],
          favoriteGenres: favoriteGenres.length > 0 ? favoriteGenres : ['Science Fiction', 'Fantasy'],
          friendsReading: friendsReading.length > 0 ? friendsReading : ['Popular titles'],
          bookClubs: clubNames.length > 0 ? clubNames : ['General reading club'],
        });

        // Match AI recommendations with actual books from catalog
        const enrichedRecs = apiRecs.map(rec => {
          // Try to find matching book in catalog
          const matchedBook = booksData.books.find(b => 
            b.title.toLowerCase().includes(rec.title.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
            b.author.toLowerCase().includes(rec.author.toLowerCase())
          );

          return {
            book: matchedBook || {
              id: `ai-${Math.random()}`,
              title: rec.title,
              author: rec.author,
              cover: '/images/covers/placeholder.jpg',
              rating: 4.5,
              length: '8 hrs',
              genre: favoriteGenres[0] || 'Fiction',
            },
            reason: rec.reason,
            reason_type: rec.reason_type || 'listening_history',
            match_score: rec.match_score || 85,
          };
        });

        setRecommendations(enrichedRecs);
      } else {
        // Fallback to local recommendations
        await new Promise(resolve => setTimeout(resolve, 800));
        const recs = getAIRecommendations();
        setRecommendations(recs);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError('Failed to load recommendations. Using offline suggestions.');
      
      // Fallback to local recommendations
      const recs = getAIRecommendations();
      setRecommendations(recs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

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
              onClick={() => setUseRealAI(!useRealAI)}
              className={iconBtn}
              aria-pressed={useRealAI}
              aria-label={useRealAI ? 'Switch to offline mode' : 'Switch to live AI'}
              title={useRealAI ? 'Using Grok AI' : 'Offline mode'}
            >
              {useRealAI ? <Wifi className="h-4 w-4" strokeWidth={1.75} /> : <WifiOff className="h-4 w-4" strokeWidth={1.75} />}
            </button>
            <button
              type="button"
              onClick={loadRecommendations}
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
              <button
                type="button"
                onClick={() => navigate(`/book/${rec.book.id}`)}
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
                    {rec.book.length && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                        {rec.book.length}
                      </span>
                    )}
                    {rec.match_score && <span className="font-semibold text-ink">{rec.match_score}% match</span>}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 self-center text-ink-3 group-hover:text-ink" strokeWidth={1.75} aria-hidden="true" />
              </button>
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

