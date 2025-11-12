import { Home, Library, Compass, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Library', path: '/library', icon: Library },
    { label: 'Discover', path: '/browse', icon: Compass },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Profile', path: '/account', icon: User },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-echo-border safe-bottom">
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
                  ? 'text-echo-orange'
                  : 'text-echo-text-secondary active:bg-echo-beige'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon 
                className={`w-6 h-6 ${active ? 'fill-current' : ''}`}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
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
