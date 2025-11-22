/**
 * Simulated WebSocket using localStorage events
 * Enables cross-tab communication for real-time updates
 */

const SOCKET_EVENT_KEY = 'audible_socket_event';

class SimulatedSocket {
  constructor() {
    this.listeners = {};
    this.setupStorageListener();
  }

  setupStorageListener() {
    // Listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === SOCKET_EVENT_KEY && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          this.handleEvent(event);
        } catch (error) {
          console.error('[Socket] Failed to parse event:', error);
        }
      }
    });
  }

  /**
   * Emit an event to all tabs
   * @param {string} eventName - Name of the event
   * @param {any} data - Event data
   */
  emit(eventName, data) {
    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      tabId: this.getTabId()
    };

    // Store in localStorage to trigger storage event in other tabs
    localStorage.setItem(SOCKET_EVENT_KEY, JSON.stringify(event));
    
    // Also handle in current tab
    setTimeout(() => this.handleEvent(event), 0);
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    };
  }

  /**
   * Handle incoming event
   * @param {Object} event - Event object
   */
  handleEvent(event) {
    const { name, data, tabId } = event;
    
    // Don't process events from the same tab (they're already handled locally)
    if (tabId === this.getTabId()) {
      return;
    }

    if (this.listeners[name]) {
      this.listeners[name].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[Socket] Error in listener for ${name}:`, error);
        }
      });
    }
  }

  /**
   * Get or create unique tab ID
   * @returns {string} Tab ID
   */
  getTabId() {
    if (!this._tabId) {
      this._tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this._tabId;
  }

  /**
   * Broadcast presence update
   * @param {string} userId - User ID
   * @param {string} status - Status (online/typing/idle)
   * @param {Object} metadata - Additional metadata
   */
  broadcastPresence(userId, status, metadata = {}) {
    this.emit('presence_update', {
      userId,
      status,
      ...metadata,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast new message
   * @param {string} channelId - Channel/Club ID
   * @param {Object} message - Message object
   */
  broadcastMessage(channelId, message) {
    this.emit('new_message', {
      channelId,
      message,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast activity update
   * @param {string} activityType - Type of activity
   * @param {Object} data - Activity data
   */
  broadcastActivity(activityType, data) {
    this.emit('activity_update', {
      activityType,
      data,
      timestamp: Date.now()
    });
  }
}

// Create singleton instance
const socket = new SimulatedSocket();

export default socket;

// Export event types for consistency
export const SOCKET_EVENTS = {
  PRESENCE_UPDATE: 'presence_update',
  NEW_MESSAGE: 'new_message',
  ACTIVITY_UPDATE: 'activity_update',
  VOTE_CAST: 'vote_cast',
  CLUB_UPDATE: 'club_update',
  NOTIFICATION: 'notification'
};

