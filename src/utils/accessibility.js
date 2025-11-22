/**
 * Accessibility Utilities
 * Tools for auditing and improving accessibility
 */

/**
 * Check if an element has proper ARIA labels
 * @param {HTMLElement} element - Element to check
 * @returns {Object} Audit result
 */
export function auditAriaLabels(element) {
  const issues = [];
  const warnings = [];

  // Check for interactive elements without labels
  const interactiveSelectors = 'button, a, input, select, textarea, [role="button"], [role="link"]';
  const interactiveElements = element.querySelectorAll(interactiveSelectors);

  interactiveElements.forEach((el) => {
    const hasLabel = el.getAttribute('aria-label') ||
                     el.getAttribute('aria-labelledby') ||
                     el.textContent.trim() ||
                     el.querySelector('img[alt]');

    if (!hasLabel) {
      issues.push({
        element: el,
        type: 'missing-label',
        message: `${el.tagName} element missing accessible label`,
        severity: 'error'
      });
    }
  });

  // Check for images without alt text
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        element: img,
        type: 'missing-alt',
        message: 'Image missing alt attribute',
        severity: 'error'
      });
    }
  });

  // Check for form inputs without labels
  const inputs = element.querySelectorAll('input:not([type="hidden"]), select, textarea');
  inputs.forEach((input) => {
    const hasLabel = input.getAttribute('aria-label') ||
                     input.getAttribute('aria-labelledby') ||
                     element.querySelector(`label[for="${input.id}"]`);

    if (!hasLabel) {
      warnings.push({
        element: input,
        type: 'input-without-label',
        message: 'Form input without associated label',
        severity: 'warning'
      });
    }
  });

  return {
    passed: issues.length === 0,
    issues,
    warnings,
    score: calculateAccessibilityScore(issues, warnings)
  };
}

/**
 * Check color contrast ratios
 * @param {string} foreground - Foreground color (hex or rgb)
 * @param {string} background - Background color (hex or rgb)
 * @returns {Object} Contrast information
 */
export function checkColorContrast(foreground, background) {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: ratio.toFixed(2),
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    passesAALarge: ratio >= 3,
    passesAAALarge: ratio >= 4.5
  };
}

/**
 * Get relative luminance of a color
 * @param {string} color - Color in hex or rgb format
 * @returns {number} Relative luminance
 */
function getRelativeLuminance(color) {
  const rgb = parseColor(color);
  const [r, g, b] = rgb.map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse color string to RGB array
 * @param {string} color - Color string
 * @returns {Array<number>} RGB values
 */
function parseColor(color) {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16)
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  // Handle rgb/rgba colors
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }

  return [0, 0, 0];
}

/**
 * Calculate overall accessibility score
 * @param {Array} issues - Array of issues
 * @param {Array} warnings - Array of warnings
 * @returns {number} Score from 0-100
 */
function calculateAccessibilityScore(issues, warnings) {
  const errorWeight = 10;
  const warningWeight = 2;
  
  const deductions = (issues.length * errorWeight) + (warnings.length * warningWeight);
  return Math.max(0, 100 - deductions);
}

/**
 * Check keyboard navigation
 * @param {HTMLElement} element - Root element to check
 * @returns {Object} Navigation audit results
 */
export function auditKeyboardNavigation(element) {
  const issues = [];
  
  // Check for elements with click handlers but no keyboard support
  const clickableElements = element.querySelectorAll('[onclick], [data-click]');
  clickableElements.forEach((el) => {
    const isButton = el.tagName === 'BUTTON';
    const isLink = el.tagName === 'A';
    const hasTabIndex = el.hasAttribute('tabindex');
    const hasRole = el.hasAttribute('role');

    if (!isButton && !isLink && !hasTabIndex && !hasRole) {
      issues.push({
        element: el,
        type: 'keyboard-inaccessible',
        message: 'Clickable element not keyboard accessible',
        severity: 'error'
      });
    }
  });

  // Check for positive tabindex values (anti-pattern)
  const positiveTabIndex = element.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
  positiveTabIndex.forEach((el) => {
    const tabIndex = parseInt(el.getAttribute('tabindex'));
    if (tabIndex > 0) {
      issues.push({
        element: el,
        type: 'positive-tabindex',
        message: 'Positive tabindex disrupts natural tab order',
        severity: 'warning'
      });
    }
  });

  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Check heading hierarchy
 * @param {HTMLElement} element - Root element to check
 * @returns {Object} Heading audit results
 */
export function auditHeadingHierarchy(element) {
  const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const issues = [];
  
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);
    
    // Check for skipped levels
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        element: heading,
        type: 'skipped-heading-level',
        message: `Heading level skipped from h${previousLevel} to h${level}`,
        severity: 'warning'
      });
    }
    
    // Check for multiple h1s
    if (level === 1 && index > 0 && previousLevel === 1) {
      issues.push({
        element: heading,
        type: 'multiple-h1',
        message: 'Multiple h1 elements found',
        severity: 'warning'
      });
    }
    
    previousLevel = level;
  });

  return {
    passed: issues.length === 0,
    issues,
    headingCount: headings.length
  };
}

/**
 * Run comprehensive accessibility audit
 * @param {HTMLElement} element - Root element to audit
 * @returns {Object} Complete audit results
 */
export function runAccessibilityAudit(element = document.body) {
  const ariaAudit = auditAriaLabels(element);
  const keyboardAudit = auditKeyboardNavigation(element);
  const headingAudit = auditHeadingHierarchy(element);

  const allIssues = [
    ...ariaAudit.issues,
    ...ariaAudit.warnings,
    ...keyboardAudit.issues,
    ...headingAudit.issues
  ];

  return {
    score: ariaAudit.score,
    passed: allIssues.length === 0,
    totalIssues: allIssues.length,
    audits: {
      aria: ariaAudit,
      keyboard: keyboardAudit,
      headings: headingAudit
    },
    summary: {
      errors: allIssues.filter(i => i.severity === 'error').length,
      warnings: allIssues.filter(i => i.severity === 'warning').length
    }
  };
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus trap for modals and dialogs
 * @param {HTMLElement} element - Container element
 * @returns {Function} Cleanup function
 */
export function createFocusTrap(element) {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

export default {
  auditAriaLabels,
  checkColorContrast,
  auditKeyboardNavigation,
  auditHeadingHierarchy,
  runAccessibilityAudit,
  announceToScreenReader,
  createFocusTrap
};

