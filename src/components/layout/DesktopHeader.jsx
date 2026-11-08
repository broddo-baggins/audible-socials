/**
 * AppHeader (file kept as DesktopHeader for its importers): the one header at every width.
 *
 * - lg and up: wordmark, the primary nav, search, notifications, credits, account menu.
 * - below lg: wordmark, search, notifications and a menu button that opens every destination,
 *   so nothing the old desktop and tablet headers linked to is out of reach.
 * The active page is marked with a highlighter bar under its label.
 */
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { getUserData, signOut } from '../../utils/localStorage';
import { getUnreadCount } from '../../utils/notifications';
import NotificationCenter from '../notifications/NotificationCenter';
import ConceptBadge from '../ui/ConceptBadge';
import Logo from '../ui/Logo';

const primaryNav = [
  { label: 'Home', path: '/' },
  { label: 'Browse', path: '/browse' },
  { label: 'Library', path: '/library' },
  { label: 'Clubs', path: '/clubs' },
  { label: 'Social', path: '/social' },
  { label: 'Battles', path: '/battles' },
  { label: 'Idle game', path: '/idle' },
];

const moreNav = [
  { label: 'Originals', path: '/originals' },
  { label: 'Podcasts', path: '/podcasts' },
  { label: 'Discover', path: '/discover' },
  { label: 'Search', path: '/search' },
  { label: 'Profile', path: '/profile' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Account', path: '/account' },
];

const userMenuItems = [
  { label: 'Profile', path: '/profile', icon: UserCircle },
  { label: 'Account', path: '/account', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: HelpCircle },
];

const iconButton = 'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink';

// The signed-in reader as the header shows them, read from stored user data.
const readUser = () => {
  const data = getUserData();
  return { name: data?.name || 'You', email: data?.email, credits: data?.credits ?? 0, avatar: data?.avatar };
};

const DesktopHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unread, setUnread] = useState(getUnreadCount);
  const [user, setUser] = useState(readUser);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setUnread(getUnreadCount()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onDown = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') { setShowUserMenu(false); setMenuOpen(false); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  // While the menu sheet is open: lock page scroll and keep Tab inside it
  const sheetRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onTab = (event) => {
      if (event.key !== 'Tab' || !sheetRef.current) return;
      const items = sheetRef.current.querySelectorAll('a[href], button:not(:disabled)');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onTab);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onTab); };
  }, [menuOpen]);

  // Close the sheet and the account menu on navigation (adjusting state during render)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setMenuOpen(false);
    setShowUserMenu(false);
    setUser(readUser()); // credits may have been spent on the page we left
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    setUser(readUser());
    navigate('/');
  };

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <nav className="page flex h-16 items-center gap-6" aria-label="Main">
        <Link to="/" className="shrink-0 rounded-md" aria-label="Listenable home">
          <Logo />
        </Link>

        <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
          {primaryNav.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={`relative inline-flex h-10 items-center whitespace-nowrap rounded-full px-3 text-[0.9375rem] font-medium ${
                  isActive(item.path) ? 'text-ink' : 'text-ink-2 hover:text-ink hover:bg-surface-sunk'
                }`}
              >
                {item.label}
                {isActive(item.path) && <span className="absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <form onSubmit={handleSearch} role="search" className="hidden xl:block">
            <label htmlFor="header-search" className="sr-only">Search books, authors and narrators</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
              <input
                id="header-search"
                type="search"
                placeholder="Search titles, authors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-60 rounded-full border border-line-strong bg-surface pl-10 pr-4 text-sm text-ink focus:border-ink focus:outline-none focus:shadow-[0_0_0_3px_var(--hl)]"
              />
            </div>
          </form>
          <Link to="/search" className={`${iconButton} xl:hidden`} aria-label="Search">
            <Search className="h-5 w-5" strokeWidth={1.75} />
          </Link>

          <button type="button" onClick={() => setNotificationsOpen(true)} className={iconButton} aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}>
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 min-w-[18px] rounded-full bg-hl px-1 text-center text-[0.6875rem] font-semibold leading-[18px] text-ink ring-2 ring-paper tabular">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <Link to="/account" className="hidden md:inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-ink-2 hover:border-line-strong" title="Credits you can spend on any title">
            <span className="font-semibold text-ink tabular">{user.credits}</span> credit{user.credits === 1 ? '' : 's'}
          </Link>

          <div className="relative hidden lg:block" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex h-10 items-center gap-1 rounded-full pl-1 pr-2 hover:bg-surface-sunk"
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
              aria-label="Account menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper">
                {user.name.charAt(0)}
              </span>
              <ChevronDown className={`h-4 w-4 text-ink-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {showUserMenu && (
              <div role="menu" className="absolute right-0 mt-2 w-60 rounded-lg border border-line bg-surface py-1 shadow-md">
                <div className="border-b border-line px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{user.name}</p>
                  {user.email && <p className="text-[0.8125rem] text-ink-3">{user.email}</p>}
                </div>
                <div className="py-1">
                  {userMenuItems.map((item) => (
                    <Link key={item.path} to={item.path} role="menuitem" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-paper">
                      <item.icon className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-line py-1">
                  <button type="button" role="menuitem" onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-paper">
                    <LogOut className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setMenuOpen(true)} className={`${iconButton} lg:hidden`} aria-label="Open menu" aria-expanded={menuOpen}>
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div ref={sheetRef} className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-paper shadow-md">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} className={iconButton} aria-label="Close menu" autoFocus>
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <ul>
                {primaryNav.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className={`flex h-12 items-center rounded-lg px-3 font-serif text-xl ${isActive(item.path) ? 'bg-hl text-ink' : 'text-ink hover:bg-surface-sunk'}`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 border-t border-line pt-4">
                {moreNav.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="flex h-11 items-center rounded-lg px-3 text-[0.9375rem] text-ink-2 hover:bg-surface-sunk hover:text-ink">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line px-5 py-4 text-sm text-ink-2">
              <span className="font-semibold text-ink tabular">{user.credits}</span> credit{user.credits === 1 ? '' : 's'} to spend
              <ConceptBadge className="mt-3" />
            </div>
          </div>
        </div>
      )}

      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => { setNotificationsOpen(false); setUnread(getUnreadCount()); }}
      />
    </header>
  );
};

export default DesktopHeader;
