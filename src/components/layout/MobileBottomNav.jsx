import { Home, Library, Compass, Users, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * MobileBottomNav: five destinations under the thumb, below 768 px only.
 * The active one sits on a highlighter pill; everything else is in the header's menu.
 */
const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Browse', path: '/browse', icon: Compass },
  { label: 'Library', path: '/library', icon: Library },
  { label: 'Social', path: '/social', icon: Users },
  { label: 'You', path: '/account', icon: User },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-paper safe-bottom" aria-label="Primary">
      <ul className="grid grid-cols-5 px-1 pt-1.5 pb-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <li key={path}>
              <Link
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-lg py-1 text-[0.6875rem] font-medium ${active ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}
              >
                <span className={`flex h-7 w-12 items-center justify-center rounded-full ${active ? 'bg-hl' : ''}`}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
