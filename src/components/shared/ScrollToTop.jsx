/**
 * ScrollToTop: a small outlined button that appears once the reader is
 * 300 px down. Visibility comes from an IntersectionObserver on a sentinel,
 * not a scroll listener. Sits above the assistant launcher.
 */

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:300px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(sentinel);
    return () => { io.disconnect(); sentinel.remove(); };
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-40 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface text-ink shadow-sm hover:bg-paper md:right-6"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
};

export default ScrollToTop;
