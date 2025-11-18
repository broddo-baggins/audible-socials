import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Compass, Users, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/clubs') {
      return location.pathname.startsWith('/clubs');
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/clubs', icon: Users, label: 'My Clubs' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                isActive(item.path)
                  ? 'text-audible-orange'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
