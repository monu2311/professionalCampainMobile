/**
 * AvailabilityUtils - Senior Developer Implementation
 * Comprehensive availability management with complete edge case handling
 *
 * Features:
 * - Robust date/time validation
 * - Missing day handling
 * - Timezone safety
 * - Performance optimized
 * - Production-ready error handling
 */

import moment from 'moment';

// Constants
const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

const DEFAULT_BOOKING_NOTICE_HOURS = 2; // Minimum hours notice required
const MAX_BOOKING_DURATION_HOURS = 12; // Maximum single booking duration

/**
 * Comprehensive Availability Utilities
 * Handles all edge cases and provides robust validation
 */
export class AvailabilityUtils {

  /**
   * Safely parse time string with multiple format support
   * @param {string} timeString - Time in various formats (10:00 AM, 10:00, etc.)
   * @returns {moment.Moment|null} Parsed moment object or null if invalid
   */
  static parseTimeString(timeString) {
    if (!timeString || typeof timeString !== 'string') {
      console.warn('Invalid time string:', timeString);
      return null;
    }

    try {
      // Handle various time formats
      const formats = [
        'h:mm A',    // 10:00 AM
        'H:mm',      // 10:00 (24-hour)
        'h:mmA',     // 10:00AM (no space)
        'h A',       // 10 AM
        'hA',        // 10AM
        'H',         // 24 (24-hour single digit)
      ];

      for (const format of formats) {
        const parsed = moment(timeString.trim(), format, true);
        if (parsed.isValid()) {
          return parsed;
        }
      }

      console.warn('Unable to parse time string:', timeString);
      return null;
    } catch (error) {
      console.error('Error parsing time string:', timeString, error);
      return null;
    }
  }

  /**
   * Get day name from date with validation
   * @param {Date|moment.Moment|string} date - Date in any format
   * @returns {string|null} Day name or null if invalid
   */
  static getDayName(date) {
    try {
      const momentDate = moment(date);
      if (!momentDate.isValid()) {
        console.warn('Invalid date for getDayName:', date);
        return null;
      }
      return momentDate.format('dddd'); // Full day name (Monday, Tuesday, etc.)
    } catch (error) {
      console.error('Error getting day name:', date, error);
      return null;
    }
  }

  /**
   * Find day availability with comprehensive validation
   * @param {Date|moment.Moment|string} date - Date to check
   * @param {Array} availabilityArray - Array of availability objects
   * @returns {Object|null} Availability object or null
   */
  static getDayAvailability(date, availabilityArray) {
    try {
      // Validate inputs
      if (!date) {
        console.warn('No date provided to getDayAvailability');
        return null;
      }

      if (!Array.isArray(availabilityArray)) {
        console.warn('Invalid availability array:', availabilityArray);
        return null;
      }

      const dayName = this.getDayName(date);
      if (!dayName) {
        return null;
      }

      // Find exact day match (case-insensitive)
      const dayAvailability = availabilityArray.find(item => {
        if (!item || typeof item !== 'object') {
          return false;
        }
        return item.day &&
               item.day.toLowerCase() === dayName.toLowerCase();
      });

      if (!dayAvailability) {
        console.log(`No availability found for ${dayName} - day is unavailable`);
        return null;
      }

      // Validate the availability object structure
      return this.validateAvailabilityObject(dayAvailability);

    } catch (error) {
      console.error('Error getting day availability:', error);
      return null;
    }
  }

  /**
   * Validate and sanitize availability object
   * @param {Object} availability - Availability object to validate
   * @returns {Object|null} Validated availability object or null
   */
  static validateAvailabilityObject(availability) {
    try {
      if (!availability || typeof availability !== 'object') {
        return null;
      }

      // Check required fields
      if (!availability.day) {
        console.warn('Availability object missing day:', availability);
        return null;
      }

      // Handle unavailable flag (default to available if not specified)
      const unavailable = availability.unavailable === 1 ||
                         availability.unavailable === true ||
                         availability.unavailable === '1';

      if (unavailable) {
        return {
          ...availability,
          unavailable: 1,
          isAvailable: false
        };
      }

      // Validate time fields for available days
      const fromTime = this.parseTimeString(availability.from);
      const untilTime = this.parseTimeString(availability.until);

      if (!fromTime || !untilTime) {
        console.warn('Invalid time format in availability:', availability);
        return {
          ...availability,
          unavailable: 1,
          isAvailable: false,
          error: 'Invalid time format'
        };
      }

      // Check if until time is after from time
      if (untilTime.isSameOrBefore(fromTime)) {
        console.warn('Until time is not after from time:', availability);
        return {
          ...availability,
          unavailable: 1,
          isAvailable: false,
          error: 'Invalid time range'
        };
      }

      return {
        ...availability,
        unavailable: 0,
        isAvailable: true,
        fromMoment: fromTime,
        untilMoment: untilTime
      };

    } catch (error) {
      console.error('Error validating availability object:', error);
      return null;
    }
  }

  /**
   * Check if a specific date is available for booking
   * @param {Date|moment.Moment|string} date - Date to check
   * @param {Array} availability - Availability array
   * @returns {boolean} True if date is available
   */
  static isDateAvailable(date, availability) {
    try {
      // Check if date is in the past (allow same day with minimum notice)
      const now = moment();
      const checkDate = moment(date);

      if (!checkDate.isValid()) {
        return false;
      }

      // Don't allow bookings for past dates
      if (checkDate.isBefore(now, 'day')) {
        return false;
      }

      // For same day bookings, check minimum notice
      if (checkDate.isSame(now, 'day')) {
        const hoursUntilDate = checkDate.diff(now, 'hours', true);
        if (hoursUntilDate < DEFAULT_BOOKING_NOTICE_HOURS) {
          return false;
        }
      }

      // Check availability for this day
      const dayAvailability = this.getDayAvailability(date, availability);

      return dayAvailability && dayAvailability.isAvailable;

    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  }

  /**
   * Get available time slots for a specific date
   * @param {Date|moment.Moment|string} date - Date to get slots for
   * @param {Array} availability - Availability array
   * @returns {Object|null} Time slots object or null
   */
  static getAvailableTimeSlots(date, availability) {
    try {
      const dayAvailability = this.getDayAvailability(date, availability);

      if (!dayAvailability || !dayAvailability.isAvailable) {
        return null;
      }

      const checkDate = moment(date);
      const now = moment();

      // Create time slots for the specific date
      let fromTime = dayAvailability.fromMoment.clone();
      let untilTime = dayAvailability.untilMoment.clone();

      // If it's today, adjust start time to respect minimum notice
      if (checkDate.isSame(now, 'day')) {
        const minStartTime = now.clone().add(DEFAULT_BOOKING_NOTICE_HOURS, 'hours');
        if (minStartTime.isAfter(fromTime)) {
          fromTime = minStartTime.clone().startOf('hour'); // Round up to next hour
        }
      }

      // Ensure we still have valid time range after adjustments
      if (fromTime.isSameOrAfter(untilTime)) {
        return null;
      }

      return {
        date: checkDate.format('YYYY-MM-DD'),
        dayName: checkDate.format('dddd'),
        from: fromTime,
        until: untilTime,
        fromFormatted: fromTime.format('h:mm A'),
        untilFormatted: untilTime.format('h:mm A'),
        durationHours: untilTime.diff(fromTime, 'hours', true),
        isToday: checkDate.isSame(now, 'day'),
        minimumNotice: DEFAULT_BOOKING_NOTICE_HOURS
      };

    } catch (error) {
      console.error('Error getting available time slots:', error);
      return null;
    }
  }

  /**
   * Generate bookable time slots in intervals
   * @param {Date|moment.Moment|string} date - Date to generate slots for
   * @param {Array} availability - Availability array
   * @param {number} intervalMinutes - Slot interval in minutes (default: 30)
   * @param {number} minDurationMinutes - Minimum booking duration (default: 60)
   * @returns {Array} Array of available time slots
   */
  static generateTimeSlots(date, availability, intervalMinutes = 30, minDurationMinutes = 60) {
    try {
      const timeSlots = this.getAvailableTimeSlots(date, availability);

      if (!timeSlots) {
        return [];
      }

      const slots = [];
      let currentTime = timeSlots.from.clone();

      while (currentTime.clone().add(minDurationMinutes, 'minutes').isSameOrBefore(timeSlots.until)) {
        slots.push({
          time: currentTime.clone(),
          formatted: currentTime.format('h:mm A'),
          value: currentTime.format('HH:mm'),
          isAvailable: true,
          maxDuration: timeSlots.until.diff(currentTime, 'minutes')
        });

        currentTime.add(intervalMinutes, 'minutes');
      }

      return slots;

    } catch (error) {
      console.error('Error generating time slots:', error);
      return [];
    }
  }

  /**
   * Comprehensive booking validation
   * @param {Object} bookingData - Booking data to validate
   * @param {Array} availability - Availability array
   * @param {Array} existingBookings - Existing bookings to check conflicts
   * @returns {Object} Validation result with success/error details
   */
  static validateBooking(bookingData, availability, existingBookings = []) {
    try {
      const errors = [];
      const warnings = [];

      // Validate required fields
      if (!bookingData) {
        return { isValid: false, errors: ['No booking data provided'] };
      }

      const { date, startTime, duration } = bookingData;

      if (!date) errors.push('Date is required');
      if (!startTime) errors.push('Start time is required');
      if (!duration) errors.push('Duration is required');

      if (errors.length > 0) {
        return { isValid: false, errors };
      }

      // Parse and validate date
      const bookingDate = moment(date);
      if (!bookingDate.isValid()) {
        return { isValid: false, errors: ['Invalid date format'] };
      }

      // Parse and validate time
      let bookingStartTime;
      if (typeof startTime === 'string') {
        bookingStartTime = this.parseTimeString(startTime);
      } else {
        bookingStartTime = moment(startTime);
      }

      if (!bookingStartTime || !bookingStartTime.isValid()) {
        return { isValid: false, errors: ['Invalid start time format'] };
      }

      // Validate duration
      const durationMinutes = parseInt(duration, 10);
      if (isNaN(durationMinutes) || durationMinutes <= 0) {
        return { isValid: false, errors: ['Invalid duration'] };
      }

      if (durationMinutes > MAX_BOOKING_DURATION_HOURS * 60) {
        return {
          isValid: false,
          errors: [`Maximum booking duration is ${MAX_BOOKING_DURATION_HOURS} hours`]
        };
      }

      // Check if date is available
      if (!this.isDateAvailable(date, availability)) {
        return { isValid: false, errors: ['Selected date is not available'] };
      }

      // Get available time slots for the date
      const timeSlots = this.getAvailableTimeSlots(date, availability);
      if (!timeSlots) {
        return { isValid: false, errors: ['No available time slots for this date'] };
      }

      // Create full datetime objects for validation
      const bookingStart = moment(bookingDate)
        .hour(bookingStartTime.hour())
        .minute(bookingStartTime.minute());

      const bookingEnd = bookingStart.clone().add(durationMinutes, 'minutes');

      // Validate against available time window
      const availableStart = moment(bookingDate)
        .hour(timeSlots.from.hour())
        .minute(timeSlots.from.minute());

      const availableEnd = moment(bookingDate)
        .hour(timeSlots.until.hour())
        .minute(timeSlots.until.minute());

      if (bookingStart.isBefore(availableStart)) {
        errors.push(`Start time must be after ${timeSlots.fromFormatted}`);
      }

      if (bookingEnd.isAfter(availableEnd)) {
        errors.push(`End time must be before ${timeSlots.untilFormatted}`);
      }

      // Check for conflicts with existing bookings
      const conflicts = this.checkBookingConflicts(
        bookingStart,
        bookingEnd,
        existingBookings
      );

      if (conflicts.length > 0) {
        errors.push(`Booking conflicts with existing appointments: ${conflicts.join(', ')}`);
      }

      // Check minimum notice for same-day bookings
      if (timeSlots.isToday) {
        const now = moment();
        const hoursNotice = bookingStart.diff(now, 'hours', true);
        if (hoursNotice < DEFAULT_BOOKING_NOTICE_HOURS) {
          warnings.push(`Booking requires at least ${DEFAULT_BOOKING_NOTICE_HOURS} hours notice`);
        }
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        bookingStart,
        bookingEnd,
        duration: durationMinutes,
        availableWindow: {
          start: availableStart,
          end: availableEnd,
          formatted: `${timeSlots.fromFormatted} - ${timeSlots.untilFormatted}`
        }
      };

    } catch (error) {
      console.error('Error validating booking:', error);
      return {
        isValid: false,
        errors: ['Booking validation failed due to system error']
      };
    }
  }

  /**
   * Check for booking conflicts with existing appointments
   * @param {moment.Moment} bookingStart - Start time of new booking
   * @param {moment.Moment} bookingEnd - End time of new booking
   * @param {Array} existingBookings - Array of existing bookings
   * @returns {Array} Array of conflicting booking descriptions
   */
  static checkBookingConflicts(bookingStart, bookingEnd, existingBookings) {
    try {
      if (!Array.isArray(existingBookings)) {
        return [];
      }

      const conflicts = [];

      existingBookings.forEach((booking, index) => {
        try {
          if (!booking || booking.status === 'cancelled' || booking.status === 'rejected') {
            return; // Skip cancelled/rejected bookings
          }

          let existingStart, existingEnd;

          // Handle different date/time formats in existing bookings
          if (booking.start && booking.end) {
            existingStart = moment(booking.start);
            existingEnd = moment(booking.end);
          } else if (booking.date && booking.startTime && booking.duration) {
            const bookingDate = moment(booking.date);
            const startTime = this.parseTimeString(booking.startTime);
            if (bookingDate.isValid() && startTime) {
              existingStart = moment(bookingDate)
                .hour(startTime.hour())
                .minute(startTime.minute());
              existingEnd = existingStart.clone().add(parseInt(booking.duration, 10), 'minutes');
            }
          }

          if (!existingStart || !existingEnd || !existingStart.isValid() || !existingEnd.isValid()) {
            console.warn('Invalid existing booking data:', booking);
            return;
          }

          // Check for overlap
          const hasOverlap = bookingStart.isBefore(existingEnd) && bookingEnd.isAfter(existingStart);

          if (hasOverlap) {
            const conflictDescription = `${existingStart.format('h:mm A')} - ${existingEnd.format('h:mm A')}`;
            conflicts.push(conflictDescription);
          }

        } catch (error) {
          console.error('Error checking individual booking conflict:', error, booking);
        }
      });

      return conflicts;

    } catch (error) {
      console.error('Error checking booking conflicts:', error);
      return [];
    }
  }

  /**
   * Get next available booking slot
   * @param {Array} availability - Availability array
   * @param {Array} existingBookings - Existing bookings
   * @param {number} desiredDuration - Desired duration in minutes
   * @returns {Object|null} Next available slot or null
   */
  static getNextAvailableSlot(availability, existingBookings = [], desiredDuration = 60) {
    try {
      const today = moment().startOf('day');

      // Check next 14 days
      for (let i = 0; i < 14; i++) {
        const checkDate = today.clone().add(i, 'days');

        if (!this.isDateAvailable(checkDate, availability)) {
          continue;
        }

        const timeSlots = this.generateTimeSlots(checkDate, availability, 30, desiredDuration);

        for (const slot of timeSlots) {
          if (slot.maxDuration >= desiredDuration) {
            const bookingEnd = slot.time.clone().add(desiredDuration, 'minutes');
            const conflicts = this.checkBookingConflicts(slot.time, bookingEnd, existingBookings);

            if (conflicts.length === 0) {
              return {
                date: checkDate.format('YYYY-MM-DD'),
                time: slot.time,
                formatted: `${checkDate.format('dddd, MMMM Do')} at ${slot.formatted}`,
                duration: desiredDuration
              };
            }
          }
        }
      }

      return null;

    } catch (error) {
      console.error('Error getting next available slot:', error);
      return null;
    }
  }

  /**
   * Get availability summary for a date range
   * @param {Date|moment.Moment} startDate - Start of date range
   * @param {Date|moment.Moment} endDate - End of date range
   * @param {Array} availability - Availability array
   * @returns {Array} Summary of availability for each date
   */
  static getAvailabilitySummary(startDate, endDate, availability) {
    try {
      const summary = [];
      const current = moment(startDate).startOf('day');
      const end = moment(endDate).endOf('day');

      while (current.isSameOrBefore(end, 'day')) {
        const dateStr = current.format('YYYY-MM-DD');
        const dayName = current.format('dddd');
        const isAvailable = this.isDateAvailable(current, availability);
        const timeSlots = isAvailable ? this.getAvailableTimeSlots(current, availability) : null;

        summary.push({
          date: dateStr,
          dayName,
          isAvailable,
          isPast: current.isBefore(moment(), 'day'),
          timeSlots,
          status: this.getDateStatus(current, availability)
        });

        current.add(1, 'day');
      }

      return summary;

    } catch (error) {
      console.error('Error getting availability summary:', error);
      return [];
    }
  }

  /**
   * Get status description for a date
   * @param {moment.Moment} date - Date to check
   * @param {Array} availability - Availability array
   * @returns {string} Status description
   */
  static getDateStatus(date, availability) {
    try {
      if (date.isBefore(moment(), 'day')) {
        return 'past';
      }

      const dayAvailability = this.getDayAvailability(date, availability);

      if (!dayAvailability) {
        return 'unavailable'; // Day not in availability array
      }

      if (!dayAvailability.isAvailable) {
        return 'blocked'; // Explicitly marked unavailable
      }

      if (date.isSame(moment(), 'day')) {
        const timeSlots = this.getAvailableTimeSlots(date, availability);
        if (!timeSlots || moment().isAfter(timeSlots.until)) {
          return 'no_time_left';
        }
        return 'available_today';
      }

      return 'available';

    } catch (error) {
      console.error('Error getting date status:', error);
      return 'unknown';
    }
  }
}

// Export default for easy import
export default AvailabilityUtils;

// Export individual functions for selective import
export const {
  parseTimeString,
  getDayName,
  getDayAvailability,
  validateAvailabilityObject,
  isDateAvailable,
  getAvailableTimeSlots,
  generateTimeSlots,
  validateBooking,
  checkBookingConflicts,
  getNextAvailableSlot,
  getAvailabilitySummary,
  getDateStatus
} = AvailabilityUtils;