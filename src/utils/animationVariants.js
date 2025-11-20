/**
 * Animation Variants - Centralized Animation Configurations
 *
 * This file contains reusable animation variants used throughout the application
 * for consistent, smooth animations using Framer Motion. All animations are
 * optimized for performance and follow a cohesive design language.
 *
 * Usage:
 * - interactiveVariants: For buttons, links, and interactive elements
 * - cardHoverVariants: For card hover effects with elevation
 * - pageVariants + pageTransition: For route transitions between pages
 */

/**
 * Interactive Element Variants
 * Used for buttons, links, and other clickable elements.
 * Provides subtle scale and position animations for better UX.
 */
export const interactiveVariants = {
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  },
  initial: {
    scale: 1,
    y: 0
  }
};

/**
 * Card Hover Variants
 * Used for book cards and other card components.
 * Includes elevation shadow changes for depth perception.
 */
export const cardHoverVariants = {
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  initial: {
    y: 0,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
  }
};

/**
 * Page Transition Variants
 * Used with AnimatePresence for smooth route transitions.
 * Provides fade, slide, and scale effects for page changes.
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

/**
 * Page Transition Configuration
 * Tween animation with anticipate easing for smooth, natural transitions.
 * Duration is optimized for perceived performance.
 */
export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};
