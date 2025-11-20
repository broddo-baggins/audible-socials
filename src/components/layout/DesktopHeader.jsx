import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';

const DesktopHeader = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/browse' },
    { label: 'Library', path: '/library' },
    { label: 'Social', path: '/social' },
    { label: 'Idle Game', path: '/idle' },
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
    <header className="bg-white border-b border-audible-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
             {/* Logo */}
             <Link to="/" className="flex items-center">
               <img
                 src="/images/listenable-logo.svg"
                 alt="Listenable"
                 className="h-8 w-auto"
               />
             </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-audible-orange'
                    : 'text-audible-text-primary hover:text-audible-orange'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-audible-gray-400" />
                <input
                  type="search"
                  placeholder="Search Audible"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-audible-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange bg-white"
                />
              </div>
            </form>

            {/* Credits */}
            <div className="hidden md:flex items-center px-3 py-1 bg-audible-orange/10 text-audible-orange rounded text-sm font-medium">
              {user.credits} Credit{user.credits !== 1 ? 's' : ''}
            </div>

            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-audible-gray-600 hover:text-audible-orange">
              <Search className="w-5 h-5" />
            </button>

            {/* Account Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 p-2 rounded-md hover:bg-audible-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-audible-orange rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className={`w-4 h-4 text-audible-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-audible-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-audible-gray-200">
                    <p className="text-sm font-medium text-audible-text-primary">{user.name}</p>
                    <p className="text-xs text-audible-text-secondary">{user.email}</p>
                  </div>

                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-audible-text-primary hover:bg-audible-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-audible-gray-200 py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-audible-text-primary hover:bg-audible-gray-50 transition-colors">
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
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
