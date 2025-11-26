import React, {memo, useMemo, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY, WIDTH} from '../constants/theme';
import {useField} from 'formik';
import {Dropdown} from 'react-native-element-dropdown';
import {defaultStyles} from '../constants/Styles';

const Select = ({
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

  // console.log("props.nameprops.name--->",field,meta,helpers)
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
          <Dropdown
            style={[styles.input, isFocus && {borderColor: 'blue'}]}
            placeholderStyle={defaultStyles.placeholderStyle}
            selectedTextStyle={defaultStyles.placeholderStyle}
            containerStyle={{...styles.containerStyle, ...containerStyle}}
            itemTextStyle={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
            }}
            iconStyle={styles.iconStyle}
            data={data ?? []}
            maxHeight={200}
            labelField="item"
            valueField="value"
            value={field.value || ''}
            iconColor={COLORS.textColor}
            onChange={item => {
              helpers.setValue(item.value,true);
              // Do not manually clear error
              if (field.value !== item.value && (props.name === 'country' || props.name === 'homelocation')) {
                onCountryChange(item.value);
              }
            }}
            itemContainerStyle={styles.itemContainerStyle}
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

export default memo(Select, (prevProps, nextProps) => {
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: COLORS.placeHolderColor,
    fontWeight: '500',
    paddingRight: 0,
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
});
