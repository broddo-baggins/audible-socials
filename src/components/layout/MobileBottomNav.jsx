import { Home, Library, Compass, Search, User, Users, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Library', path: '/library', icon: Library },
    { label: 'Social', path: '/social', icon: Users },
    { label: 'Idle', path: '/idle', icon: Zap },
    { label: 'Profile', path: '/account', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-audible-gray-200 safe-bottom shadow-lg"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[64px] transition-colors ${
                  active
                    ? 'text-audible-orange'
                    : 'text-audible-gray-600 hover:text-audible-text-primary'
                }`}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.1 : 1,
                      color: active ? '#FF6B35' : undefined
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon
                      className={`w-6 h-6 ${active ? 'fill-current' : ''}`}
                      strokeWidth={active ? 2 : 1.5}
                    />
                  </motion.div>
                  <motion.span
                    className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}
                    animate={{ scale: active ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
