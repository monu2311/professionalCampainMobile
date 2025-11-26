/* eslint-disable react-native/no-inline-styles */
import React, {memo, useMemo, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY, WIDTH} from '../constants/theme';
import {useField} from 'formik';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {defaultStyles} from '../constants/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const datas = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];

const MultiDropDown = ({
  label,
  leftIcon,
  rightIcon,
  style,
  data,
  containerStyle,
  onCountryChange,
  ...props
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const [field, meta, helpers] = useField(props.name);
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.item}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
    <>
      <View style={[styles.container, style]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={{
            ...styles.inputContainer,
            borderColor:
              meta.touched && meta.error ? COLORS.red : COLORS.borderColor,
          }}>
          <MultiSelect
            style={[styles.input, isFocus && {borderColor: 'blue'}]}
            placeholderStyle={defaultStyles.placeholderStyle}
            selectedTextStyle={defaultStyles.placeholderStyle}
            containerStyle={{...styles.containerStyle, ...containerStyle}}
            itemTextStyle={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
            }}
            iconStyle={styles.iconStyle}
            data={data ?? datas ?? []}
            maxHeight={200}
            labelField="item"
            valueField="value"
            value={field.value || ''}
            iconColor={COLORS.textColor}
            onChange={item => {
              helpers.setValue(item, true);
            }}
            renderRightIcon={() => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {field.value?.length > 1 && (
                  <Pressable
                    style={{
                      backgroundColor: COLORS.boxColor,
                      marginTop:2,
                      width: 26,
                      height: 26,
                      borderRadius: 50,
                      marginHorizontal: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                    }}>
                    <Text>+{field.value?.length - 1}</Text>
                  </Pressable>
                )}

                <MaterialCommunityIcons
                  color="black"
                  name="chevron-down"
                  size={19}
                />
              </View>
            )}
            inside={true}
            visibleSelectedItem={false}
            itemContainerStyle={styles.itemContainerStyle}
            renderItem={renderItem}
            renderSelectedItem={(item, unSelect) => {
              const selectedValues = field.value || [];
              // Render only the first selected item
              if (selectedValues[0] !== item.value) {
                return <></>;
              }
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => unSelect && unSelect(item)}
                    style={styles.selectedStyle}
                  >
                    <Text style={styles.textSelectedStyle}>
                      {item.item}
                    </Text>
                    {/* <AntDesign color="black" name="delete" size={10} /> */}
                  </TouchableOpacity>
                </View>
              );
            }}
            {...props}
          />
        </View>

        {meta.touched && meta.error && (
          <Text style={defaultStyles.errorText}>{meta.error}</Text>
        )}
      </View>
    </>
  );
};

export default memo(MultiDropDown, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.name === nextProps.name &&
    prevProps.data === nextProps.data && // Ensure `data` isn't changing unnecessarily
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style) &&
    JSON.stringify(prevProps.containerStyle) ===
      JSON.stringify(nextProps.containerStyle) &&
    prevProps.onCountryChange === nextProps.onCountryChange
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    position: 'relative',
    paddingBottom: 12,
  },
  label: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.labelColor,
    fontSize: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
    position: 'absolute',
    top: 2,
    left: 24,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: 4,
    height: 46,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: COLORS.placeHolderColor,
    fontWeight: '500',
    paddingRight: 0,
    // overflow:'scroll',
    // flexDirection:'row',
    // backgroundColor:'red'
  },

  iconStyle: {
    width: 20,
    height: 20,
    color: COLORS.textColor,
  },
  containerStyle: {
    width: WIDTH * 0.79,
    marginLeft: -10,
    borderRadius: 4,
    elevation: 4,
    // marginTop:4
  },
  itemContainerStyle: {
    borderWidth: 1,
    borderColor: COLORS.selectborder,
    borderBottomTop: 0,
    borderTopColor: 'transparent',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    // borderWidth: 0.5,
    backgroundColor: 'white',
    // borderColor: COLORS.placeHolderColor,
    marginRight: 12,
    // paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 12,
    // padding: 17,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
 
});
