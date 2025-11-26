/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {
  COLORS,
} from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { defaultStyles } from "../constants/Styles";

const CheckBox = ({options, activeValue, handleChange}) => {
  return (
    <View>
      {options?.map(Item => (
        <Pressable style={{display:'flex',alignItems:'center',flexDirection:'row',paddingTop:10}} onPress={()=>handleChange(Item?.value)}>
          <Icon
            name={
              activeValue === Item?.value
                ? 'check-box'
                : 'check-box-outline-blank'
            }
            size={18}
            color={
              COLORS?.black
            }
          />
          <Text style={{...defaultStyles?.placeholderStyle,color:COLORS.black,marginLeft:8}}>{Item?.item}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});

export default CheckBox;
