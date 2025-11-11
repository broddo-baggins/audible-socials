import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star } from 'lucide-react';
import booksData from '../data/books.json';
import { getUserData } from '../utils/localStorage';
import { fetchGoogleImagesCover } from '../utils/googleImages';

export default function Library() {
  const [userData, setUserData] = useState(null);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [bookCovers, setBookCovers] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const user = getUserData();
    setUserData(user);
    
    // Get user's library books
    const books = booksData.filter(book => user.library.includes(book.id));
    setLibraryBooks(books);

    // Load book covers
    books.forEach(async (book) => {
      const cover = await fetchGoogleImagesCover(book.id, book.coverQuery, book.genre);
      setBookCovers(prev => ({ ...prev, [book.id]: cover }));
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const filteredBooks = activeTab === 'all'
    ? libraryBooks
    : activeTab === 'reading'
    ? libraryBooks.filter(book => book.id === userData?.currentlyReading)
    : libraryBooks.filter(book => userData?.ratings[book.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <BookOpen className="w-10 h-10 mr-3 text-audible-orange" />
            My Library
          </h1>
          <p className="text-gray-600">
            {libraryBooks.length} {libraryBooks.length === 1 ? 'audiobook' : 'audiobooks'} in your collection
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Audiobooks
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'reading'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Currently Reading
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'finished'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Finished
            </button>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'reading' ? "You're not currently reading any books." : "You haven't finished any books yet."}
            </p>
            <Link
              to="/discover"
              className="inline-block bg-audible-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors"
            >
              Discover Books
            </Link>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {filteredBooks.map((book) => (
              <motion.div key={book.id} variants={item}>
                <Link to={`/book/${book.id}`} className="group">
                  <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                    <img
                      src={bookCovers[book.id] || 'https://via.placeholder.com/300x450'}
                      alt={book.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Reading Badge */}
                    {book.id === userData?.currentlyReading && (
                      <div className="absolute top-2 left-2 bg-audible-orange text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Reading
                      </div>
                    )}
                    
                    {/* Rating */}
                    {userData?.ratings[book.id] && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {userData.ratings[book.id]}
                      </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white rounded-full p-4">
                        <svg className="w-8 h-8 text-audible-orange" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">{book.duration}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

