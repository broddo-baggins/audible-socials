import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, Input, EmptyState, Button } from '../components/ui';
import BookCard from '../components/books/BookCard';
import booksData from '../data/books.json';
import { fetchGoogleImagesCover } from '../utils/googleImages';

/**
 * Discover: the whole catalogue as a wall of covers, narrowed by a word and a genre.
 * Genre chips are real toggle buttons; the selected one gets the highlighter.
 */
const PAGE = 48;

export default function Discover() {
  const [bookCovers, setBookCovers] = useState({});
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const books = booksData;

  const genres = useMemo(() => {
    const counts = {};
    booksData.forEach((b) => { counts[b.genre] = (counts[b.genre] || 0) + 1; });
    return Object.keys(counts).sort().map((g) => ({ genre: g, count: counts[g] }));
  }, []);

  // Books without their own cover get a stand-in from the cover helper
  useEffect(() => {
    booksData.filter((book) => !book.cover).forEach(async (book) => {
      const cover = await fetchGoogleImagesCover(book.id, book.coverQuery, book.genre);
      setBookCovers((prev) => ({ ...prev, [book.id]: cover }));
    });
  }, []);

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.toLowerCase();
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    const matchesSearch = book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
    return matchesGenre && matchesSearch;
  });

  const chooseGenre = (g) => { setSelectedGenre(g); setShown(PAGE); };
  const clearAll = () => { setSearchQuery(''); setSelectedGenre('all'); setShown(PAGE); };

  const chip = (selected) => `inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium ${selected ? 'bg-hl text-ink' : 'border border-line-strong text-ink hover:bg-surface'}`;

  return (
    <div className="page pb-16">
      <PageHeader
        title="Discover your next listen"
        description={`${booksData.length} audiobooks, originals and podcasts across ${genres.length} genres.`}
      >
        <Input
          type="search"
          label="Search by title or author"
          placeholder="For example, Andy Weir"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setShown(PAGE); }}
          leftIcon={<Search className="h-5 w-5" strokeWidth={1.75} />}
          containerClassName="max-w-xl"
          fullWidth
        />
      </PageHeader>

      {/* Genres */}
      <div role="group" aria-label="Genre" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide md:mx-0 md:flex-wrap md:px-0">
        <button type="button" aria-pressed={selectedGenre === 'all'} onClick={() => chooseGenre('all')} className={chip(selectedGenre === 'all')}>
          All genres
        </button>
        {genres.map(({ genre, count }) => (
          <button key={genre} type="button" aria-pressed={selectedGenre === genre} onClick={() => chooseGenre(genre)} className={chip(selectedGenre === genre)}>
            {genre}
            <span className={`tabular ${selectedGenre === genre ? 'text-ink-2' : 'text-ink-3'}`}>{count}</span>
          </button>
        ))}
      </div>

      <section aria-labelledby="discover-results" className="mt-8 border-t border-line pt-6">
        <h2 id="discover-results" className="text-[0.9375rem] text-ink-2" aria-live="polite">
          Showing <span className="font-semibold text-ink tabular">{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'title' : 'titles'}
          {selectedGenre !== 'all' && <> in {selectedGenre}</>}
          {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
        </h2>

        {filteredBooks.length === 0 ? (
          <EmptyState
            className="mt-6"
            icon={Search}
            title="No titles match"
            description="Try a shorter search, or a different genre."
            action="Clear filters"
            onAction={clearAll}
          />
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 md:gap-x-6 lg:grid-cols-5 xl:grid-cols-6">
              {filteredBooks.slice(0, shown).map((book) => (
                <BookCard key={book.id} book={{ ...book, cover: book.cover || bookCovers[book.id] }} size="fluid" />
              ))}
            </div>
            {shown < filteredBooks.length && (
              <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>Show more</Button>
                <span className="text-sm text-ink-3 tabular">{Math.min(shown, filteredBooks.length)} of {filteredBooks.length}</span>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
