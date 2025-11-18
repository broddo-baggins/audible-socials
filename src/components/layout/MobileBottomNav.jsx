import { Home, Library, Compass, Search, User, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Library', path: '/library', icon: Library },
    { label: 'Socials', path: '/clubs', icon: Users },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Profile', path: '/account', icon: User },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-audible-gray-200 safe-bottom shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[64px] transition-colors ${
                active
                  ? 'text-audible-orange'
                  : 'text-audible-gray-600 hover:text-audible-text-primary'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={`w-6 h-6 ${active ? 'fill-current' : ''}`}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
