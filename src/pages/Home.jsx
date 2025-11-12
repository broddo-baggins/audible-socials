import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Users, Star } from 'lucide-react';
import booksData from '../data/books.json';
import clubsData from '../data/clubs.json';
import { getUserData } from '../utils/localStorage';
import { fetchGoogleImagesCover } from '../utils/googleImages';
import FriendRecommendations from '../components/social/FriendRecommendations';
import SocialNudges from '../components/social/SocialNudges';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [bookCovers, setBookCovers] = useState({});

  useEffect(() => {
    setUserData(getUserData());
    
    // Featured books - top rated
    const featured = booksData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    setFeaturedBooks(featured);

    // Featured clubs - most popular
    const topClubs = clubsData
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 3);
    setFeaturedClubs(topClubs);

    // Load book covers
    featured.forEach(async (book) => {
      const cover = await fetchGoogleImagesCover(book.id, book.coverQuery, book.genre);
      setBookCovers(prev => ({ ...prev, [book.id]: cover }));
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-audible-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-audible-orange to-audible-orange-dark text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
              Welcome back{userData?.name !== 'You' ? `, ${userData?.name}` : ''}!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Continue your journey or discover something new
            </p>
            
            {userData?.currentlyReading && (
              <Link
                to={`/book/${userData.currentlyReading}`}
                className="inline-flex items-center space-x-2 bg-white text-audible-orange px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Continue Listening</span>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-2 text-audible-orange" />
            Featured Book Clubs
          </h2>
          <Link
            to="/clubs"
            className="text-audible-orange font-semibold hover:text-audible-orange-light transition-colors"
          >
            View All
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featuredClubs.map((club) => (
            <motion.div key={club.id} variants={item}>
              <Link to={`/club/${club.id}`}>
                <div className="bg-white rounded-xl hover:bg-gray-50 transition-all p-6 border-2 border-gray-200 hover:border-audible-orange shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                    {club.isPremium && (
                      <span className="bg-audible-gold text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Hosted by <span className="font-semibold text-gray-900">{club.host}</span>
                    </span>
                    <span className="text-audible-orange font-semibold">
                      {club.memberCount.toLocaleString()} members
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-600">
                      {club.daysRemaining} days left • {club.meetingsPerMonth} meetings/month
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Social Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SocialNudges />
          <FriendRecommendations />
        </div>
      </section>

      {/* Trending Books */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 rounded-xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-8 h-8 mr-2 text-audible-orange" />
            Trending Now
          </h2>
          <Link
            to="/discover"
            className="text-audible-orange font-semibold hover:text-audible-orange-light transition-colors"
          >
            Explore More
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {featuredBooks.map((book) => (
            <motion.div key={book.id} variants={item}>
              <Link to={`/book/${book.id}`} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                  <img
                    src={bookCovers[book.id] || 'https://via.placeholder.com/300x450'}
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {book.rating}
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600">{book.author}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Personalized Recommendations */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Because You Listened To...
        </h2>
        
        <div className="bg-gradient-to-r from-audible-orange to-audible-orange-dark rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Discover Your Next Favorite
          </h3>
          <p className="mb-6 text-white/90">
            Join a book club and never wonder what to listen to next. Connect with readers who share your taste.
          </p>
          <Link
            to="/clubs"
            className="inline-block bg-white text-audible-orange px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Book Clubs
          </Link>
        </div>
      </section>
    </div>
  );
}

