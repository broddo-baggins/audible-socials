import { useState, useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import BookCarousel from '../components/books/BookCarousel';
import SocialNudges from '../components/social/SocialNudges';
import { HeroSkeleton, CarouselSkeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui';
import { getImageUrl } from '../utils/imageCache';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [featuredBook, setFeaturedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch('/src/data/books.json');
        const booksData = await response.json();
        
        // Add cover images to books
        const booksWithCovers = await Promise.all(
          booksData.map(async (book) => ({
            ...book,
            cover: await getImageUrl(book.coverQuery || `${book.title} ${book.author} book cover`),
          }))
        );
        
        setBooks(booksWithCovers);
        // Set first audiobook as featured
        setFeaturedBook(booksWithCovers.find(b => b.contentType === 'audiobook') || booksWithCovers[0]);
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
      <div className="min-h-screen bg-echo-cream">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 py-8 space-y-12">
          <HeroSkeleton />
          <CarouselSkeleton />
          <CarouselSkeleton />
          <CarouselSkeleton />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-echo-cream">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 py-8 space-y-12">
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
              title="Because you listened to Project Hail Mary"
              books={recommendations}
              cardSize="md"
            />
          </section>
        )}
        
        {/* Social Nudges */}
        <section>
          <h2 className="text-2xl font-bold text-echo-text-primary mb-6">
            What Your Friends Are Up To
          </h2>
          <SocialNudges limit={3} />
        </section>
        
        {/* Friend Activity - Social Integration */}
        {/* This would integrate with FriendRecommendations component */}
        <section>
          <BookCarousel 
            title="Friends are listening to"
            books={audiobooks.slice(20, 30)}
            cardSize="md"
          />
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
              title="EchoRead Originals"
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
              title="Sci-Fi Adventures"
              books={sciFiBooks}
              cardSize="md"
              seeAllLink="/browse?genre=science-fiction"
            />
          </section>
        )}
        
        {mysteryBooks.length > 0 && (
          <section>
            <BookCarousel 
              title="Mystery & Thrillers"
              books={mysteryBooks}
              cardSize="md"
              seeAllLink="/browse?genre=mystery"
            />
          </section>
        )}
        
        {fantasyBooks.length > 0 && (
          <section>
            <BookCarousel 
              title="Fantasy Worlds"
              books={fantasyBooks}
              cardSize="md"
              seeAllLink="/browse?genre=fantasy"
            />
          </section>
        )}
        
        {/* Book Clubs You Might Like - Social Integration */}
        {/* This would integrate with clubs data */}
        <section>
          <div className="px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-echo-text-primary mb-4">
              Book Clubs You Might Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Club cards would go here */}
              <div className="p-6 bg-white rounded-xl border border-echo-border hover:shadow-card transition-shadow">
                <h3 className="font-semibold text-lg mb-2">Discover book clubs</h3>
                <p className="text-echo-text-secondary mb-4">
                  Join communities of readers listening to the same books
                </p>
                <a 
                  href="/clubs" 
                  className="text-echo-orange hover:text-echo-orange-dark font-medium"
                >
                  Explore clubs →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
