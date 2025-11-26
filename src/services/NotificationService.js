/**
 * NotificationService
 * Centralized notification management using react-native-flash-message
 */
import { showMessage } from 'react-native-flash-message';

class NotificationService {
  /**
   * Show success message
   * @param {string} message - Success message
   * @param {string} description - Optional description
   */
  static success(message, description = null) {
    showMessage({
      message: message,
      description: description,
      type: 'success',
      icon: 'success',
      duration: 3000,
      floating: true,
    });
  }

  /**
   * Show error message
   * @param {string} message - Error message
   * @param {string} description - Optional description
   */
  static error(message, description = null) {
    showMessage({
      message: message,
      description: description,
      type: 'danger',
      icon: 'danger',
      duration: 4000,
      floating: true,
    });
  }

  /**
   * Show warning message
   * @param {string} message - Warning message
   * @param {string} description - Optional description
   */
  static warning(message, description = null) {
    showMessage({
      message: message,
      description: description,
      type: 'warning',
      icon: 'warning',
      duration: 3500,
      floating: true,
    });
  }

  /**
   * Show info message
   * @param {string} message - Info message
   * @param {string} description - Optional description
   */
  static info(message, description = null) {
    showMessage({
      message: message,
      description: description,
      type: 'info',
      icon: 'info',
      duration: 3000,
      floating: true,
    });
  }

  /**
   * Show custom message
   * @param {Object} options - Custom message options
   */
  static custom(options) {
    showMessage({
      duration: 3000,
      floating: true,
      ...options,
    });
  }
}

export default NotificationService;