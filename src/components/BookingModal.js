import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar} from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {COLORS} from '../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AvailabilityUtils} from '../utils/AvailabilityUtils';

const {width, height} = Dimensions.get('window');

const BookingModal = ({visible, onClose, companionData, onSubmit}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [showCalendar, setShowCalendar] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('60');
  const [serviceType, setServiceType] = useState('outcall');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const availability = companionData?.availability || [];

  const generateMarkedDates = () => {
    const marked = {};
    const today = moment();
    const oneMonthLater = moment().add(1, 'month');

    console.log('Companion Data:', companionData);
    console.log('Availability:', availability);

    let current = today.clone();
    while (current.isSameOrBefore(oneMonthLater, 'day')) {
      const dateStr = current.format('YYYY-MM-DD');
      const status = AvailabilityUtils.getDateStatus(current, availability);

      console.log(`Date: ${dateStr}, Status: ${status}`);

      let markingStyle = {};

      switch (status) {
        case 'past':
          markingStyle = {
            disabled: true,
            disableTouchEvent: true,
            customStyles: {
              container: {
                backgroundColor: '#e5e7eb',
                borderRadius: 16,
              },
              text: {
                color: '#9ca3af',
                fontWeight: '400'
              }
            }
          };
          break;
        case 'unavailable':
        case 'blocked':
        case 'no_time_left':
          markingStyle = {
            disabled: true,
            disableTouchEvent: true,
            customStyles: {
              container: {
                backgroundColor: '#fecaca',
                borderRadius: 16,
              },
              text: {
                color: '#dc2626',
                fontWeight: '500'
              }
            }
          };
          break;
        case 'available_today':
        case 'available':
          markingStyle = {
            disabled: false,
            disableTouchEvent: false,
            customStyles: {
              container: {
                backgroundColor: '#bbf7d0',
                borderRadius: 16,
              },
              text: {
                color: '#16a34a',
                fontWeight: '600'
              }
            }
          };
          break;
        default:
          markingStyle = {
            disabled: true,
            disableTouchEvent: true,
            customStyles: {
              container: {
                backgroundColor: '#f3f4f6',
                borderRadius: 16,
              },
              text: {
                color: '#6b7280',
                fontWeight: '400'
              }
            }
          };
      }

      if (current.isAfter(oneMonthLater, 'day')) {
        markingStyle = {
          disabled: true,
          disableTouchEvent: true,
          customStyles: {
            container: {
              backgroundColor: '#f9fafb',
              borderRadius: 16,
            },
            text: {
              color: '#9ca3af',
              fontWeight: '300'
            }
          }
        };
      }

      if (dateStr === date) {
        markingStyle.selected = true;
        markingStyle.customStyles.container.backgroundColor = COLORS.specialTextColor;
        markingStyle.customStyles.text.color = '#ffffff';
        markingStyle.customStyles.text.fontWeight = 'bold';
      }

      marked[dateStr] = markingStyle;
      current.add(1, 'day');
    }

    return marked;
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    const bookingData = {
      companionId: companionData?.id,
      companionName: companionData?.name,
      date: date,
      startTime: moment(startTime).format('HH:mm'),
      duration,
      serviceType,
      location: location || companionData?.location || 'Not specified',
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const validation = AvailabilityUtils.validateBooking(
      {
        date,
        startTime: moment(startTime).format('HH:mm'),
        duration
      },
      availability
    );

    if (!validation.isValid) {
      alert('Booking Error: ' + validation.errors.join(', '));
      return;
    }

    onSubmit(bookingData);
    onClose();
  };

  const onDateSelect = (day) => {
    const selectedDate = moment(day.dateString);
    const today = moment();
    const oneMonthLater = moment().add(1, 'month');

    if (selectedDate.isBefore(today, 'day')) {
      alert('Cannot select past dates');
      return;
    }

    if (selectedDate.isAfter(oneMonthLater, 'day')) {
      alert('Cannot book more than 1 month in advance');
      return;
    }

    const status = AvailabilityUtils.getDateStatus(selectedDate, availability);
    if (status === 'unavailable' || status === 'blocked' || status === 'no_time_left') {
      alert('This date is not available for booking');
      return;
    }

    setDate(day.dateString);
    setShowCalendar(false);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.7)"
        translucent={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book Companion</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {companionData && (
              <View style={styles.companionInfo}>
                <LinearGradient
                  colors={[COLORS.specialTextColor, '#6366f1']}
                  style={styles.companionCard}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Text style={styles.companionName}>
                    {companionData.name}
                  </Text>
                  <Text style={styles.companionLocation}>
                    <Icon name="location-on" size={16} color={COLORS.white} />
                    {' ' + (companionData.location || 'Location not specified')}
                  </Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCalendar(true)}>
                <Text style={styles.inputText}>
                  {moment(date).format('MMMM DD, YYYY')}
                </Text>
                <Icon name="calendar-today" size={20} color={COLORS.placeHolderColor} />
              </TouchableOpacity>
            </View>

            {showCalendar && (
              <View style={styles.calendarSection}>
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarTitle}>Select Date</Text>
                  <TouchableOpacity onPress={() => setShowCalendar(false)}>
                    <Icon name="close" size={24} color={COLORS.textColor} />
                  </TouchableOpacity>
                </View>
                <Calendar
                  current={date}
                  minDate={moment().format('YYYY-MM-DD')}
                  maxDate={moment().add(1, 'month').format('YYYY-MM-DD')}
                  onDayPress={onDateSelect}
                  monthFormat={'MMMM yyyy'}
                  markingType={'custom'}
                  markedDates={generateMarkedDates()}
                  disableAllTouchEventsForDisabledDays={true}
                  enableSwipeMonths={true}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: COLORS.textColor,
                    selectedDayBackgroundColor: COLORS.specialTextColor,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: COLORS.specialTextColor,
                    dayTextColor: COLORS.textColor,
                    textDisabledColor: '#9ca3af',
                    dotColor: COLORS.specialTextColor,
                    selectedDotColor: '#ffffff',
                    arrowColor: COLORS.specialTextColor,
                    monthTextColor: COLORS.textColor,
                    indicatorColor: COLORS.specialTextColor,
                    textDayFontFamily: 'QUICKREGULAR',
                    textMonthFontFamily: 'QUICKBLOD',
                    textDayHeaderFontFamily: 'QUICKBLOD',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 12
                  }}
                />
                <View style={styles.legendSection}>
                  <Text style={styles.legendTitle}>Legend:</Text>
                  <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, {backgroundColor: '#bbf7d0'}]} />
                      <Text style={styles.legendText}>Available</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, {backgroundColor: '#fecaca'}]} />
                      <Text style={styles.legendText}>Unavailable</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, {backgroundColor: '#e5e7eb'}]} />
                      <Text style={styles.legendText}>Past/Blocked</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.row}>
              <View style={[styles.formSection, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Time</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.inputText}>
                    {moment(startTime).format('HH:mm')}
                  </Text>
                  <Icon name="access-time" size={20} color={COLORS.placeHolderColor} />
                </TouchableOpacity>
              </View>

              <View style={[styles.formSection, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>Duration (minutes)</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor={COLORS.placeHolderColor}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Service Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={serviceType}
                  onValueChange={setServiceType}
                  style={styles.picker}>
                  <Picker.Item label="Outcall" value="outcall" color={COLORS.textColor} />
                  <Picker.Item label="Incall" value="incall" color={COLORS.textColor} />
                  <Picker.Item label="Virtual" value="virtual" color={COLORS.textColor} />
                </Picker>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>
                Location{' '}
                <Text style={styles.labelHint}>
                  {serviceType === 'outcall' ? '(Your location)' : "(Companion's area)"}
                </Text>
              </Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder={
                  serviceType === 'outcall'
                    ? 'Enter your location'
                    : companionData?.location || 'Companion location'
                }
                placeholderTextColor={COLORS.placeHolderColor}
                editable={serviceType === 'outcall'}
              />
              {serviceType === 'incall' && (
                <Text style={styles.locationNote}>
                  Prefilled to the companion's city and cannot be changed.
                </Text>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional notes or instructions"
                placeholderTextColor={COLORS.placeHolderColor}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}>
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
              
                  <Text style={styles.submitButtonText}>
                    Submit Booking Request
                  </Text>
             
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>


        {showTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
            is24Hour={true}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    bottom: -100,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.9,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  companionInfo: {
    marginBottom: 20,
  },
  companionCard: {
    padding: 15,
    borderRadius: 12,
  },
  companionName: {
    fontSize: 18,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
    marginBottom: 5,
  },
  companionLocation: {
    fontSize: 14,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    marginBottom: 8,
  },
  labelHint: {
    fontSize: 12,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.placeHolderColor,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.textColor,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.textColor,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: COLORS.textColor,
    backgroundColor: 'transparent',
  },
  locationNote: {
    fontSize: 12,
    fontFamily: 'QUICKREGULAR',
    color: '#ff9800',
    marginTop: 5,
  },
  calendarSection: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
  },
  legendSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.textColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 0.4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'QUICKBLOD',
    color: COLORS.placeHolderColor,
  },
  submitButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: 56,
    justifyContent: 'center',
    marginLeft: 10,
    backgroundColor: COLORS.specialTextColor,
    alignItems: 'center',
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
  },
});

export default BookingModal;