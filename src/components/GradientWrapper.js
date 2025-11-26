import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/theme';

const GradientWrapper = ({
  children,
  colors = [COLORS.white, COLORS.white], // Default to white background
  useGradient = false, // Option to use actual gradient
  style
}) => {
  // If useGradient is false, just use a plain white background
  if (!useGradient) {
    return (
      <View style={[styles.gradient, { backgroundColor: COLORS.white }, style]}>
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  // Use gradient if explicitly requested
  return (
    <LinearGradient colors={colors} style={[styles.gradient, style]}>
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    // padding: 20,
    // borderRadius: 10,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  content: {
    flex: 1,
  },
});

export default GradientWrapper;
