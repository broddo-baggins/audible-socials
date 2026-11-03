import { useState, useEffect } from 'react';
import BookGrid from '../components/books/BookGrid';
import { BookCardSkeleton } from '../components/ui/Skeleton';
import booksData from '../data/books.json';
import { getUserData } from '../utils/localStorage';

const getBookProgress = (bookId, user) => {
  const progressKey = `echoread_progress_${bookId}`;
  const saved = localStorage.getItem(progressKey);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      return progress.progress || 0;
    } catch (error) {
      console.warn('Ignoring unreadable saved progress:', error);
    }
  }
  if (user.completedBooks?.includes(bookId)) return 100;
  if (user.currentlyReading === bookId) return user.currentProgress || 0;
  return 0;
};

const getBookStatus = (progress) => {
  if (progress === 0) return 'Not started';
  if (progress === 100) return 'Finished';
  return 'In progress';
};

const getLastListened = (bookId) => {
  const progressKey = `echoread_progress_${bookId}`;
  const saved = localStorage.getItem(progressKey);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      return progress.lastListened;
    } catch (error) {
      console.error('Error parsing last listened value:', error);
      return null;
    }
  }
  return null;
};

const Library = () => {
  const [books, setBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'audiobooks', label: 'Audiobooks' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'wishlist', label: 'Wishlist' },
  ];
  
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const user = getUserData();
        const byId = (ids = []) => ids.map(id => booksData.find(b => b.id === id)).filter(Boolean);
        // Books already have cover paths in books.json
        const booksWithProgress = byId(user.library).map((book) => {
          const progress = getBookProgress(book.id, user);
          return {
            ...book,
            progress,
            status: getBookStatus(progress),
            lastListened: getLastListened(book.id),
          };
        });

        setBooks(booksWithProgress);
        setWishlistBooks(byId(user.wishlist));
        setLoading(false);
      } catch (error) {
        console.error('Error loading library:', error);
        setLoading(false);
      }
    };
    
    loadLibrary();
  }, []);
  
  const filterBooksByTab = (books) => {
    switch (activeTab) {
      case 'audiobooks':
        return books.filter(b => b.contentType === 'audiobook');
      case 'podcasts':
        return books.filter(b => b.contentType === 'podcast');
      case 'wishlist':
        return wishlistBooks;
      default:
        return books;
    }
  };
  
  const continueListening = books.filter(b => b.progress > 0 && b.progress < 100).slice(0, 6);
  const filteredBooks = filterBooksByTab(books);
  
  return (
    <div className="min-h-screen bg-echo-cream">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-echo-text-primary mb-2">
            My Library
          </h1>
          <p className="text-echo-text-secondary">
            {filteredBooks.length} {activeTab === 'all' ? 'items' : activeTab}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="mb-8 border-b border-echo-divider">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-echo-orange'
                    : 'text-echo-text-secondary hover:text-echo-text-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-echo-orange" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Continue Listening Section */}
        {activeTab === 'all' && continueListening.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-echo-text-primary mb-6">
              Continue Listening
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {loading ? (
                <>
                  {Array.from({ length: 6 }, (_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                continueListening.map((book) => (
                  <div key={book.id} className="space-y-2">
                    <div className="relative aspect-book rounded-lg overflow-hidden bg-echo-beige shadow-card">
                      <img
                        src={book.cover}
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="h-1 bg-echo-player-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-echo-orange"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-white mt-1">{Math.round(book.progress)}%</p>
                      </div>
                    </div>
                    <h3 className="font-serif font-semibold text-sm line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-echo-text-secondary">
                      {book.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
        
        {/* All Books Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-echo-text-primary">
              {activeTab === 'all' ? 'All Books' : tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          
          <BookGrid
            books={filteredBooks}
            loading={loading}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={true}
            emptyMessage={`No ${activeTab === 'all' ? 'books' : activeTab} in your library`}
            emptyAction={() => window.location.href = '/browse'}
            emptyActionLabel="Browse books"
          />
        </section>
      </div>
    </div>
  );
};

export default Library;
