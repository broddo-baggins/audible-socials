import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Heart, Share2, BookmarkPlus, Clock } from 'lucide-react';
import { Button, Rating, Badge, Card, ProgressBar } from '../components/ui';
import BookCarousel from '../components/books/BookCarousel';
import FriendRecommendations from '../components/social/FriendRecommendations';
import BookClubTeaser from '../components/social/BookClubTeaser';
import { Skeleton } from '../components/ui';
import { usePlayer } from '../contexts/usePlayer';
import booksData from '../data/books.json';

const BookDetail = () => {
  const { bookId } = useParams();
  const { loadBook, play } = usePlayer();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescription, setExpandedDescription] = useState(false);
  
  useEffect(() => {
    const loadBookDetails = async () => {
      try {
        const foundBook = booksData.find(b => b.id === bookId);
        if (!foundBook) {
          setLoading(false);
          return;
        }
        
        // Books already have cover paths in books.json
        setBook(foundBook);
        
        // Load similar books (same genre)
        const similar = booksData
          .filter(b => b.genre === foundBook.genre && b.id !== bookId)
          .slice(0, 12);
        setSimilarBooks(similar);
        
        // Load author books
        const authorBooks = booksData
          .filter(b => b.author === foundBook.author && b.id !== bookId)
          .slice(0, 12);
        setAuthorBooks(authorBooks);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading book details:', error);
        setLoading(false);
      }
    };
    
    loadBookDetails();
  }, [bookId]);
  
  const handleStartListening = () => {
    if (book) {
      loadBook(book);
      play();
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-audible-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            <Skeleton variant="bookCover" height="h-96" />
            <div className="space-y-4">
              <Skeleton variant="title" />
              <Skeleton variant="text" width="1/2" />
              <Skeleton variant="text" count={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="min-h-screen bg-audible-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-audible-text-primary mb-4">Book not found</h1>
          <Link to="/browse">
            <Button>Browse books</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Book Details Section */}
        <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[400px,1fr] gap-8 mb-12">
          {/* Cover Image - Sticky on desktop */}
          <div className="md:sticky md:top-24 self-start">
            <div className="aspect-book rounded-lg overflow-hidden shadow-lg bg-audible-gray-100">
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
            {book.contentType !== 'audiobook' && (
              <div className="mt-4">
                <Badge
                  variant={book.contentType === 'original' ? 'original' : 'podcast'}
                  size="lg"
                  className="w-full justify-center"
                >
                  {book.contentType === 'original' ? 'Audible Original' : 'Podcast Series'}
                </Badge>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div>
            {/* Title and Author */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-4">
                {book.title}
              </h1>
              <p className="text-xl text-audible-text-secondary mb-2">
                By <Link to={`/author/${book.author}`} className="hover:text-audible-orange transition-colors">{book.author}</Link>
              </p>
              {book.narrator && (
                <p className="text-lg text-audible-text-tertiary">
                  Narrated by {book.narrator}
                </p>
              )}
              {book.series && (
                <p className="text-base text-audible-text-tertiary mt-2">
                  {book.series} {book.seriesNumber && `#${book.seriesNumber}`}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="mb-6">
              <Rating
                value={book.rating}
                showValue={true}
                showCount={true}
                count={book.ratingsCount}
                size="lg"
              />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6 text-audible-text-secondary">
              {book.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{book.duration}</span>
                </div>
              )}
              <div>Release: {new Date(book.releaseDate).toLocaleDateString()}</div>
              <div>{book.language}</div>
              <Badge variant="outline">{book.genre}</Badge>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                size="lg"
                onClick={handleStartListening}
                leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
              >
                Start Listening
              </Button>
              <Button 
                size="lg"
                variant="secondary"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Add to Library
              </Button>
              <Button 
                size="lg"
                variant="outline"
                leftIcon={<Heart className="w-5 h-5" />}
              >
                Wishlist
              </Button>
              <Button 
                size="lg"
                variant="ghost"
                leftIcon={<Share2 className="w-5 h-5" />}
              >
                Share
              </Button>
            </div>
            
            {/* Membership Pricing */}
            <Card padding="lg" className="mb-8 bg-audible-gray-50 border-audible-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-audible-text-primary mb-1">
                    1 Credit or ${book.price}
                  </p>
                  <p className="text-sm text-audible-text-secondary">
                    Members get this book for 1 credit
                  </p>
                </div>
                <Button variant="primary">
                  Buy with Credit
                </Button>
              </div>
            </Card>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-audible-text-primary mb-4">About this audiobook</h2>
              <div className={`text-audible-text-secondary leading-relaxed ${!expandedDescription ? 'line-clamp-4' : ''}`}>
                {book.description}
              </div>
              <button
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="text-audible-orange hover:text-audible-orange-dark font-medium mt-2 transition-colors"
              >
                {expandedDescription ? 'Show less' : 'Read more'}
              </button>
            </div>

            {/* Chapters Preview */}
            {book.chapters && book.chapters.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-audible-text-primary mb-4">Chapters</h2>
                <Card padding="none">
                  <div className="divide-y divide-audible-gray-200">
                    {book.chapters.slice(0, 5).map((chapter) => (
                      <div key={chapter.id} className="px-6 py-4 flex items-center justify-between hover:bg-audible-gray-50 transition-colors">
                        <div>
                          <p className="font-medium text-audible-text-primary">{chapter.title}</p>
                        </div>
                        <span className="text-sm text-audible-text-tertiary">{chapter.duration}</span>
                      </div>
                    ))}
                  </div>
                  {book.chapters.length > 5 && (
                    <div className="px-6 py-4 text-center text-audible-text-secondary text-sm">
                      + {book.chapters.length - 5} more chapters
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Publisher Info */}
            <div className="text-sm text-audible-text-tertiary mb-8">
              <p>Publisher: {book.publisher}</p>
            </div>
            
          </div>
        </div>
        
        {/* Social Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <FriendRecommendations bookId={bookId} />
          <BookClubTeaser bookId={bookId} />
        </div>
        
        {/* More from Author */}
        {authorBooks.length > 0 && (
          <section className="mb-12">
            <BookCarousel
              title={`More from ${book.author}`}
              books={authorBooks}
              cardSize="md"
            />
          </section>
        )}
        
        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <section className="mb-12">
            <BookCarousel
              title="People also listened to"
              books={similarBooks}
              cardSize="md"
            />
          </section>
        )}
        
        {/* Reviews Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Ratings and reviews
          </h2>
          <Card padding="lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-5xl font-bold text-audible-text-primary mb-2">
                  {book.rating.toFixed(1)}
                </div>
                <Rating value={book.rating} size="lg" showValue={false} />
                <p className="text-audible-text-secondary mt-2">
                  {book.ratingsCount.toLocaleString()} ratings
                </p>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-audible-text-secondary">{stars} stars</span>
                    <div className="flex-1 h-2 bg-audible-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default BookDetail;
