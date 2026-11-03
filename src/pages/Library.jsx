import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookGrid from '../components/books/BookGrid';
import BookCard from '../components/books/BookCard';
import { PageHeader, Button } from '../components/ui';
import { BookCardSkeleton } from '../components/ui/Skeleton';
import booksData from '../data/books.json';

/**
 * Library: what you own. The counts as three serif numbers, then the books you
 * are in the middle of, then the whole shelf behind tabs.
 */
const getBookProgress = (bookId) => {
  const progressKey = `echoread_progress_${bookId}`;
  const saved = localStorage.getItem(progressKey);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      return progress.progress || 0;
    } catch (error) {
      console.error('Error parsing saved progress:', error);
      return 0;
    }
  }
  return Math.floor(Math.random() * 100);
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

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'audiobooks', label: 'Audiobooks' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'wishlist', label: 'Wishlist' },
];

const Library = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    try {
      const booksWithProgress = booksData.slice(0, 20).map((book) => {
        const progress = getBookProgress(book.id);
        return {
          ...book,
          progress,
          status: getBookStatus(progress),
          lastListened: getLastListened(book.id),
        };
      });
      setBooks(booksWithProgress);
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterBooksByTab = (list) => {
    switch (activeTab) {
      case 'audiobooks':
        return list.filter((b) => b.contentType === 'audiobook');
      case 'podcasts':
        return list.filter((b) => b.contentType === 'podcast');
      case 'wishlist':
        // In a real app, this would filter by wishlist status
        return list.filter((_, i) => i % 3 === 0);
      default:
        return list;
    }
  };

  const continueListening = books
    .filter((b) => b.progress > 0 && b.progress < 100)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 6);
  const filteredBooks = filterBooksByTab(books);
  const activeLabel = tabs.find((t) => t.id === activeTab)?.label;

  const stats = [
    { label: 'in progress', value: books.filter((b) => b.status === 'In progress').length },
    { label: 'finished', value: books.filter((b) => b.status === 'Finished').length },
    { label: 'not started', value: books.filter((b) => b.status === 'Not started').length },
  ];

  return (
    <div className="page pb-16">
      <PageHeader
        title="Your library"
        description="Everything you own, and where you left off."
        actions={<Button variant="secondary" onClick={() => navigate('/browse')}>Find a new book</Button>}
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-5">
          <div className="flex flex-col-reverse">
            <dt className="mt-1.5 text-[0.8125rem] text-ink-3">titles</dt>
            <dd className="font-serif text-[2.25rem] font-medium leading-none text-ink tabular">{loading ? '-' : books.length}</dd>
          </div>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1.5 text-[0.8125rem] text-ink-3">{s.label}</dt>
              <dd className="font-serif text-[2.25rem] font-medium leading-none text-ink tabular">{loading ? '-' : s.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Tabs */}
      <div role="tablist" aria-label="Library sections" className="flex gap-6 overflow-x-auto border-b border-line scrollbar-hide">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="library-panel"
              onClick={() => setActiveTab(tab.id)}
              className={`relative -mb-px inline-flex h-11 shrink-0 items-center whitespace-nowrap text-[0.9375rem] font-medium ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              {tab.label}
              {selected && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div id="library-panel" role="tabpanel" aria-label={activeLabel} className="space-y-16 pt-10 md:space-y-20">
        {/* Continue listening */}
        {activeTab === 'all' && (loading || continueListening.length > 0) && (
          <section aria-labelledby="continue-title">
            <h2 id="continue-title" className="t-h2 text-ink">Continue listening</h2>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }, (_, i) => <BookCardSkeleton key={i} />)
                : continueListening.map((book) => (
                  <BookCard key={book.id} book={{ ...book, progress: Math.round(book.progress) }} showProgress size="fluid" />
                ))}
            </div>
          </section>
        )}

        {/* The whole shelf */}
        <section aria-labelledby="shelf-title">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="shelf-title" className="t-h2 text-ink">{activeTab === 'all' ? 'All titles' : activeLabel}</h2>
            <p className="text-[0.8125rem] text-ink-3 tabular">{filteredBooks.length} {filteredBooks.length === 1 ? 'title' : 'titles'}</p>
          </div>
          <BookGrid
            className="mt-2"
            books={filteredBooks}
            loading={loading}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={true}
            emptyMessage={activeTab === 'wishlist' ? 'Your wishlist is empty' : `No ${activeTab === 'all' ? 'titles' : activeTab} in your library yet`}
            emptyAction={() => navigate('/browse')}
            emptyActionLabel="Browse the catalogue"
          />
        </section>
      </div>
    </div>
  );
};

export default Library;
