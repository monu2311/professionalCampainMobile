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
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {COLORS} from '../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const BookingModal = ({visible, onClose, companionData, onSubmit}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('60');
  const [serviceType, setServiceType] = useState('outcall');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

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
      date: moment(date).format('YYYY-MM-DD'),
      startTime: moment(startTime).format('HH:mm'),
      duration,
      serviceType,
      location: location || companionData?.location || 'Not specified',
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    onSubmit(bookingData);
    onClose();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
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
      onRequestClose={onClose}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
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
              top: -insets.top - 50, // Ensure full coverage including status bar
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
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.inputText}>
                  {moment(date).format('MMMM DD, YYYY')}
                </Text>
                <Icon name="calendar-today" size={20} color={COLORS.placeHolderColor} />
              </TouchableOpacity>
            </View>

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
                  <Picker.Item label="Outcall" value="outcall" />
                  <Picker.Item label="Incall" value="incall" />
                  <Picker.Item label="Virtual" value="virtual" />
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

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

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
    ...StyleSheet.absoluteFillObject,
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
  },
  locationNote: {
    fontSize: 12,
    fontFamily: 'QUICKREGULAR',
    color: '#ff9800',
    marginTop: 5,
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