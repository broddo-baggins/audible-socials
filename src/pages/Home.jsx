import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, GraduationCap } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import BookCarousel from '../components/books/BookCarousel';
import SocialNudges from '../components/social/SocialNudges';
import { HeroSkeleton, CarouselSkeleton } from '../components/ui/Skeleton';
import { Card, Rating } from '../components/ui';
import booksData from '../data/books.json';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [featuredBook, setFeaturedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Books already have cover paths in books.json
        setBooks(booksData);
        // Set first audiobook as featured
        setFeaturedBook(booksData.find(b => b.contentType === 'audiobook') || booksData[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);
  
  // Categorize books
  const audiobooks = books.filter(b => b.contentType === 'audiobook');
  const originals = books.filter(b => b.contentType === 'original');
  const podcasts = books.filter(b => b.contentType === 'podcast');
  
  // Continue listening - simulate with progress
  const continueListening = audiobooks.slice(0, 8).map((book, index) => ({
    ...book,
    progress: 15 + (index * 8), // Simulate progress
  }));
  
  // Personalized recommendations
  const recommendations = audiobooks.slice(8, 18);
  
  // New releases - recent books
  const newReleases = audiobooks
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, 12);
  
  // Best sellers - highest rated with most ratings
  const bestSellers = [...audiobooks]
    .sort((a, b) => {
      const scoreA = a.rating * Math.log(a.ratingsCount + 1);
      const scoreB = b.rating * Math.log(b.ratingsCount + 1);
      return scoreB - scoreA;
    })
    .slice(0, 12);
  
  // Popular by genre
  const sciFiBooks = audiobooks.filter(b => b.genre === 'Science Fiction').slice(0, 10);
  const mysteryBooks = audiobooks.filter(b => b.genre === 'Mystery & Thriller').slice(0, 10);
  const fantasyBooks = audiobooks.filter(b => b.genre === 'Fantasy').slice(0, 10);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-audible-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <HeroSkeleton />
          <CarouselSkeleton />
          <CarouselSkeleton />
          <CarouselSkeleton />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Educational Disclaimer Banner */}
        <section>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  📚 Educational Mock Project - Listenable
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  This is a demonstration platform created for academic purposes to showcase how <strong>social networking features</strong> can reduce "<strong>Time To Next Book</strong>" metrics in audiobook service funnels. 
                  <span className="block mt-1 font-medium">Not affiliated with or endorsed by Audible or Amazon.</span>
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Educational Demo</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">AI Features Added</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Banner */}
        <section>
          <HeroBanner book={featuredBook} />
        </section>
        
        {/* Continue Listening */}
        {continueListening.length > 0 && (
          <section>
            <BookCarousel 
              title="Continue Listening"
              books={continueListening}
              showProgress={true}
              cardSize="md"
              seeAllLink="/library"
            />
          </section>
        )}
        
        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <BookCarousel 
              title="Recommended for You"
              books={recommendations}
              cardSize="md"
            />
          </section>
        )}
        
        {/* Social Features - Enhanced */}
        <section className="bg-audible-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-audible-text-primary mb-3">
                Connect & Discover with Friends
          </h2>
              <p className="text-lg text-audible-text-secondary max-w-2xl mx-auto">
                See what your friends are listening to, join book clubs, and discover new stories together
              </p>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 mb-8">
              {/* Social Activity Feed */}
              <div>
                <h3 className="text-xl font-semibold text-audible-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-audible-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Friend Activity
                </h3>
                <SocialNudges limit={4} />
              </div>

              {/* Book Clubs Showcase */}
              <div>
                <h3 className="text-xl font-semibold text-audible-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-audible-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zm0 0V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                  Popular Book Clubs
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-audible-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-audible-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        R
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-audible-text-primary">Reese's Book Club</h4>
                        <p className="text-sm text-audible-text-secondary">42K members • Monthly picks</p>
                        <p className="text-xs text-audible-text-tertiary mt-1">Currently reading: Where the Crawdads Sing</p>
                      </div>
                        <Link
                          to="/clubs"
                          className="px-3 py-1 bg-audible-orange text-white text-sm rounded hover:bg-audible-orange-dark transition-colors"
                        >
                          Join
                        </Link>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-audible-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-audible-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        S
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-audible-text-primary">Sci-Fi Sundays</h4>
                        <p className="text-sm text-audible-text-secondary">19K members • Bi-weekly</p>
                        <p className="text-xs text-audible-text-tertiary mt-1">Exploring the Three-Body Problem</p>
                      </div>
                      <Link
                        to="/clubs"
                        className="px-3 py-1 bg-audible-blue-500 text-white text-sm rounded hover:bg-audible-blue-600 transition-colors"
                      >
                        Join
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link
                to="/social"
                className="inline-flex items-center gap-2 px-6 py-3 bg-audible-orange text-white font-medium rounded-lg hover:bg-audible-orange-dark transition-colors shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Explore Social Hub
              </Link>
            </div>
          </div>
        </section>
        
        {/* Time To Next Book - Discovery Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-audible-text-primary mb-3">
                Your Next Great Read Awaits
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-2xl mx-auto">
                Discover your next book with personalized recommendations based on what you've loved
              </p>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 mb-8">
              {/* Recently Completed */}
              <div>
                <h3 className="text-xl font-semibold text-audible-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recently Completed
                </h3>
                <div className="space-y-4">
                  {audiobooks.slice(0, 3).map((book) => (
                    <div key={book.id} className="bg-white p-4 rounded-lg border border-audible-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/book/${book.id}`} className="block">
                            <h4 className="font-semibold text-audible-text-primary hover:text-audible-orange transition-colors line-clamp-1">
                              {book.title}
                            </h4>
                          </Link>
                          <p className="text-sm text-audible-text-secondary mb-2">{book.author}</p>
                          <div className="flex items-center gap-2 text-xs text-audible-text-tertiary">
                            <span>Completed 3 days ago</span>
                            <span>•</span>
                            <span>{book.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Rating value={book.rating} size="sm" showValue={false} />
                            <span className="text-sm text-audible-text-secondary ml-1">
                              You rated {book.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Reads */}
              <div>
                <h3 className="text-xl font-semibold text-audible-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Recommended for You
                </h3>
                <div className="space-y-4">
                  {audiobooks.slice(3, 6).map((book) => (
                    <div key={book.id} className="bg-white p-4 rounded-lg border border-audible-gray-200 hover:shadow-md transition-shadow group">
                      <div className="flex items-start gap-3">
                        <Link to={`/book/${book.id}`}>
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0 group-hover:shadow-lg transition-shadow"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/book/${book.id}`}>
                            <h4 className="font-semibold text-audible-text-primary hover:text-audible-orange transition-colors line-clamp-1">
                              {book.title}
                            </h4>
                          </Link>
                          <p className="text-sm text-audible-text-secondary mb-2">{book.author}</p>
                          <div className="flex items-center gap-2 text-xs text-audible-text-tertiary mb-2">
                            <span>{book.duration}</span>
                            <span>•</span>
                            <span>{book.genre}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Rating value={book.rating} size="sm" showValue={false} />
                            <span className="text-sm text-audible-text-secondary ml-1">
                              {book.rating} ({book.ratingsCount.toLocaleString()})
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/book/${book.id}`}
                          className="px-3 py-1 bg-audible-orange text-white text-sm rounded hover:bg-audible-orange-dark transition-colors flex-shrink-0"
                        >
                          Get Book
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Discovery Actions */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-audible-orange text-white font-medium rounded-lg hover:bg-audible-orange-dark transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Quick Quiz: Find Your Next Read
                </button>
                <Link
                  to="/browse?sort=trending"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-audible-gray-300 text-audible-text-primary font-medium rounded-lg hover:bg-audible-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Browse Trending Books
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* New Releases */}
        {newReleases.length > 0 && (
          <section>
            <BookCarousel 
              title="New Releases"
              books={newReleases}
              cardSize="md"
              seeAllLink="/browse?sort=newest"
            />
          </section>
        )}
        
        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section>
            <BookCarousel 
              title="Best Sellers"
              books={bestSellers}
              cardSize="md"
              seeAllLink="/browse?sort=popular"
            />
          </section>
        )}
        
        {/* EchoRead Originals */}
        {originals.length > 0 && (
          <section>
            <BookCarousel 
              title="Audible Originals"
              books={originals}
              cardSize="md"
              seeAllLink="/originals"
            />
          </section>
        )}
        
        {/* Popular Podcasts */}
        {podcasts.length > 0 && (
          <section>
            <BookCarousel 
              title="Popular Podcasts"
              books={podcasts}
              cardSize="md"
              seeAllLink="/podcasts"
            />
          </section>
        )}
        
        {/* Genre-based Recommendations */}
        {sciFiBooks.length > 0 && (
          <section>
            <BookCarousel 
              title="Science Fiction"
              books={sciFiBooks}
              cardSize="md"
              seeAllLink="/browse?genre=science-fiction"
            />
          </section>
        )}
        
        {mysteryBooks.length > 0 && (
          <section>
            <BookCarousel 
              title="Mystery & Thriller"
              books={mysteryBooks}
              cardSize="md"
              seeAllLink="/browse?genre=mystery"
            />
          </section>
        )}
        
        {fantasyBooks.length > 0 && (
          <section>
            <BookCarousel 
              title="Fantasy"
              books={fantasyBooks}
              cardSize="md"
              seeAllLink="/browse?genre=fantasy"
            />
          </section>
        )}
        
        {/* Book Clubs Section */}
        <section>
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Book Clubs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-audible-gray-50 rounded-lg border border-audible-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-audible-orange rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-audible-text-primary">Join a Book Club</h3>
              <p className="text-audible-text-secondary text-sm mb-4">
                Connect with fellow listeners and discuss your favorite audiobooks
                </p>
                <a 
                  href="/clubs" 
                className="text-audible-orange hover:text-audible-orange-dark font-medium text-sm"
                >
                  Explore clubs →
                </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
