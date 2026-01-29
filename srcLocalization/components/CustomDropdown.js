import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from "../constants/theme";
import { useField } from "formik";
import { Dropdown } from "react-native-element-dropdown";
import { defaultStyles } from "../constants/Styles";


const CustomDropdown = ({
    label,
    leftIcon,
    rightIcon,
    style,
    data,
    placeholderColor,
    length,
    containerLength,
    onselectChange,
    ...props
}) => {
    const [isFocus, setIsFocus] = useState(false);

    const [field, meta, helpers] = useField(props.name);

  return (
    <>
      <View style={[styles.container, style]}>
      <View style={{...styles.inputContainer,borderColor:meta.touched && meta.error ? COLORS.red :COLORS.placeHolderColor}}>
        <Dropdown
        style={[styles.input, isFocus && { borderColor: "blue" }]}
        placeholderStyle={{...defaultStyles.placeholderStyle,color:placeholderColor?? COLORS.placeHolderColor}}
        selectedTextStyle={defaultStyles.placeholderStyle}
        containerStyle={{...styles.containerStyle,width:length ?? WIDTH*0.79,}}
        itemTextStyle={{...defaultStyles.placeholderStyle,color:COLORS.black}}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={200}
        labelField="item"
        valueField="value"
        value={field.value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
          helpers.setTouched(true);
        }}
        iconColor={COLORS.textColor}
        onChange={item => {
          helpers.setValue(item.value,true);
          // Do not manually clear error
          if (field.value !== item.value && (props.name === 'location' || props.name === 'category')) {
            onselectChange(item.value);
          }
        }}
        // onChange={(item) => {
        //   helpers.setValue(item.value);
        //   setIsFocus(false);
        // }}
        itemContainerStyle={styles.itemContainerStyle}
        {...props}
      />
      </View>

      {meta.touched && meta.error && <Text style={defaultStyles.errorText}>{meta.error}</Text>}
    </View>
    </>
  
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    position:'relative',
    paddingBottom:12
  },
  label: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color:COLORS.textColor,
    fontSize: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
    position: "absolute",
    top:2,
    left:24,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.placeHolderColor,
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
    color:COLORS.placeHolderColor,
    fontWeight:'500',
    paddingRight:0,
  },


  iconStyle: {
    width: 20,
    height: 20,
    color:COLORS.textColor
  },
  containerStyle:{
    width:WIDTH*0.79,
    marginLeft:-10,
    borderRadius:4,
    elevation:4,
    // marginTop:4
  },
  itemContainerStyle:{
    borderWidth:1,
    borderColor:COLORS.selectborder,
    borderBottomTop:0,
    borderTopColor:'transparent',
  }
});
