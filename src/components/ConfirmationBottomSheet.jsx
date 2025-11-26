// components/ConfirmationBottomSheet.jsx
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, PADDING, TYPOGRAPHY} from '../constants/theme';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

const ConfirmationBottomSheet = ({
  visible,
  title,
  message,
  icon = 'help-outline',
  iconColor = COLORS.specialTextColor,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View style={[styles.backdrop, {opacity: fadeAnim}]} />
      </Pressable>

      <Animated.View
        style={[
          styles.bottomSheet,
          {transform: [{translateY: slideAnim}]},
        ]}
      >
        <Pressable>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, {backgroundColor: `${iconColor}20`}]}>
              <Icon name={icon} size={40} color={iconColor} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <LinearGradient
                colors={
                  destructive
                    ? ['#ef4444', '#dc2626']
                    : ['#635bff', '#4a4ae0']
                }
                style={styles.confirmButtonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: PADDING.large + 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: PADDING.medium,
    marginBottom: PADDING.large,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: PADDING.large,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: PADDING.large,
    marginBottom: PADDING.large,
  },
  title: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: PADDING.small,
  },
  message: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: PADDING.large,
    gap: PADDING.medium,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: PADDING.medium + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  confirmButton: {
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: PADDING.medium + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ConfirmationBottomSheet;