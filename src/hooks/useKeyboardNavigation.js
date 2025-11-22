import { useEffect, useRef, useCallback } from 'react';

/**
 * useKeyboardNavigation Hook
 * Provides keyboard navigation for lists and grids
 */
export function useKeyboardNavigation(options = {}) {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true,
    loop = true
  } = options;

  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Enter':
          if (onEnter) {
            e.preventDefault();
            onEnter(e);
          }
          break;
        case 'Escape':
          if (onEscape) {
            e.preventDefault();
            onEscape(e);
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            e.preventDefault();
            onArrowUp(e);
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            e.preventDefault();
            onArrowDown(e);
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            e.preventDefault();
            onArrowLeft(e);
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            e.preventDefault();
            onArrowRight(e);
          }
          break;
        default:
          break;
      }
    };

    const container = containerRef.current;
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return containerRef;
}

/**
 * useListNavigation Hook
 * Manages keyboard navigation for vertical lists
 */
export function useListNavigation(items, options = {}) {
  const {
    onSelect,
    initialIndex = 0,
    loop = true,
    enabled = true
  } = options;

  const currentIndexRef = useRef(initialIndex);
  const itemsRef = useRef([]);

  const focusItem = useCallback((index) => {
    if (itemsRef.current[index]) {
      itemsRef.current[index].focus();
      currentIndexRef.current = index;
    }
  }, []);

  const handleArrowDown = useCallback(() => {
    const nextIndex = currentIndexRef.current + 1;
    if (nextIndex < items.length) {
      focusItem(nextIndex);
    } else if (loop) {
      focusItem(0);
    }
  }, [items.length, loop, focusItem]);

  const handleArrowUp = useCallback(() => {
    const prevIndex = currentIndexRef.current - 1;
    if (prevIndex >= 0) {
      focusItem(prevIndex);
    } else if (loop) {
      focusItem(items.length - 1);
    }
  }, [items.length, loop, focusItem]);

  const handleEnter = useCallback(() => {
    if (onSelect) {
      onSelect(items[currentIndexRef.current], currentIndexRef.current);
    }
  }, [items, onSelect]);

  const containerRef = useKeyboardNavigation({
    onArrowDown: handleArrowDown,
    onArrowUp: handleArrowUp,
    onEnter: handleEnter,
    enabled
  });

  const getItemProps = useCallback((index) => ({
    ref: (el) => {
      itemsRef.current[index] = el;
    },
    tabIndex: index === currentIndexRef.current ? 0 : -1,
    onFocus: () => {
      currentIndexRef.current = index;
    }
  }), []);

  return {
    containerRef,
    getItemProps,
    focusItem
  };
}

/**
 * useGridNavigation Hook
 * Manages keyboard navigation for 2D grids
 */
export function useGridNavigation(rows, columns, options = {}) {
  const {
    onSelect,
    initialRow = 0,
    initialColumn = 0,
    loop = false,
    enabled = true
  } = options;

  const currentPositionRef = useRef({ row: initialRow, column: initialColumn });
  const cellsRef = useRef({});

  const focusCell = useCallback((row, column) => {
    const key = `${row}-${column}`;
    if (cellsRef.current[key]) {
      cellsRef.current[key].focus();
      currentPositionRef.current = { row, column };
    }
  }, []);

  const handleArrowDown = useCallback(() => {
    const { row, column } = currentPositionRef.current;
    const nextRow = row + 1;
    if (nextRow < rows) {
      focusCell(nextRow, column);
    } else if (loop) {
      focusCell(0, column);
    }
  }, [rows, loop, focusCell]);

  const handleArrowUp = useCallback(() => {
    const { row, column } = currentPositionRef.current;
    const prevRow = row - 1;
    if (prevRow >= 0) {
      focusCell(prevRow, column);
    } else if (loop) {
      focusCell(rows - 1, column);
    }
  }, [rows, loop, focusCell]);

  const handleArrowRight = useCallback(() => {
    const { row, column } = currentPositionRef.current;
    const nextColumn = column + 1;
    if (nextColumn < columns) {
      focusCell(row, nextColumn);
    } else if (loop) {
      focusCell(row, 0);
    }
  }, [columns, loop, focusCell]);

  const handleArrowLeft = useCallback(() => {
    const { row, column } = currentPositionRef.current;
    const prevColumn = column - 1;
    if (prevColumn >= 0) {
      focusCell(row, prevColumn);
    } else if (loop) {
      focusCell(row, columns - 1);
    }
  }, [columns, loop, focusCell]);

  const handleEnter = useCallback(() => {
    if (onSelect) {
      const { row, column } = currentPositionRef.current;
      onSelect(row, column);
    }
  }, [onSelect]);

  const containerRef = useKeyboardNavigation({
    onArrowDown: handleArrowDown,
    onArrowUp: handleArrowUp,
    onArrowLeft: handleArrowLeft,
    onArrowRight: handleArrowRight,
    onEnter: handleEnter,
    enabled
  });

  const getCellProps = useCallback((row, column) => {
    const key = `${row}-${column}`;
    const isCurrent = currentPositionRef.current.row === row && 
                     currentPositionRef.current.column === column;
    
    return {
      ref: (el) => {
        cellsRef.current[key] = el;
      },
      tabIndex: isCurrent ? 0 : -1,
      onFocus: () => {
        currentPositionRef.current = { row, column };
      }
    };
  }, []);

  return {
    containerRef,
    getCellProps,
    focusCell
  };
}

/**
 * useShortcuts Hook
 * Manages keyboard shortcuts
 */
export function useShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const modifiers = {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey
      };

      Object.entries(shortcuts).forEach(([combo, handler]) => {
        const parts = combo.toLowerCase().split('+');
        const targetKey = parts[parts.length - 1];
        const requiredModifiers = parts.slice(0, -1);

        const modifiersMatch = requiredModifiers.every(mod => modifiers[mod]);
        const keyMatches = key === targetKey;

        if (modifiersMatch && keyMatches) {
          e.preventDefault();
          handler(e);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * useFocusTrap Hook
 * Traps focus within a container (for modals/dialogs)
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Store previously focused element
    const previouslyFocused = document.activeElement;

    // Focus first element
    firstFocusable?.focus();

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

/**
 * useSkipLink Hook
 * Provides skip-to-content functionality
 */
export function useSkipLink(targetId) {
  const handleSkip = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId]);

  return handleSkip;
}

export default {
  useKeyboardNavigation,
  useListNavigation,
  useGridNavigation,
  useShortcuts,
  useFocusTrap,
  useSkipLink
};

