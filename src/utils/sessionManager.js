/**
 * Session Manager
 * Manages global session state and handles session expiration
 */

class SessionManager {
  constructor() {
    this.listeners = [];
    this.isModalVisible = false;
  }

  /**
   * Subscribe to session state changes
   * @param {Function} listener - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({ isModalVisible: this.isModalVisible });
    });
  }

  /**
   * Show session expired modal
   */
  showSessionExpiredModal() {
    // Prevent showing multiple modals
    if (this.isModalVisible) {
      return;
    }

    this.isModalVisible = true;
    this.notifyListeners();
  }

  /**
   * Hide session expired modal
   */
  hideSessionExpiredModal() {
    this.isModalVisible = false;
    this.notifyListeners();
  }

  /**
   * Check if modal is currently visible
   * @returns {boolean} Modal visibility state
   */
  isModalShowing() {
    return this.isModalVisible;
  }

  /**
   * Reset session manager state
   */
  reset() {
    this.isModalVisible = false;
    this.listeners = [];
    this.notifyListeners();
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;