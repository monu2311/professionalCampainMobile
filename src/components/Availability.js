import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {COLORS} from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {defaultStyles} from '../constants/Styles';
import CustomTextInput from './CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Availability = ({activeValue, handleChange, errors, touched}) => {
    console.log("activeValueactiveValue",activeValue)
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

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
      {[
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ].map(day => {
        const dayData = activeValue.find(item => item.day === day) || {};
        return (
          <View key={day} style={styles.dayContainer}>
            <View style={styles.dayLabel}>
              <Pressable onPress={() => handleDayToggle(day)}>
                <Icon
                  name={
                    isDaySelected(day) ? 'check-box' : 'check-box-outline-blank'
                  }
                  size={18}
                  color={COLORS.black}
                />
              </Pressable>
              <Text style={styles.dayText}>{day}</Text>
            </View>

            {/* {isDaySelected(day) && ( */}
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => showTimePicker(day, 'from')}
                style={{width: '39.3%'}}>
                <CustomTextInput
                  label={'From'}
                  placeholder={'10:00 AM'}
                  name={`from${day}`}
                  style={{width: '100%'}}
                  value={dayData.from || ''}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>

              <Pressable
                onPress={() => showTimePicker(day, 'until')}
                style={{width: '39.3%'}}>
                <CustomTextInput
                  label={'Until'}
                  placeholder={'10:00 AM'}
                  name={`until${day}`}
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
    flexDirection: 'row',
    paddingTop: 10,
    width: '94%',
    alignSelf: 'center',
  },
  dayLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '41%',
  },
  dayText: {
    ...defaultStyles?.placeholderStyle,
    color: COLORS.black,
    marginLeft: 8,
    fontSize: 15,
    textAlign: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 45,
  },
});

export default Availability;
