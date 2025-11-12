import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Globe, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Input } from '../ui';

const DesktopHeader = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/browse' },
    { label: 'Library', path: '/library' },
    { label: 'Originals', path: '/originals' },
    { label: 'Podcasts', path: '/podcasts' },
  ];
  
  const userMenuItems = [
    { label: 'Account', path: '/account', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help', path: '/help', icon: HelpCircle },
  ];
  
  // Mock user data - replace with actual user context
  const user = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: null,
    credits: 2,
  };
  
  const notifications = []; // Replace with actual notifications
  const hasNotifications = notifications.length > 0;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header 
      className={`sticky top-0 z-50 bg-echo-cream transition-all duration-250 ${
        scrolled ? 'shadow-header' : ''
      }`}
    >
      <nav className="max-w-9xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 text-2xl font-bold text-echo-text-primary hover:text-echo-orange transition-colors"
          >
            EchoRead
          </Link>
          
          {/* Main Navigation */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors relative ${
                  isActive(item.path)
                    ? 'text-echo-orange'
                    : 'text-echo-text-primary hover:text-echo-orange'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-echo-orange" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-64">
              <Input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                className="text-sm"
              />
            </form>
            
            {/* Credits Badge */}
            <div className="px-3 py-1.5 bg-echo-orange/10 text-echo-orange rounded-lg font-medium text-sm">
              {user.credits} {user.credits === 1 ? 'Credit' : 'Credits'}
            </div>
            
            {/* Language Selector */}
            <button
              className="p-2 text-echo-text-secondary hover:text-echo-orange hover:bg-echo-beige rounded-lg transition-colors"
              aria-label="Language selector"
            >
              <Globe className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-echo-text-secondary hover:text-echo-orange hover:bg-echo-beige rounded-lg transition-colors"
              aria-label={`Notifications${hasNotifications ? ' (unread)' : ''}`}
            >
              <Bell className="w-5 h-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-echo-error rounded-full" />
              )}
            </Link>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-echo-beige rounded-lg transition-colors"
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <div className="w-8 h-8 rounded-full bg-echo-orange flex items-center justify-center text-white font-medium">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-echo-text-secondary transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-echo-border overflow-hidden animate-slide-down">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-echo-divider">
                    <p className="font-semibold text-echo-text-primary">{user.name}</p>
                    <p className="text-sm text-echo-text-secondary">{user.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-echo-text-primary hover:bg-echo-beige transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <item.icon className="w-5 h-5 text-echo-text-secondary" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Sign Out */}
                  <div className="border-t border-echo-divider py-2">
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-echo-text-primary hover:bg-echo-beige transition-colors"
                      onClick={() => {
                        // Sign out functionality
                        setShowUserMenu(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 text-echo-text-secondary" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DesktopHeader;
