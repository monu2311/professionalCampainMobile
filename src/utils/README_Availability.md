# Availability-Based Booking System

## Overview
A comprehensive, production-ready booking system that intelligently handles companion availability with complete edge case coverage and senior-level implementation patterns.

## Features
✅ **Smart Date Validation** - Automatically disables unavailable dates
✅ **Dynamic Time Slots** - Shows only available time slots based on companion schedule
✅ **Edge Case Handling** - Handles missing days, malformed data, timezone issues
✅ **Conflict Detection** - Prevents overlapping bookings
✅ **Real-time Validation** - Instant feedback on booking validity
✅ **Flexible Duration** - Supports 30min to 3+ hour bookings
✅ **Platform Optimized** - iOS and Android compatible

## Data Structure

### Availability Array Format
```javascript
const availability = [
  {
    id: 1208,
    user_id: 304,
    day: 'Sunday',          // Full day name
    unavailable: 0,         // 0 = available, 1 = unavailable
    from: '10:00 AM',       // Start time (12-hour format)
    until: '10:00 PM',      // End time (12-hour format)
    created_at: '2025-11-07T00:17:59.000000Z',
    updated_at: '2025-11-07T00:17:59.000000Z'
  },
  // ... rest of week
];
```

### Edge Cases Handled
1. **Missing Days**: If a day is not in availability array → completely unavailable
2. **Explicit Unavailability**: `unavailable: 1` blocks the entire day
3. **Malformed Data**: Invalid time formats are safely handled
4. **Same Day Bookings**: Respects minimum notice requirements
5. **Time Validation**: Ensures booking fits within available window

## Quick Start

### 1. Import the Utils
```javascript
import AvailabilityUtils from '../utils/AvailabilityUtils';
```

### 2. Basic Usage Examples

#### Check if a date is available
```javascript
const isAvailable = AvailabilityUtils.isDateAvailable(
  new Date('2025-01-15'),  // Date to check
  companionAvailability    // Availability array
);
console.log(isAvailable); // true/false
```

#### Get available time slots
```javascript
const timeSlots = AvailabilityUtils.generateTimeSlots(
  new Date('2025-01-15'),  // Date
  companionAvailability,   // Availability array
  30,                      // 30-minute intervals
  60                       // Minimum 1-hour booking
);

console.log(timeSlots);
// [
//   { time: moment, formatted: '10:00 AM', maxDuration: 720 },
//   { time: moment, formatted: '10:30 AM', maxDuration: 690 },
//   // ... more slots
// ]
```

#### Validate a complete booking
```javascript
const validation = AvailabilityUtils.validateBooking(
  {
    date: '2025-01-15',
    startTime: '14:00',
    duration: 120  // 2 hours
  },
  companionAvailability,
  existingBookings
);

if (validation.isValid) {
  console.log('Booking is valid!');
} else {
  console.log('Errors:', validation.errors);
}
```

### 3. Enhanced BookingModal Integration

The BookingModal automatically uses availability data when passed:

```javascript
<BookingModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  companionData={{
    ...profileData,
    availability: profileData?.availability || []
  }}
  onSubmit={handleBooking}
  existingBookings={existingBookings}
/>
```

**Features Added to BookingModal:**
- ✅ Date validation with visual indicators
- ✅ Smart time slot picker
- ✅ Duration selection (30min - 3hrs)
- ✅ Real-time availability feedback
- ✅ Conflict prevention
- ✅ Comprehensive validation

## API Reference

### AvailabilityUtils Methods

#### `isDateAvailable(date, availability)`
Checks if a specific date is available for booking.

**Parameters:**
- `date` - Date object, moment, or string
- `availability` - Array of availability objects

**Returns:** `boolean`

---

#### `getAvailableTimeSlots(date, availability)`
Gets detailed time slot information for a specific date.

**Returns:**
```javascript
{
  date: 'YYYY-MM-DD',
  dayName: 'Monday',
  from: moment,          // Start time
  until: moment,         // End time
  fromFormatted: '10:00 AM',
  untilFormatted: '10:00 PM',
  durationHours: 12,
  isToday: false,
  minimumNotice: 2       // Hours
}
```

---

#### `generateTimeSlots(date, availability, intervalMinutes, minDurationMinutes)`
Generates bookable time slots with specified intervals.

**Parameters:**
- `intervalMinutes` - Slot spacing (default: 30)
- `minDurationMinutes` - Minimum booking length (default: 60)

**Returns:** Array of slot objects

---

#### `validateBooking(bookingData, availability, existingBookings)`
Comprehensive validation of booking request.

**Returns:**
```javascript
{
  isValid: true/false,
  errors: [],           // Array of error messages
  warnings: [],         // Array of warnings
  bookingStart: moment, // Validated start time
  bookingEnd: moment,   // Validated end time
  availableWindow: {}   // Available time window
}
```

---

#### `checkBookingConflicts(startTime, endTime, existingBookings)`
Checks for overlaps with existing bookings.

**Returns:** Array of conflicting time descriptions

---

#### `getNextAvailableSlot(availability, existingBookings, duration)`
Finds the next available booking slot.

**Returns:**
```javascript
{
  date: 'YYYY-MM-DD',
  time: moment,
  formatted: 'Monday, January 15th at 2:00 PM',
  duration: 60
}
```

## Advanced Usage

### Custom Validation Rules
```javascript
// Add custom business rules
const validation = AvailabilityUtils.validateBooking(bookingData, availability, existingBookings);

// Add custom checks
if (validation.isValid) {
  // Custom rule: No bookings after 9 PM on weekdays
  const isWeekday = validation.bookingStart.day() >= 1 && validation.bookingStart.day() <= 5;
  const isAfter9PM = validation.bookingStart.hour() >= 21;

  if (isWeekday && isAfter9PM) {
    validation.isValid = false;
    validation.errors.push('No weekday bookings after 9 PM');
  }
}
```

### Availability Summary for Calendar
```javascript
const summary = AvailabilityUtils.getAvailabilitySummary(
  startDate,
  endDate,
  availability
);

// Use for calendar color-coding
summary.forEach(day => {
  console.log(`${day.date}: ${day.status}`);
  // Possible statuses: 'available', 'unavailable', 'blocked', 'past'
});
```

### Integration with State Management
```javascript
// Redux/Context pattern
const useBookingValidation = (companionId) => {
  const availability = useSelector(state =>
    state.companions[companionId]?.availability || []
  );

  const existingBookings = useSelector(state =>
    state.bookings.items.filter(b => b.companionId === companionId)
  );

  return { availability, existingBookings };
};
```

## Error Handling

### Common Error Messages
- `"Selected date is not available"` - Date not in availability or marked unavailable
- `"Start time must be after X"` - Booking outside available window
- `"End time must be before X"` - Booking duration too long
- `"Booking conflicts with existing appointments"` - Overlap detected
- `"Booking requires at least 2 hours notice"` - Same-day booking too soon

### Graceful Degradation
The system gracefully handles:
- Missing availability data (treats as unavailable)
- Invalid time formats (falls back to unavailable)
- Network errors (maintains local validation)
- Malformed API responses (logs errors, shows user-friendly messages)

## Performance Considerations

### Optimizations Included
- **Memoized calculations** - Date/time parsing cached
- **Efficient filtering** - Optimized array operations
- **Debounced validation** - Prevents excessive API calls
- **Lazy loading** - Time slots generated on demand

### Best Practices
1. Pass availability data at component mount
2. Use React.memo for booking components
3. Debounce user input validation
4. Cache parsed time values
5. Implement proper loading states

## Testing

### Unit Test Examples
```javascript
describe('AvailabilityUtils', () => {
  test('should reject unavailable dates', () => {
    const availability = [
      { day: 'Monday', unavailable: 1, from: '10:00 AM', until: '6:00 PM' }
    ];

    const result = AvailabilityUtils.isDateAvailable(
      new Date('2025-01-13'), // Monday
      availability
    );

    expect(result).toBe(false);
  });

  test('should handle missing days', () => {
    const availability = [
      // Tuesday missing
      { day: 'Wednesday', unavailable: 0, from: '10:00 AM', until: '6:00 PM' }
    ];

    const result = AvailabilityUtils.isDateAvailable(
      new Date('2025-01-14'), // Tuesday
      availability
    );

    expect(result).toBe(false);
  });
});
```

## Migration Guide

### From Basic Calendar to Availability-Based

1. **Update imports:**
```javascript
import AvailabilityUtils from '../utils/AvailabilityUtils';
```

2. **Replace date picker validation:**
```javascript
// Before
const onDateChange = (date) => setSelectedDate(date);

// After
const onDateChange = (date) => {
  if (AvailabilityUtils.isDateAvailable(date, availability)) {
    setSelectedDate(date);
  } else {
    showError('Date not available');
  }
};
```

3. **Add time slot generation:**
```javascript
// Before
<TimePicker />

// After
const timeSlots = AvailabilityUtils.generateTimeSlots(selectedDate, availability);
<TimeSlotPicker slots={timeSlots} />
```

## Troubleshooting

### Common Issues

**Q: Calendar shows all dates as unavailable**
A: Check availability array format and ensure day names match exactly (case-sensitive).

**Q: Time slots not appearing**
A: Verify time format parsing. Use console.log to check `AvailabilityUtils.parseTimeString(timeString)`.

**Q: Validation always fails**
A: Check that duration is passed as a number, not string.

**Q: Same-day bookings rejected**
A: Adjust `DEFAULT_BOOKING_NOTICE_HOURS` constant if needed.

### Debug Helpers
```javascript
// Debug availability parsing
AvailabilityUtils.getAvailabilitySummary(
  moment().startOf('week'),
  moment().endOf('week'),
  availability
).forEach(day => console.log(day));

// Debug specific date
const slots = AvailabilityUtils.getAvailableTimeSlots(date, availability);
console.log('Available slots:', slots);

// Debug booking validation
const validation = AvailabilityUtils.validateBooking(bookingData, availability, []);
console.log('Validation result:', validation);
```

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Review console logs for detailed error messages
3. Test with simplified availability data
4. Verify moment.js is properly installed

---

**Version:** 1.0.0
**Last Updated:** January 2025
**Status:** Production Ready ✅