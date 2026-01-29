import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, PADDING, TYPOGRAPHY} from '../constants/theme';

const GradientButton = ({
  title,
  onPress,
  children,
  colors = [COLORS.mainColor, COLORS.mainColor], // Use solid color instead of gradient
  buttonMainStyle,
  label,
  onClick,
  length,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{...styles.buttonContainer, width: length ?? '100%',...buttonMainStyle}}
      activeOpacity={1.0}>
      <LinearGradient
        colors={colors}
        style={styles.gradientButton}>
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '60%',
    height: 46,
    borderRadius: 10, // Updated to 10px border radius
    marginBottom: PADDING.medium,
  },
  gradientButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, // Updated to 10px border radius
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GradientButton;
