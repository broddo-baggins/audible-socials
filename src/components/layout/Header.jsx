import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserData } from '../../utils/localStorage';
import { getUnreadCount } from '../../utils/notifications';
import NotificationCenter from '../notifications/NotificationCenter';

export default function Header() {
  const location = useLocation();
  const [showClubsDropdown, setShowClubsDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    setUserData(getUserData());
    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateUnreadCount = () => {
    setUnreadCount(getUnreadCount());
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-audible-orange font-bold text-2xl font-serif">
              audible
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-audible-orange'
                  : 'text-gray-700 hover:text-audible-orange'
              }`}
            >
              Home
            </Link>
            <Link
              to="/library"
              className={`text-sm font-medium transition-colors ${
                isActive('/library')
                  ? 'text-audible-orange'
                  : 'text-gray-700 hover:text-audible-orange'
              }`}
            >
              Library
            </Link>
            <Link
              to="/discover"
              className={`text-sm font-medium transition-colors ${
                isActive('/discover')
                  ? 'text-audible-orange'
                  : 'text-gray-700 hover:text-audible-orange'
              }`}
            >
              Discover
            </Link>
            
            <Link
              to="/clubs"
              className={`text-sm font-medium transition-colors ${
                isActive('/clubs')
                  ? 'text-audible-orange'
                  : 'text-gray-700 hover:text-audible-orange'
              }`}
            >
              Socials
            </Link>

            <Link
              to="/profile"
              className={`text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'text-audible-orange'
                  : 'text-gray-700 hover:text-audible-orange'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-700 hover:text-audible-orange transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Credits Display */}
            {userData && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <span className="text-sm font-bold text-audible-orange">
                  {userData.credits}
                </span>
                <span className="text-xs text-gray-600">
                  {userData.credits === 1 ? 'Credit' : 'Credits'}
                </span>
              </div>
            )}

            {/* Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-gray-700 hover:text-audible-orange transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-0 right-0 w-5 h-5 bg-audible-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* Profile */}
            <Link
              to="/profile"
              className="p-2 text-gray-700 hover:text-audible-orange transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          updateUnreadCount();
        }}
      />
    </header>
  );
}

