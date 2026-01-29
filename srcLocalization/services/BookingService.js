// services/BookingService.js
import NotificationService from './NotificationService';
import {
  // Booking API endpoints from apiSlice
  getPendingBookings,
  createBooking,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
  getEscortAvailability,
} from '../reduxSlice/apiSlice';

class BookingService {
  /**
   * ============================================
   * BOOKING MODULE
   * ============================================
   */

  /**
   * Get all pending bookings
   * @param {string} role - Role of the user (e.g. 'escort' or 'client')
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getPendingBookings({role = 'escort', status = 'pending'}, dispatch) {
    try {
      const response = await dispatch(getPendingBookings({role, status}));

      if (response?.success || response?.data) {
        return {
          success: true,
          bookings: response.data || [],
          count: response.data?.length || 0,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch pending bookings');
      }
    } catch (error) {
      console.error('Get pending bookings error:', error);
      NotificationService.error(error.message || 'Failed to load bookings');
      throw error;
    }
  }

  /**
   * Create a new booking
   * @param {Object} data - Booking details
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async createBooking(data, dispatch) {
    try {
      if (!data?.escort_id || !data?.booking_date || !data?.start_time) {
        throw new Error('Missing required booking fields');
      }

      const response = await dispatch(createBooking(data));

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Booking created successfully'
        );
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Create booking error:', error);
      NotificationService.error(error.message || 'Failed to create booking');
      throw error;
    }
  }

  /**
   * Get booking details by ID
   * @param {number} bookingId - Booking ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getBookingById(bookingId, dispatch) {
    try {
      if (!bookingId) throw new Error('Booking ID is required');

      const response = await dispatch(getBookingById(bookingId));

      if (response?.success || response?.data) {
        return {
          success: true,
          booking: response.data || {},
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Get booking by ID error:', error);
      NotificationService.error(error.message || 'Failed to load booking details');
      throw error;
    }
  }

  /**
   * Update booking status (accept/reject)
   * @param {number} bookingId - Booking ID
   * @param {'accept'|'reject'} decision - Booking decision
   * @param {string} reason - Optional reason for rejection
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async updateBookingStatus(bookingId, decision, reason = '', dispatch) {
    try {
      if (!bookingId || !decision) throw new Error('Missing booking ID or decision');

      const data = { booking_id: bookingId, decision, reason };
      const response = await dispatch(updateBookingStatus(data));

      if (response?.success) {
        NotificationService.success(
          response?.message || `Booking ${decision}ed successfully`
        );
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Update booking status error:', error);
      NotificationService.error(error.message || 'Failed to update booking status');
      throw error;
    }
  }

  /**
   * Cancel booking
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Reason for cancellation
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async cancelBooking(bookingId, reason, dispatch) {
    try {
      if (!bookingId) throw new Error('Booking ID is required');

      const data = { booking_id: bookingId, reason };
      const response = await dispatch(cancelBooking(data));

      if (response?.success) {
        NotificationService.success(response?.message || 'Booking cancelled');
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      NotificationService.error(error.message || 'Failed to cancel booking');
      throw error;
    }
  }

  /**
   * Get booking statistics
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getBookingStats(dispatch) {
    try {
      const response = await dispatch(getBookingStats());

      if (response?.success || response?.data) {
        return {
          success: true,
          stats: response.data || {},
          pendingCount: response.data?.pending || 0,
          completedCount: response.data?.completed || 0,
          cancelledCount: response.data?.cancelled || 0,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch booking stats');
      }
    } catch (error) {
      console.error('Get booking stats error:', error);
      return { success: false, stats: {} };
    }
  }

  /**
   * Get escort availability by ID
   * @param {number} escortId - Escort ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getEscortAvailability(escortId, dispatch) {
    try {
      if (!escortId) throw new Error('Escort ID is required');

      const response = await dispatch(getEscortAvailability(escortId));

      if (response?.success || response?.data) {
        return {
          success: true,
          availability: response.data || [],
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch availability');
      }
    } catch (error) {
      console.error('Get escort availability error:', error);
      NotificationService.error(error.message || 'Failed to load availability');
      throw error;
    }
  }
}

export default new BookingService();
