/**
 * Test Utilities
 * Provides helper functions and utilities for testing React components
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from '../contexts/PlayerContext';
import PropTypes from 'prop-types';

/**
 * Custom render function that includes common providers
 * @param {React.Component} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result
 */
export function renderWithProviders(ui, options = {}) {
  const {
    initialPlayerState = {},
    route = '/',
    ...renderOptions
  } = options;

  // Set initial route
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <PlayerProvider initialState={initialPlayerState}>
          {children}
        </PlayerProvider>
      </BrowserRouter>
    );
  }

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mock book data for testing
 */
export const mockBook = {
  id: 'test-book-1',
  title: 'Test Book',
  author: 'Test Author',
  narrator: 'Test Narrator',
  duration: '5h 30m',
  rating: 4.5,
  coverImage: '/test-cover.jpg',
  description: 'A test book description',
  genres: ['Fiction', 'Mystery'],
  releaseDate: '2023-01-01',
  language: 'English'
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: '/test-avatar.png',
  memberSince: '2023-01-01',
  booksRead: 42,
  hoursListened: 150
};

/**
 * Mock club data for testing
 */
export const mockClub = {
  id: 'test-club-1',
  name: 'Test Book Club',
  description: 'A test book club',
  memberCount: 25,
  currentBook: mockBook,
  host: mockUser,
  nextMeeting: '2024-01-15T19:00:00Z'
};

/**
 * Wait for async operations to complete
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock localStorage for testing
 */
export class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

/**
 * Setup localStorage mock
 */
export function setupLocalStorageMock() {
  const mockLocalStorage = new MockLocalStorage();
  global.localStorage = mockLocalStorage;
  return mockLocalStorage;
}

/**
 * Mock IntersectionObserver for testing
 */
export class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  trigger(entries) {
    this.callback(entries, this);
  }
}

/**
 * Setup IntersectionObserver mock
 */
export function setupIntersectionObserverMock() {
  global.IntersectionObserver = MockIntersectionObserver;
}

/**
 * Mock fetch for API testing
 * @param {Object} response - Mock response data
 * @param {number} status - HTTP status code
 * @returns {Function} Mock fetch function
 */
export function mockFetch(response, status = 200) {
  return jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    })
  );
}

/**
 * Create mock event
 * @param {string} type - Event type
 * @param {Object} properties - Event properties
 * @returns {Event} Mock event
 */
export function createMockEvent(type, properties = {}) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, properties);
  return event;
}

/**
 * Mock audio element for player testing
 */
export class MockAudio {
  constructor() {
    this.src = '';
    this.currentTime = 0;
    this.duration = 300;
    this.paused = true;
    this.volume = 1;
    this.playbackRate = 1;
    this.ended = false;
    this.listeners = {};
  }

  play() {
    this.paused = false;
    this.dispatchEvent('play');
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
    this.dispatchEvent('pause');
  }

  load() {
    this.dispatchEvent('loadstart');
    setTimeout(() => {
      this.dispatchEvent('loadedmetadata');
      this.dispatchEvent('canplay');
    }, 0);
  }

  addEventListener(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }
  }

  dispatchEvent(event) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(handler => handler({ type: event }));
    }
  }
}

/**
 * Setup Audio mock
 */
export function setupAudioMock() {
  global.Audio = MockAudio;
  global.HTMLMediaElement.prototype.play = function() {
    return Promise.resolve();
  };
  global.HTMLMediaElement.prototype.pause = function() {};
}

/**
 * Accessibility testing helper
 * @param {HTMLElement} container - Container to test
 * @returns {Object} Accessibility test results
 */
export function testAccessibility(container) {
  const issues = [];

  // Check for images without alt text
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image missing alt attribute'
      });
    }
  });

  // Check for buttons without labels
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    const hasLabel = button.textContent.trim() ||
                     button.getAttribute('aria-label') ||
                     button.getAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push({
        type: 'missing-label',
        element: button,
        message: 'Button missing accessible label'
      });
    }
  });

  // Check for form inputs without labels
  const inputs = container.querySelectorAll('input:not([type="hidden"])');
  inputs.forEach(input => {
    const hasLabel = input.getAttribute('aria-label') ||
                     input.getAttribute('aria-labelledby') ||
                     container.querySelector(`label[for="${input.id}"]`);
    if (!hasLabel) {
      issues.push({
        type: 'input-without-label',
        element: input,
        message: 'Input missing associated label'
      });
    }
  });

  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Performance testing helper
 * @param {Function} fn - Function to measure
 * @returns {Object} Performance metrics
 */
export async function measurePerformance(fn) {
  const start = performance.now();
  const memoryBefore = performance.memory?.usedJSHeapSize || 0;

  await fn();

  const end = performance.now();
  const memoryAfter = performance.memory?.usedJSHeapSize || 0;

  return {
    duration: end - start,
    memoryUsed: memoryAfter - memoryBefore
  };
}

/**
 * Create mock router for testing
 */
export function createMockRouter(overrides = {}) {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    location: {
      pathname: '/',
      search: '',
      hash: '',
      state: null
    },
    ...overrides
  };
}

export default {
  renderWithProviders,
  mockBook,
  mockUser,
  mockClub,
  wait,
  MockLocalStorage,
  setupLocalStorageMock,
  MockIntersectionObserver,
  setupIntersectionObserverMock,
  mockFetch,
  createMockEvent,
  MockAudio,
  setupAudioMock,
  testAccessibility,
  measurePerformance,
  createMockRouter
};

