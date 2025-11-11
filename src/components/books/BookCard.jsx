import { Link } from 'react-router-dom';
import { Star, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchGoogleImagesCover } from '../../utils/googleImages';

export default function BookCard({ book, showClubs = false, isReading = false, userRating = null }) {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    const loadCover = async () => {
      const cover = await fetchGoogleImagesCover(book.id, book.coverQuery, book.genre);
      setCoverUrl(cover);
    };
    loadCover();
  }, [book]);

  return (
    <Link to={`/book/${book.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
        <img
          src={coverUrl || 'https://via.placeholder.com/300x450'}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Reading Badge */}
        {isReading && (
          <div className="absolute top-2 left-2 bg-audible-orange text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Reading
          </div>
        )}
        
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
          {userRating || book.rating}
        </div>

        {/* Club Badge */}
        {showClubs && book.clubs && book.clubs.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {book.clubs.length} {book.clubs.length === 1 ? 'Club' : 'Clubs'}
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
  );
}

