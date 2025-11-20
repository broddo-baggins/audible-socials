/**
 * ScrollToTop Component - Floating Scroll Button
 *
 * A floating action button that appears when the user scrolls down the page,
 * providing quick navigation back to the top. Features smooth scrolling animation
 * and responsive positioning.
 *
 * Features:
 * - Appears after scrolling 300px down
 * - Smooth scroll-to-top animation
 * - Responsive positioning (bottom-right corner)
 * - Hover effects and accessibility
 * - Auto-hides when at top of page
 */

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 p-3 bg-audible-orange text-white rounded-full shadow-lg hover:bg-audible-orange-dark transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-audible-orange focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;

