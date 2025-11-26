/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import {COLORS, TYPOGRAPHY} from '../constants/theme';
import {defaultStyles} from '../constants/Styles';
import {ICONS} from '../constants/Icons';

const GradientBox = ({
  onPress,
  colors = ['#5ADAE3', '#0551AF'],
  buttonMainStyle,
  label,
  onClick,
  length,
  textColor,
  item,
  activeColor,
  heightBox,
  activePlan,
}) => {
  const memo = useMemo(() => activeColor, [activeColor]);
  return (
    <ImageBackground
      source={memo ? ICONS.Active : ICONS?.DISABLE}
      style={{width: length ?? '60%', marginTop: 10, height: heightBox ?? 46}}
      resizeMode="contain">
      <View
        style={[
          styles.buttonInside,
          {
            backgroundColor: activeColor,
            height: heightBox ? heightBox - 2 : 44,
          },
        ]}>
        <Text
          style={[
            styles.buttonText,
            {
              color: textColor,
              fontFamily: 'DMSerifDisplay-Regular',
              marginBottom: -16,
            },
          ]}>
          {item?.plan_title}
        </Text>
        <Text
          style={[
            styles.buttonText,
            defaultStyles.header,
            {color: textColor, fontSize: 60,lineHeight:60,marginVertical:10},
          ]}>
          ${item?.cost}
        </Text>
        <Text
          style={[
            styles.buttonText,
            defaultStyles.placeholderStyle,
            {color: textColor},
          ]}>
          {item?.description}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  borderGradient: {
    width: '60%',
    height: 46,
    borderRadius: 4,
  },
  buttonInside: {
    borderRadius: 4,

    height: 44,
    // flex: 1,
    margin: 1,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default GradientBox;
