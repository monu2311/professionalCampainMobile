import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {COLORS, TYPOGRAPHY} from '../constants/theme';

const ButtonWrapper = ({
  children,
  colors = ['#5ADAE3', '#0551AF'],
  buttonMainStyle,
  label,
  onClick,
  length,
  width,
  height = 46, // Default height, can be overridden
}) => {
  return (
    <View style={{padding: 10, width: width ?? length ?? '100%', ...buttonMainStyle}}>
      <Pressable style={[styles.content, {height: height}]} onPress={onClick}>
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    backgroundColor: COLORS.mainColor,
    borderRadius: 10, // Updated to 10px border radius
    borderWidth: 1,
    borderColor: COLORS.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ButtonWrapper;
