/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Pressable, Text, Platform} from 'react-native';
import {COLORS, HEIGHT, IOS, PADDING, TYPOGRAPHY, SHADOW} from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({
  children,
  label,
  onClick,
  step,
  rightIcon,
  backStyle,
  showBackButton = true,
  rightIconName,
  onRightIconPress
}) => {

  const navigation = useNavigation();

  const backHandler = () => {
    navigation.goBack();
  };

  const handleRightIconPress = () => {
    if (onRightIconPress) {
      onRightIconPress();
    } else {
      navigation?.navigate("Setting");
    }
  };

  const getRightIconName = () => {
    if (rightIconName) return rightIconName;
    if (rightIcon) return 'settings';
    return null;
  };


  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Left Section - Back Button */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <Pressable
              style={styles.iconButton}
              onPress={backHandler}
              android_ripple={{ color: 'rgba(47, 48, 145, 0.1)', radius: 20 }}
            >
              <Icon name="arrow-back" size={24} color={COLORS.textColor} />
            </Pressable>
          )}
        </View>

        {/* Center Section - Title and Step */}
        <View style={styles.centerSection}>
          <Text style={styles.headerTitle}>{label}</Text>
          {step && (
            <View style={styles.stepContainer}>
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>Step {step} of 6</Text>
              </View>
            </View>
          )}
        </View>

        {/* Right Section - Action Icon */}
        <View style={styles.rightSection}>
          {getRightIconName() && (
            <Pressable
              style={styles.iconButton}
              onPress={handleRightIconPress}
              android_ripple={{ color: 'rgba(47, 48, 145, 0.1)', radius: 20 }}
            >
              <Icon name={getRightIconName()} size={24} color={COLORS.mainColor} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    ...SHADOW.medium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.medium,
    minHeight: 56,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDING.small,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(47, 48, 145, 0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    textAlign: 'center',
  },
  stepContainer: {
    marginTop: 4,
  },
  stepIndicator: {
    backgroundColor: 'rgba(47, 48, 145, 0.1)',
    paddingHorizontal: PADDING.small,
    paddingVertical: 2,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.mainColor,
  },
});

export default CustomHeader;
