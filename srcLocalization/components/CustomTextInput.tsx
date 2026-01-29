import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, PADDING, WIDTH } from '../constants/theme';
import { useField } from 'formik';
import { useLanguageContext } from '../localization/LanguageProvider';
import { getTextAlign, getWritingDirection } from '../localization/RTLProvider';

const CustomTextInput = ({
    label,
    leftIcon,
    rightIcon,
    style,
    inputContainer,

    ...props
}) => {
    const [field, meta, helpers] = useField(props.name);
    const { isRTL } = useLanguageContext();

    // Create RTL-aware styles
    const labelStyle = [
      styles.label,
      {
        left: isRTL ? undefined : 24,
        right: isRTL ? 24 : undefined,
      }
    ];

    const inputStyle = [
      styles.input,
      {
        textAlign: getTextAlign(isRTL),
        writingDirection: getWritingDirection(isRTL),
      }
    ];

    const inputContainerStyle = [
      styles.inputContainer,
      {
        borderColor: meta.touched && meta.error ? COLORS.red : COLORS.borderColor,
        flexDirection: isRTL ? 'row-reverse' : 'row',
      },
      inputContainer
    ];

  return (
    <>
      <View style={[styles.container, style]}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          style={inputStyle}
          placeholder={props.placeholder}
          cursorColor={COLORS.placeHolderColor}
          keyboardType={props.keyboardType || 'default'}
          secureTextEntry={props.secureTextEntry || false}
          value={field.value}
          onChangeText={helpers.setValue}
          onBlur={() => helpers.setTouched(true)}
          {...props}
        />

        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {meta.touched && meta.error && <Text style={[styles.errorText, { textAlign: getTextAlign(isRTL) }]}>{meta.error}</Text>}
    </View>
    </>

  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    position:'relative',
    paddingBottom:12
    // backgroundColor:'blue'
  },
  label: {
    fontFamily: 'Quicksand-Bold',
    fontWeight: 'bold',
    color:COLORS.labelColor,
    fontSize: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
    position: 'absolute',
    top:2,
    zIndex: 1,
    // left/right positioning will be set dynamically based on RTL
  },
  inputContainer: {
    // flexDirection will be set dynamically based on RTL
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
    paddingHorizontal:8,
    fontSize:12,
    fontFamily:'Quicksand-Regular',
    color:COLORS.black,
    fontWeight:'500',
    textAlignVertical:'top',
  },
  icon: {
    marginHorizontal: 5,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 4,
  },
});
