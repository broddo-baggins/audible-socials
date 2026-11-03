import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, Users, Star, ChevronRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
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
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-16 h-24 bg-audible-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-audible-gray-200 rounded w-3/4" />
                <div className="h-3 bg-audible-gray-200 rounded w-1/2" />
                <div className="h-3 bg-audible-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-audible-text-primary">Your Next Listen</h3>
            {useRealAI && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                Grok AI
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleRealAI}
              className="p-2 hover:bg-audible-gray-100 rounded-lg transition-colors"
              aria-label={useRealAI ? 'Switch to offline mode' : 'Switch to live AI'}
              title={useRealAI ? 'Using Grok AI' : 'Offline mode'}
            >
              <Sparkles className={`w-4 h-4 ${useRealAI ? 'text-purple-600' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={reload}
              className="p-2 hover:bg-audible-gray-100 rounded-lg transition-colors"
              aria-label="Refresh recommendations"
            >
              <RefreshCw className={`w-4 h-4 text-audible-text-secondary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const ReasonIcon = reasonIcons[rec.reason_type] || Sparkles;
          
          return (
            <div
              key={rec.book.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/book/${rec.book.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/book/${rec.book.id}`);
                }
              }}
              className="group cursor-pointer bg-audible-gray-50 hover:bg-audible-gray-100 rounded-xl p-3 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex gap-3">
                {/* Book Cover */}
                <div className="relative flex-shrink-0">
                  <img
                    src={rec.book.cover}
                    alt={rec.book.title}
                    className="w-16 h-24 object-cover rounded shadow-md group-hover:shadow-lg transition-shadow"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-audible-text-primary line-clamp-1 group-hover:text-audible-orange transition-colors">
                    {rec.book.title}
                  </h4>
                  <p className="text-xs text-audible-text-secondary mb-2">
                    {rec.book.author}
                  </p>

                  {/* AI Reason */}
                  <div className="flex items-start gap-1.5 mb-2">
                    <ReasonIcon className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-audible-text-secondary leading-snug">
                      {rec.reason}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-audible-text-tertiary">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{rec.book.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.book.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-audible-text-tertiary group-hover:text-audible-orange transition-colors flex-shrink-0 self-center" />
              </div>

              {/* Match Score */}
              {rec.match_score && (
                <div className="mt-2 pt-2 border-t border-audible-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-audible-text-secondary">AI Match Score</span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 h-1.5 bg-audible-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          style={{ width: `${rec.match_score}%` }}
                        />
                      </div>
                      <span className="font-semibold text-purple-600">{rec.match_score}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-xs text-audible-text-secondary">
          💡 <span className="font-semibold">Tip:</span> Recommendations improve as you listen and rate more books!
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations;

