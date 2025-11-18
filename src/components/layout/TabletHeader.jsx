import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import { getUserData } from '../../utils/localStorage';
import { getUnreadCount } from '../../utils/notifications';
import NotificationCenter from '../notifications/NotificationCenter';

export default function TabletHeader() {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  React.useEffect(() => {
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

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/library', label: 'Library' },
    { path: '/discover', label: 'Discover' },
    { path: '/battles', label: 'Battles' },
    { path: '/clubs', label: 'Socials' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm tablet:block hidden lg:hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-audible-orange font-bold text-xl font-serif">
              audible
            </div>
          </Link>

          {/* Tablet Navigation - Compact */}
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-audible-orange'
                    : 'text-gray-700 hover:text-audible-orange'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions - Compact for Tablet */}
          <div className="flex items-center space-x-3">
            {/* Search Icon */}
            <button className="p-2 text-gray-700 hover:text-audible-orange transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Credits Display */}
            {userData && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-audible-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
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
