import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import sessionManager from '../utils/sessionManager';
import { COLORS, TYPOGRAPHY, PADDING, SHADOW } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const SessionExpiredModal = ({ visible }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); // Now we can use navigation!

  useEffect(() => {
    if (visible) {
      // Disable hardware back button when modal is visible
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true; // Prevent going back
      });

      // Animate modal in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(iconRotate, {
              toValue: 0.05,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(iconRotate, {
              toValue: -0.05,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(iconRotate, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
      ]).start();

      return () => backHandler.remove();
    } else {
      // Animate modal out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLogout = async () => {
    // Verification log to confirm new code is running
    console.log('🔥 NEW LOGOUT HANDLER RUNNING - NO NAVIGATION QUEUE!');

    try {
      // Clear all authentication data
      await AsyncStorage.multiRemove(['ChapToken', 'userData', 'account_step']);

      // Navigate directly using React Navigation (this will work!)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      console.log('✅ Navigation reset completed successfully');

      // Hide modal after navigation starts
      setTimeout(() => {
        sessionManager.hideSessionExpiredModal();
      }, 100);
    } catch (error) {
      console.error('Error during logout:', error);

      // Force navigate even if there's an error
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      // Still hide modal
      setTimeout(() => {
        sessionManager.hideSessionExpiredModal();
      }, 100);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={() => {
        // Prevent modal from closing on hardware back button
        return true;
      }}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            <View style={styles.modalContent}>
              {/* Icon Container */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: iconRotate.interpolate({
                            inputRange: [-1, 1],
                            outputRange: ['-30deg', '30deg'],
                          }),
                        },
                      ],
                    }}
                  >
                    <Icon name="lock-outline" size={50} color={COLORS.white} />
                  </Animated.View>
                </LinearGradient>
              </View>

              {/* Title */}
              <Text style={styles.title}>Session Expired</Text>

              {/* Message */}
              <Text style={styles.message}>
                Your session has expired for security reasons. Please login again to continue.
              </Text>

              {/* Warning Box */}
              <View style={styles.warningBox}>
                <Icon name="info-outline" size={20} color="#dc2626" />
                <Text style={styles.warningText}>
                  You must logout and login again to access the app
                </Text>
              </View>

              {/* Logout Button */}
              <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="logout" size={24} color={COLORS.white} />
                  <Text style={styles.buttonText}>Logout</Text>
                </LinearGradient>
              </Pressable>

              {/* Footer Note */}
              <Text style={styles.footerNote}>
                This is a security measure to protect your account
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    ...SHADOW.large,
    overflow: 'hidden',
  },
  modalContent: {
    padding: PADDING.extralarge,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: PADDING.large,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.medium,
  },
  title: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: PADDING.medium,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    marginBottom: PADDING.large,
    lineHeight: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: PADDING.medium,
    marginBottom: PADDING.extralarge,
    gap: PADDING.small,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: '#dc2626',
    lineHeight: 20,
  },
  logoutButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: PADDING.medium,
    ...SHADOW.button,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.large,
    gap: PADDING.small,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SessionExpiredModal;