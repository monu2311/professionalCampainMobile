/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {
  COLORS,
} from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from "../constants/Styles";
import { useLanguageContext } from '../localization/LanguageProvider';
import { getFlexDirection, getTextAlign } from '../localization/RTLProvider';

const Radio = ({options, activeValue, handleChange}) => {
  // Language and RTL context
  const { isRTL, currentLanguage, forceUpdate } = useLanguageContext();

  // Listen for language changes
  useEffect(() => {
    console.log(`📻 Radio: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
  }, [currentLanguage, isRTL, forceUpdate]);

  return (
    <View>
      {options?.map((Item, index) => (
        <Pressable
          key={index}
          style={{
            display:'flex',
            alignItems:'center',
            flexDirection: getFlexDirection(isRTL, 'row'),
            paddingTop:10
          }}
          onPress={()=>handleChange(Item?.value)}
        >
          <Icon
            name={
              activeValue === Item?.value
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={18}
            color={
              activeValue == Item?.value
                ? COLORS.specialTextColor
                : COLORS.placeHolderColor
            }
          />
          <Text style={{
            ...defaultStyles?.placeholderStyle,
            color:COLORS.black,
            marginLeft: isRTL ? 0 : 8,
            marginRight: isRTL ? 8 : 0,
            textAlign: getTextAlign(isRTL),
            flex: 1
          }}>{Item?.item}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Radio;
