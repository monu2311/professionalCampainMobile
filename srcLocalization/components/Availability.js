import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {COLORS} from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {defaultStyles} from '../constants/Styles';
import CustomTextInput from './CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useTranslation } from '../localization/hooks/useTranslation';
import { NAMESPACES } from '../localization/config/namespaces';
import { useLanguageContext } from '../localization/LanguageProvider';
import { getFlexDirection, getTextAlign, getWritingDirection } from '../localization/RTLProvider';

const Availability = ({activeValue, handleChange, errors, touched}) => {
    console.log("activeValueactiveValue",activeValue)
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  // Language and RTL context
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  const { isRTL, currentLanguage, forceUpdate } = useLanguageContext();

  // Localized weekdays array
  const localizedWeekdays = [
    t('forms:contact.monday'),
    t('forms:contact.tuesday'),
    t('forms:contact.wednesday'),
    t('forms:contact.thursday'),
    t('forms:contact.friday'),
    t('forms:contact.saturday'),
    t('forms:contact.sunday'),
  ];

  // Listen for language changes
  useEffect(() => {
    console.log(`📅 Availability: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
  }, [currentLanguage, isRTL, forceUpdate]);

  const showTimePicker = (day, key) => {
    setSelectedDay(day);
    setSelectedKey(key);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
    setSelectedDay(null);
    setSelectedKey(null);
  };

  const handleConfirm = date => {
    const formattedTime = moment(date).format('hh:mm A');
    console.log("selectedDay, selectedKey, formattedTime",selectedDay, selectedKey, formattedTime)
    handleTimeChange(selectedDay, selectedKey, formattedTime);
    hideTimePicker();
  };

  // ✅ Checks if a day is selected
  const isDaySelected = (day) => {
    const found = activeValue.find(item => item.day === day);
    return found?.isChecked;
  };
  // ✅ Handles Day Selection
//   const handleDayToggle = day => {
//     let updatedDays;
//     if (isDaySelected(day)) {
//       updatedDays = activeValue.filter(item => item.day !== day);
//     } else {
//       updatedDays = [...activeValue, {day, from: '', until: ''}];
//     }
//     handleChange(updatedDays);
//   };
  const handleDayToggle = (day) => {
    const updatedDays = activeValue.map(item =>
      item.day === day ? { ...item, isChecked: !item.isChecked } : item
    );
    handleChange(updatedDays);
  };

  // ✅ Handles Time Input Changes
  const handleTimeChange = (day, key, value) => {

    const updatedSlots = activeValue.map(item =>
      item.day === day ? {...item, [key]: value} : item,
    );

    console.log("updatedSlotsupdatedSlots",updatedSlots)
    handleChange(updatedSlots);
  };
  // console.log("errors?.availerrors?.avail",errors?.avail)

  return (
    <View>
      {localizedWeekdays.map((localizedDay, index) => {
        // Map localized day back to English for data matching
        const originalDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const originalDay = originalDays[index];
        const dayData = activeValue.find(item => item.day === originalDay) || {};

        return (
          <View key={originalDay} style={[styles.dayContainer, {
            flexDirection: getFlexDirection(isRTL, 'row'),
          }]}>
            <View style={[styles.dayLabel, {
              flexDirection: getFlexDirection(isRTL, 'row'),
            }]}>
              <Pressable onPress={() => handleDayToggle(originalDay)}>
                <Icon
                  name={
                    isDaySelected(originalDay) ? 'check-box' : 'check-box-outline-blank'
                  }
                  size={18}
                  color={COLORS.black}
                />
              </Pressable>
              <Text style={[styles.dayText, {
                textAlign: getTextAlign(isRTL),
                marginLeft: isRTL ? 0 : 8,
                marginRight: isRTL ? 8 : 0,
              }]}>{localizedDay}</Text>
            </View>

            {/* {isDaySelected(originalDay) && ( */}
            <View style={{
              flexDirection: getFlexDirection(isRTL, 'row'),
            }}>
              <Pressable
                onPress={() => showTimePicker(originalDay, 'from')}
                style={{width: '39.3%'}}>
                <CustomTextInput
                  label={t('forms:contact.from')}
                  placeholder={'10:00 AM'}
                  name={`from${originalDay}`}
                  style={{width: '100%'}}
                  value={dayData.from || ''}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>

              <Pressable
                onPress={() => showTimePicker(originalDay, 'until')}
                style={{width: '39.3%'}}>
                <CustomTextInput
                  label={t('forms:contact.until')}
                  placeholder={'10:00 AM'}
                  name={`until${originalDay}`}
                  style={{width: '100%'}}
                  value={dayData.until || ''}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
            </View>
            {/* )} */}
            {/* 
                    {console.log("akjshskajhd",errors.avail.some((item, idx) => {
                                console.log(`Error at index ${idx}:`, item);
                            return !item?.day || !item?.from || !item?.until;
                        }))} */}
            {/* Error Messages */}
            {/* {errors?.avail?.length > 0 && errors.avail.some((item, idx) => {
                                console.log(`Error at index ${idx}:`, item);
                            return !item?.day || !item?.from || !item?.until;
                        })} */}

            {/* {errors?.avail && touched?.avail && (
                            <Text style={styles.errorText}>{errors?.avail?.day  ??  errors?.avail?.from ?? errors?.avail?.day??errors?.avail}</Text>
                        )} */}
          </View>
        );
      })}

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        is24Hour={false}
      />
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  dayContainer: {
    display: 'flex',
    flexDirection: 'row', // Will be overridden by RTL-aware styling
    paddingTop: 10,
    width: '94%',
    alignSelf: 'center',
  },
  dayLabel: {
    flexDirection: 'row', // Will be overridden by RTL-aware styling
    alignItems: 'center',
    width: '41%',
  },
  dayText: {
    ...defaultStyles?.placeholderStyle,
    color: COLORS.black,
    fontSize: 15,
    textAlign: 'center',
    flex: 1,
    // marginLeft and marginRight will be set dynamically based on RTL
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    // marginLeft will be set dynamically based on RTL
  },
});

export default Availability;
