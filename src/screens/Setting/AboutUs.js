import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import ButtonWrapper from '../../components/ButtonWrapper';
import {
  COLORS,
  HEIGHT,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
import {otherQueries} from '../../constants/Static';
import CustomTextInput from '../../components/CustomTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {defaultStyles} from '../../constants/Styles';
import {ICONS} from '../../constants/Icons';
import HTMLContent from '../../components/HTMLContent';

const AboutUs = ({navigation,data}) => {
  console.log("about us data",data)
  const submitHandler = () => {
    navigation.navigate('Final');
  };
  const cleanHTML = data?.description
  ?.replace(/\\r\\n/g, '')
  ?.replace(/\r?\n|\r/g, '');

  return (
    <ScrollView
      style={{backgroundColor: COLORS.white, padding: 5}}
      contentContainerStyle={{
        paddingBottom: 200,
        backgroundColor: COLORS.white,
      }}
      showsHorizontalScrollIndicator={false}
      >
      <Text
        style={{
          ...defaultStyles.header,
          color: COLORS.mainColor,
          alignSelf: 'flex-start',
          width: '100%',
          marginVertical: PADDING.small,
          paddingTop: 10,
          marginHorizontal: 10,
          marginBottom: PADDING.medium,
          fontSize: 20,
        }}>
       {data?.title}
      </Text>
      <HTMLContent
        content={data?.description}
        fontSize={14}
        textColor={COLORS.textColor}
        fontFamily={TYPOGRAPHY.QUICKREGULAR}
      />
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontSize: 15,
  },
  light: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontSize: 14,
    marginTop: PADDING.small,
    lineHeight: 26,
  },
  imgBox: {
    width: '96%',
    height: HEIGHT * 0.25,
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default AboutUs;
